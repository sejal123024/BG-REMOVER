# Supabase Setup Guide for BG Remover

## 🔧 Required Configuration

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign in/up with your Google account
4. Create a new project with:
   - **Project Name**: `bg-remover` (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users

### 2. Get Your Credentials
Once project is created, go to:
- **Project Settings** → **API**
- Copy these values:
  ```
  VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=YOUR-ANON-PUBLIC-KEY
  ```

### 3. Update Environment Variables
Create/update your `.env` file:
```env
VITE_SUPABASE_URL="https://your-actual-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-actual-anon-key"
VITE_SUPABASE_PROJECT_ID="your-actual-project-ref"
VITE_BG_REMOVE_WEBHOOK_URL="https://sejalkumavat.app.n8n.cloud/webhook/bg-remover"
```

### 4. Configure Google OAuth
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - **Authorized redirect URIs**: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
4. Copy **Client ID** and **Client Secret** to Supabase

### 5. Create Database Tables
Go to **SQL Editor** → **New query** and run:

```sql
-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  original_url TEXT,
  result_url TEXT,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS uploads_user_id_idx ON uploads(user_id);
CREATE INDEX IF NOT EXISTS uploads_created_at_idx ON uploads(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own uploads" ON uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads" ON uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" ON uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads" ON uploads
  FOR DELETE USING (auth.uid() = user_id);
```

### 6. Test the Connection
Start your app and check:
- **Browser Console** for connection status
- **Login/Signup pages** should show connection errors if not configured
- Try creating an account with email/password
- Try Google login

## 🚨 Common Issues & Solutions

### Issue: "Missing environment variables"
**Solution**: Update your `.env` file with actual Supabase credentials

### Issue: "OAuth provider not configured" 
**Solution**: Configure Google OAuth in Supabase Dashboard

### Issue: "No provider" error
**Solution**: Enable Google provider in Supabase Authentication settings

### Issue: "Invalid redirect_uri"
**Solution**: Make sure Google OAuth has the correct callback URL

## 📞 Support

If you need help:
1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure Google OAuth is properly configured in Supabase
4. Contact: sejalkumavat34@gmail.com

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables updated
- [ ] Google OAuth configured
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Email signup works
- [ ] Google login works
- [ ] Can access dashboard after login
