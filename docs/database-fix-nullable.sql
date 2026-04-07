-- ================================================
-- Fix NOT NULL Constraints
-- ================================================
-- If security_question and security_answer columns exist 
-- but have NOT NULL constraints without defaults, this will fix it
-- ================================================

-- Option 1: Allow NULL values temporarily (if you have existing users)
ALTER TABLE users 
ALTER COLUMN security_question DROP NOT NULL;

ALTER TABLE users 
ALTER COLUMN security_answer DROP NOT NULL;

-- Option 2: Set columns to NOT NULL (this is what we want for new users)
-- Only run this after existing users have values
-- ALTER TABLE users 
-- ALTER COLUMN security_question SET NOT NULL;
-- 
-- ALTER TABLE users 
-- ALTER COLUMN security_answer SET NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
