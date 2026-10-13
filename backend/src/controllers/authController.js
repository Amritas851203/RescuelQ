import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { getJwtSecret } from '../middleware/authMiddleware.js';

const OTP_EXPIRY_MINS = 10;

// Email Transporter (configures SMTP if credentials are provided in .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"RescueIQ Tactical Command" <${process.env.EMAIL_USER || 'no-reply@rescueiq.ai'}>`,
    to: email,
    subject: `Operational Access Code: ${otp}`,
    html: `
      <div style="background-color: #020617; color: white; padding: 40px; font-family: sans-serif; border-radius: 10px; border: 1px solid #1e293b;">
        <h1 style="color: #ef4444; text-transform: uppercase; letter-spacing: 2px;">RescueIQ Authentication</h1>
        <p style="font-size: 16px; color: #94a3b8;">You have requested operational access. Use the following code to verify your identity:</p>
        <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #3b82f6; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #3b82f6;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b;">This code expires in ${OTP_EXPIRY_MINS} minutes. If you did not request this, please disregard this transmission.</p>
      </div>
    `,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail(mailOptions).catch(err => {
        console.error('ASYNCHRONOUS EMAIL ERROR:', err.message);
      });
      console.log('OTP Email queued for:', email);
    } else {
      console.info(`[AUTH NOTICE] EMAIL_USER/PASS not set. Access verification code for ${email} is: ${otp}`);
    }
  } catch (error) {
    console.error('Failed to initiate email send:', error.message);
  }
};

/**
 * Register a new user in MongoDB Atlas
 */
export const signup = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body || {};

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required registration fields (fullName, email, password).' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An operator is already registered with this email address.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINS * 60000);

    // Create user in MongoDB
    await User.create({
      name: fullName.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'responder',
      is_verified: false
    });

    // Store OTP in MongoDB
    await OTP.findOneAndUpdate(
      { email: cleanEmail },
      { code: otp, expires_at: expiresAt },
      { upsert: true, new: true }
    );

    // Transmit OTP
    await sendOTPEmail(cleanEmail, otp);

    res.status(201).json({ 
      message: 'Signup successful. Tactical access code transmitted.', 
      email: cleanEmail 
    });
  } catch (error) {
    console.error('SIGNUP ERROR:', error);
    res.status(500).json({ error: error.message || 'An error occurred during enlistment.' });
  }
};

/**
 * Verify OTP and issue first JWT token
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    const otpData = await OTP.findOne({ email: cleanEmail, code: cleanCode });

    if (!otpData) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    if (new Date() > otpData.expires_at) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email: cleanEmail },
      { is_verified: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Operator profile not found.' });
    }

    // Delete used OTP
    await OTP.deleteOne({ email: cleanEmail });

    // Generate real JWT
    const secret = getJwtSecret();
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role || 'responder' },
      secret,
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Account verified successfully.', 
      token, 
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        fullName: user.name,
        role: user.role || 'responder',
        avatar: user.avatar
      } 
    });
  } catch (error) {
    console.error('VERIFY OTP ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Authenticate user with email and password, issue real signed JWT
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Look up user in MongoDB with password hash
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Verify bcrypt password hash
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Require account verification
    if (!user.is_verified) {
      // Re-issue an OTP to help the user complete verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINS * 60000);
      await OTP.findOneAndUpdate({ email: cleanEmail }, { code: otp, expires_at: expiresAt }, { upsert: true });
      sendOTPEmail(cleanEmail, otp);

      return res.status(403).json({ 
        error: 'Account not verified. A new tactical verification code has been dispatched to your email.', 
        unverified: true,
        email: cleanEmail
      });
    }

    // Generate real cryptographically signed JWT
    const secret = getJwtSecret();
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role || 'responder' }, 
      secret, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        fullName: user.name,
        role: user.role || 'responder',
        avatar: user.avatar
      } 
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ error: error.message || 'Authentication service error.' });
  }
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Operator profile not found.' });
    }

    res.json({ 
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.name,
        role: user.role || 'responder',
        avatar: user.avatar,
        is_verified: user.is_verified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('GET ME ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Terminate user session
 */
export const logout = async (req, res) => {
  res.status(200).json({ message: 'Session terminated successfully.' });
};

/**
 * Forgot password - generate and email OTP
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: 'No operator profile registered with this email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINS * 60000);

    await OTP.findOneAndUpdate(
      { email: cleanEmail },
      { code: otp, expires_at: expiresAt },
      { upsert: true, new: true }
    );
    await sendOTPEmail(cleanEmail, otp);

    res.json({ message: 'Password reset code transmitted to your email address.' });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reset password with verified OTP
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    const otpData = await OTP.findOne({ email: cleanEmail, code: cleanCode });

    if (!otpData || otpData.expires_at < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email: cleanEmail }, { password: hashedPassword });
    await OTP.deleteOne({ email: cleanEmail });

    res.json({ message: 'Password updated successfully. You may now log in with your new credentials.' });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};
