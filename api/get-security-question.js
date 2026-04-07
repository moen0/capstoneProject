import { createClient } from '@supabase/supabase-js';

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
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ 
        error: 'Username is required' 
      });
    }

    // Hent brukerens sikkerhetsspørsmål
    const { data: user, error } = await supabase
      .from('users')
      .select('security_question')
      .eq('username', username)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      securityQuestion: user.security_question
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'An error occurred',
      details: error.message 
    });
  }
}
