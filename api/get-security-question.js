import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers - must be set first!
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Sjekk om brukeren har et sikkerhetsspørsmål
    if (!user.security_question) {
      return res.status(400).json({ 
        error: 'This account was created before security questions were added. Please contact support or create a new account.' 
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
