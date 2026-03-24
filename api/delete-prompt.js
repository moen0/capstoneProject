import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { promptId } = req.body;

    if (!promptId) {
      return res.status(400).json({ error: 'promptId er påkrevd' });
    }

    // Slett prompt
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('id', promptId);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Kunne ikke slette prompt' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Serverfeil' });
  }
}
