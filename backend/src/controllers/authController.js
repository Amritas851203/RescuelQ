import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rescueiq_super_secret_key_2026';
const OTP_EXPIRY_MINS = 10;

// Email Transporter (Placeholder - needs real credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"RescueIQ Command" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Operational Access Code: ' + otp,
    html: `
      <div style="background-color: #020617; color: white; padding: 40px; font-family: sans-serif; border-radius: 10px; border: 1px solid #1e293b;">
        <h1 style="color: #ef4444; text-transform: uppercase; letter-spacing: 2px;">RescueIQ Authentication</h1>
        <p style="font-size: 16px; color: #94a3b8;">You have requested operational access. Use the following code to verify your identity:</p>
        <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #3b82f6; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #3b82f6;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">This code expires in ${OTP_EXPIRY_MINS} minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Don't await here to prevent blocking the main thread if SMTP is slow
      transporter.sendMail(mailOptions).catch(err => {
        console.error('ASYNCHRONOUS EMAIL ERROR:', err.message);
      });
      console.log('OTP Email queued for:', email);
    } else {
      console.warn('EMAIL_USER or EMAIL_PASS not set. OTP for', email, 'is:', otp);
    }
  } catch (error) {
    console.error('Failed to initiate email send:', error);
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body || {};

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required enlistment fields' });
    }

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('SUPABASE CHECK ERROR:', checkError);
      return res.status(500).json({ error: `Supabase Connection Error: ${checkError.message || 'Unknown network error'}` });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'Operator already enlisted with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINS * 60000);

    // Store User & OTP in Supabase (transaction-like)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{ email, password_hash: hashedPassword, full_name: fullName, is_verified: true }])
      .select()
      .single();

    if (userError) {
      console.error('DATABASE ERROR (users):', userError);
      throw userError;
    }

    const { error: otpError } = await supabase
      .from('otps')
      .upsert([{ email, code: otp, expires_at: expiresAt.toISOString() }]);

    if (otpError) {
      console.error('DATABASE ERROR (otps):', otpError);
      throw otpError;
    }

    // Send Email (Non-blocking)
    sendOTPEmail(email, otp);

    res.status(201).json({ 
      message: 'Signup successful. Operational access code transmitted to email.', 
      email 
    });
  } catch (error) {
    console.error('SIGNUP CRITICAL ERROR:', error);
    res.status(500).json({ error: error.message || 'An internal error occurred during enlistment' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const { data: otpData, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (otpError || !otpData) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (new Date(otpData.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Mark user as verified
    await supabase.from('users').update({ is_verified: true }).eq('email', email);
    
    // Delete OTP
    await supabase.from('otps').delete().eq('email', email);

    // Generate Token
    const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Account verified', token, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    // SYSTEM OVERRIDE FOR DEVELOPMENT (High Priority)
    if (cleanEmail === 'amritasingh38381@gmail.com' && cleanPassword === 'rescueiq') {
      console.log('MASTER ACCOUNT LOGIN TRIGGERED:', cleanEmail);
      const token = jwt.sign({ id: 'admin-override', email: cleanEmail }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ 
        token, 
        user: { id: 'admin-override', email: cleanEmail, fullName: 'System Commander' } 
      });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Account not verified. Please check your email.', unverified: true });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { id: user.id, email: user.email, fullName: user.full_name } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINS * 60000);

    await supabase.from('otps').upsert([{ email, code: otp, expires_at: expiresAt.toISOString() }]);
    await sendOTPEmail(email, otp);

    res.json({ message: 'Reset code sent to your email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const { data: otpData } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (!otpData || new Date(otpData.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await supabase.from('users').update({ password_hash: hashedPassword }).eq('email', email);
    await supabase.from('otps').delete().eq('email', email);

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
