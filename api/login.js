import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Initialiser Supabase-klienten inne i handler
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Tillat kun POST-forespørsler
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Aktiver CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Håndter OPTIONS-forespørsel for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { username, password } = req.body;

    // Valider input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Brukernavn og passord er påkrevd' 
      });
    }

    // Hent bruker fra databasen
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Feil brukernavn eller passord' 
      });
    }

    // Sammenlign passord med bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Feil brukernavn eller passord' 
      });
    }

    // Login vellykket - returner brukerinfo (ikke passord!)
    return res.status(200).json({
      success: true,
      message: 'Innlogging vellykket',
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'En feil oppstod under innlogging',
      details: error.message 
    });
  }
}
