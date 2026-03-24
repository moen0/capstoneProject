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
    const { userId, statType, increment = 1 } = req.body;

    if (!userId || !statType) {
      return res.status(400).json({ 
        error: 'userId og statType er påkrevd' 
      });
    }

    // Valider statType
    const validStatTypes = ['prompt_helper_uses', 'quizzes_completed', 'perfect_quizzes'];
    if (!validStatTypes.includes(statType)) {
      return res.status(400).json({ error: 'Ugyldig statType' });
    }

    // Hent nåværende stats
    let { data: existingStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Database error:', fetchError);
      return res.status(500).json({ error: 'Kunne ikke hente statistikk' });
    }

    let data;
    if (existingStats) {
      // Oppdater eksisterende stats
      const newValue = (existingStats[statType] || 0) + increment;
      const updateData = {
        [statType]: newValue,
        updated_at: new Date().toISOString()
      };

      const { data: updatedData, error: updateError } = await supabase
        .from('user_stats')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        return res.status(500).json({ error: 'Kunne ikke oppdatere statistikk' });
      }
      data = updatedData;
    } else {
      // Opprett ny stats-rad
      const insertData = {
        user_id: userId,
        prompt_helper_uses: 0,
        quizzes_completed: 0,
        perfect_quizzes: 0,
        [statType]: increment
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('user_stats')
        .insert([insertData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return res.status(500).json({ error: 'Kunne ikke opprette statistikk' });
      }
      data = insertedData;
    }

    // Sjekk om nye badges skal låses opp
    await checkAndUnlockBadges(supabase, userId, data);

    return res.status(200).json({ 
      success: true, 
      stats: data 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Serverfeil' });
  }
}

// Hjelpefunksjon for å sjekke og låse opp badges
async function checkAndUnlockBadges(supabase, userId, stats) {
  const badgesToCheck = [
    { id: 'first-prompt', condition: stats.prompt_helper_uses >= 1 },
    { id: 'prompt-master', condition: stats.prompt_helper_uses >= 3 },
    { id: 'prompt-expert', condition: stats.prompt_helper_uses >= 10 },
    { id: 'quiz-starter', condition: stats.quizzes_completed >= 1 },
    { id: 'quiz-master', condition: stats.quizzes_completed >= 3 },
    { id: 'perfect-score', condition: stats.perfect_quizzes >= 1 }
  ];

  for (const badge of badgesToCheck) {
    if (badge.condition) {
      // Sjekk om badge allerede er låst opp
      const { data: existing } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_id', badge.id)
        .single();

      if (!existing) {
        // Lås opp badge
        await supabase
          .from('user_badges')
          .insert([{ user_id: userId, badge_id: badge.id }]);
      }
    }
  }
}
