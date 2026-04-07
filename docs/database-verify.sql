-- ================================================
-- Database Verification Script
-- ================================================
-- Run this to check if your database is configured correctly
-- ================================================

-- Check if users table exists and see its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check if all required columns exist
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'username'
        ) THEN '✓ username exists'
        ELSE '✗ username MISSING'
    END as username_check,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'password'
        ) THEN '✓ password exists'
        ELSE '✗ password MISSING'
    END as password_check,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'security_question'
        ) THEN '✓ security_question exists'
        ELSE '✗ security_question MISSING'
    END as security_question_check,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'security_answer'
        ) THEN '✓ security_answer exists'
        ELSE '✗ security_answer MISSING'
    END as security_answer_check;

-- Check current users count
SELECT COUNT(*) as total_users FROM users;

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'users';
