import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { userId, promptText, score, category } = req.body;

    if (!userId || !promptText || score === undefined || !category) {
      return res.status(400).json({ 
        error: 'userId, promptText, score og category er påkrevd' 
      });
    }

    // Lagre prompt i databasen
    const { data, error } = await supabase
      .from('saved_prompts')
      .insert([
        {
          user_id: userId,
          prompt_text: promptText,
          score: score,
          category: category
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Kunne ikke lagre prompt' });
    }

    return res.status(200).json({ 
      success: true, 
      prompt: data 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Serverfeil' });
  }
}
