import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId er påkrevd' });
    }

    // Hent brukerinfo, stats og badges parallelt
    const [userResult, statsResult, badgesResult, promptsResult] = await Promise.all([
      supabase.from('users').select('id, username, created_at').eq('id', userId).single(),
      supabase.from('user_stats').select('*').eq('user_id', userId).single(),
      supabase.from('user_badges').select('*').eq('user_id', userId),
      supabase.from('saved_prompts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    ]);

    // Sjekk for feil
    if (userResult.error) {
      console.error('User error:', userResult.error);
      return res.status(404).json({ error: 'Bruker ikke funnet' });
    }

    // Stats og badges kan være tomme for nye brukere
    const stats = statsResult.data || {
      prompt_helper_uses: 0,
      quizzes_completed: 0,
      perfect_quizzes: 0
    };

    const badges = badgesResult.data || [];
    const prompts = promptsResult.data || [];

    // Sjekk om badges basert på antall lagrede prompts skal låses opp
    const promptBadges = [];
    if (prompts.length >= 5) {
      promptBadges.push('saver');
    }
    if (prompts.filter(p => p.score >= 70).length >= 3) {
      promptBadges.push('quality-writer');
    }

    return res.status(200).json({
      success: true,
      user: userResult.data,
      stats: stats,
      badges: badges,
      prompts: prompts,
      promptBasedBadges: promptBadges
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Serverfeil' });
  }
}
