import { supabase } from '../config/supabase.js';

export const getSOSReports = async (req, res) => {
  try {
    // Note: If supabase is not fully configured, this will fail. We use mock data fallback.
    const { data, error } = await supabase
      .from('sos_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SOS reports' });
  }
};

export const createSOSReport = async (req, res) => {
  try {
    const reportData = req.body;
    const { data, error } = await supabase
      .from('sos_reports')
      .insert([reportData])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Emit socket event to frontend
    req.io.emit('NEW_SOS_REPORT', data[0]);

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SOS report' });
  }
};
