-- FortunFree Database Schema 
-- This file documents the database structure for reference 
-- Note: Supabase tables are created through the Supabase dashboard 


-- Users table (managed by Supabase Auth) 
-- This table is automatically created by Supabase 
-- Contains: id, email, encrypted_password, email_confirmed_at, etc. 


-- User profiles table 
CREATE TABLE IF NOT EXISTS userdata ( 
  id SERIAL PRIMARY KEY, 
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, 
  name VARCHAR(255) NOT NULL, 
  birth DATE NOT NULL, 
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')), 
  purpose TEXT, 
  subscription_status VARCHAR(20) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'expired')), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), 
  UNIQUE(user_id) 
); 


-- Messages/Fortune readings table (if needed) 
CREATE TABLE IF NOT EXISTS messages ( 
  id SERIAL PRIMARY KEY, 
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, 
  content TEXT NOT NULL, 
  type VARCHAR(50) DEFAULT 'fortune', 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
); 


-- Indexes for better performance 
CREATE INDEX IF NOT EXISTS idx_userdata_user_id ON userdata(user_id); 
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id); 
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at); 


-- Row Level Security (RLS) Policies 
-- Enable RLS on tables 
ALTER TABLE userdata ENABLE ROW LEVEL SECURITY; 
ALTER TABLE messages ENABLE ROW LEVEL SECURITY; 


-- Policies for userdata table 
CREATE POLICY "Users can view own profile" ON userdata 
  FOR SELECT USING (auth.uid() = user_id); 


CREATE POLICY "Users can insert own profile" ON userdata 
  FOR INSERT WITH CHECK (auth.uid() = user_id); 


CREATE POLICY "Users can update own profile" ON userdata 
  FOR UPDATE USING (auth.uid() = user_id); 


CREATE POLICY "Users can delete own profile" ON userdata 
  FOR DELETE USING (auth.uid() = user_id); 


-- Policies for messages table 
CREATE POLICY "Users can view own messages" ON messages 
  FOR SELECT USING (auth.uid() = user_id); 


CREATE POLICY "Users can insert own messages" ON messages 
  FOR INSERT WITH CHECK (auth.uid() = user_id); 


CREATE POLICY "Users can delete own messages" ON messages 
  FOR DELETE USING (auth.uid() = user_id);