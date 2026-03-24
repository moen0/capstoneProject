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

    if (username.length < 3) {
      return res.status(400).json({ 
        error: 'Brukernavnet må være minst 3 tegn' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Passordet må være minst 6 tegn' 
      });
    }

    // Sjekk om brukernavnet allerede eksisterer
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Brukernavnet er allerede i bruk' 
      });
    }

    // Hash passordet med bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Lagre bruker i databasen
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          password: passwordHash
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Returner suksess (ikke send passord tilbake!)
    return res.status(201).json({
      success: true,
      message: 'Bruker registrert vellykket',
      user: {
        id: data.id,
        username: data.username,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'En feil oppstod under registrering',
      details: error.message 
    });
  }
}
