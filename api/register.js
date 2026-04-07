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
    const { username, password, securityQuestion, securityAnswer } = req.body;

    // Valider input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    if (!securityQuestion || !securityAnswer) {
      return res.status(400).json({ 
        error: 'Security question and answer are required' 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    if (securityAnswer.length < 2) {
      return res.status(400).json({ 
        error: 'Security answer must be at least 2 characters' 
      });
    }

    // Sjekk om brukernavnet allerede eksisterer
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username is already taken' 
      });
    }

    // Hash passordet og sikkerhetssvaret med bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), saltRounds);

    // Lagre bruker i databasen
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          password: passwordHash,
          security_question: securityQuestion,
          security_answer: securityAnswerHash
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        error: 'Database error: ' + (error.message || 'Could not create user'),
        code: error.code,
        hint: error.hint
      });
    }

    // Returner suksess (ikke send passord tilbake!)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: data.id,
        username: data.username,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return detailed error information
    return res.status(500).json({ 
      error: error.message || 'An error occurred during registration',
      errorType: error.name,
      details: 'Please check that: 1) Database is updated with security_question and security_answer columns, 2) All required fields are provided',
      timestamp: new Date().toISOString()
    });
  }
}
