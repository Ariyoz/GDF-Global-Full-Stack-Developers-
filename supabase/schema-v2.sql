-- ══════════════════════════════════════════════════════════════
-- GFD Platform — Schema V2: Messaging, Analytics, Wallet
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ══════════════════════════════════════════════════════════════

-- ── Profile Views (tracking) ──
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Messages ──
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(participant_1, participant_2)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Wallet / Transactions ──
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) DEFAULT 0,
  total_earned DECIMAL(12,2) DEFAULT 0,
  total_withdrawn DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'payment', 'withdrawal', 'bonus', 'refund'
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference TEXT,
  status TEXT DEFAULT 'completed', -- 'completed', 'pending', 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── RLS for new tables ──
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profile Views
CREATE POLICY "Anyone can log a view" ON profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can see own profile views" ON profile_views FOR SELECT USING (auth.uid() = profile_id);

-- Conversations
CREATE POLICY "Users can see own conversations" ON conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages
CREATE POLICY "Users can see messages in their conversations" ON messages FOR SELECT USING (
  conversation_id IN (SELECT id FROM conversations WHERE participant_1 = auth.uid() OR participant_2 = auth.uid())
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Wallets
CREATE POLICY "Users can see own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON wallets FOR ALL USING (true);

-- Transactions
CREATE POLICY "Users can see own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create transactions" ON transactions FOR INSERT WITH CHECK (true);

-- ── Auto-create wallet on profile creation ──
CREATE OR REPLACE FUNCTION handle_new_profile_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_wallet
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile_wallet();

-- ── Auto-create notification on job application ──
CREATE OR REPLACE FUNCTION notify_job_application()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, message, type, link)
  SELECT client_id, 'New application received for your job posting', 'job', '/dashboard/projects'
  FROM jobs WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_job_application
  AFTER INSERT ON job_applications
  FOR EACH ROW EXECUTE FUNCTION notify_job_application();

-- ── Auto-create notification on new message ──
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  recipient UUID;
BEGIN
  SELECT CASE
    WHEN c.participant_1 = NEW.sender_id THEN c.participant_2
    ELSE c.participant_1
  END INTO recipient
  FROM conversations c WHERE c.id = NEW.conversation_id;

  INSERT INTO notifications (user_id, message, type, link)
  VALUES (recipient, 'You have a new message', 'message', '/messaging');

  UPDATE conversations SET last_message = NEW.content, last_message_at = now()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- ── Auto-create notification on post like ──
CREATE OR REPLACE FUNCTION notify_post_like()
RETURNS TRIGGER AS $$
DECLARE
  post_author UUID;
BEGIN
  SELECT author_id INTO post_author FROM community_posts WHERE id = NEW.post_id;
  IF post_author != NEW.user_id THEN
    INSERT INTO notifications (user_id, message, type, link)
    VALUES (post_author, 'Someone liked your post', 'like', '/feed');
  END IF;
  
  UPDATE community_posts SET likes = likes + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_liked
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION notify_post_like();

-- ── Decrement likes on unlike ──
CREATE OR REPLACE FUNCTION handle_post_unlike()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET likes = GREATEST(likes - 1, 0) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_unliked
  AFTER DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION handle_post_unlike();

-- ── Increment comment count ──
CREATE OR REPLACE FUNCTION handle_new_comment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_added
  AFTER INSERT ON post_comments
  FOR EACH ROW EXECUTE FUNCTION handle_new_comment();

-- ── Decrement comment count ──
CREATE OR REPLACE FUNCTION handle_delete_comment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_deleted
  AFTER DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION handle_delete_comment();

-- ── Increment post count on user ──
CREATE OR REPLACE FUNCTION handle_new_post()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET post_count = post_count + 1 WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_created
  AFTER INSERT ON community_posts
  FOR EACH ROW EXECUTE FUNCTION handle_new_post();
