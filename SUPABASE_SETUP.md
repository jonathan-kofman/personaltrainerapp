# Supabase Setup Guide

## Environment Variables

Create a `.env` file in your project root with the following variables:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Replace the placeholder values in your `.env` file

## Storage Buckets

Make sure you have the following storage buckets set up in your Supabase project:

- `avatars` - for user profile pictures
- `banners` - for trainer banner images

## Database Tables

You'll need to create the following tables in your Supabase database:

### trainers
- id (uuid, primary key)
- name (text)
- email (text)
- phone (text)
- photo (text)
- rating (numeric)
- total_reviews (integer)
- specialties (text[])
- hourly_rate (numeric)
- experience (text)
- is_online (boolean)
- is_verified (boolean)
- is_approved (boolean)
- created_at (timestamp)

### clients
- id (uuid, primary key)
- name (text)
- email (text)
- phone (text)
- photo (text)
- join_date (date)
- total_sessions (integer)
- last_session (date)
- goals (text[])
- notes (text)
- status (text)
- created_at (timestamp)

### booking_requests
- id (uuid, primary key)
- client_id (uuid, foreign key to clients.id)
- trainer_id (uuid, foreign key to trainers.id)
- session_type (text)
- preferred_date (date)
- preferred_time (time)
- duration (integer)
- location (text)
- address (text)
- rate (numeric)
- message (text)
- status (text)
- created_at (timestamp)

## Row Level Security (RLS)

Enable RLS on your tables and create appropriate policies for your use case.

## Usage

The updated files now work with your current code structure:

- `lib/supabase.ts` - Supabase client configuration
- `lib/imageUpload.ts` - Image upload utilities
- `components/Avatar.tsx` - Avatar component with image upload functionality

The Avatar component can be used in your existing components like this:

```tsx
import Avatar from './components/Avatar';

// In your component
<Avatar 
  size={100} 
  url={trainerProfile?.photo} 
  onUpload={(filePath) => {
    // Handle the uploaded file path
    console.log('Uploaded:', filePath);
  }} 
/>
``` 