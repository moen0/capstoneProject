import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { username, securityAnswer, newPassword } = req.body;

    if (!username || !securityAnswer || !newPassword) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Hent bruker og sikkerhetssvar
    const { data: user, error } = await supabase
      .from('users')
      .select('id, security_answer')
      .eq('username', username)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Verifiser sikkerhetssvar (sammenlign med hashet versjon)
    const isAnswerValid = await bcrypt.compare(
      securityAnswer.toLowerCase().trim(), 
      user.security_answer
    );

    if (!isAnswerValid) {
      return res.status(401).json({ 
        error: 'Incorrect security answer' 
      });
    }

    // Hash nytt passord
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Oppdater passord i databasen
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPasswordHash })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while resetting password',
      details: error.message 
    });
  }
}
