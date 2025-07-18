# Integration Test Guide

## Overview
This guide tests the integration of the new Supabase components with your existing code structure.

## Test 1: Avatar Component Integration

### Test Steps:
1. **Import and Use Avatar Component**
   ```tsx
   import Avatar from './components/Avatar';
   
   // In your component
   <Avatar 
     size={120} 
     url={trainerProfile?.photo} 
     onUpload={(filePath) => {
       console.log('Uploaded:', filePath);
       // Update your profile state here
     }} 
   />
   ```

2. **Test Photo Upload Flow**
   - Tap the avatar to open image picker
   - Select an image
   - Verify the upload callback is triggered
   - Check console for the file path

### Expected Behavior:
- Avatar displays placeholder when no photo
- Image picker opens on tap
- Upload progress shows during upload
- Success callback returns file path
- Error handling shows user-friendly messages

## Test 2: Supabase Configuration

### Test Steps:
1. **Check Supabase Client**
   ```tsx
   import { supabase } from './lib/supabase';
   
   // Test connection
   console.log('Supabase URL:', supabase.supabaseUrl);
   ```

2. **Test Image Upload Utility**
   ```tsx
   import { uploadImage, getImageUrl } from './lib/imageUpload';
   
   // Test upload
   const url = await uploadImage(uri, 'avatars', 'user123');
   console.log('Uploaded URL:', url);
   ```

### Expected Behavior:
- Supabase client initializes without errors
- Placeholder values work for development
- Upload functions handle errors gracefully

## Test 3: ProfileSetup Integration

### Test Steps:
1. **Use ProfileSetupWithAvatar Component**
   ```tsx
   import ProfileSetupWithAvatar from './components/ProfileSetupWithAvatar';
   
   <ProfileSetupWithAvatar
     profile={trainerProfile}
     onProfileComplete={(profile) => {
       console.log('Profile updated:', profile);
       // Handle profile update
     }}
   />
   ```

2. **Test Complete Flow**
   - Fill out profile form
   - Upload profile photo
   - Save profile
   - Verify photo path is included in profile data

### Expected Behavior:
- Form validation works
- Photo upload integrates seamlessly
- Profile data includes photo path
- No TypeScript errors

## Test 4: Type Compatibility

### Test Steps:
1. **Check TrainerProfile Interface**
   ```tsx
   import { TrainerProfile } from './types';
   
   const profile: TrainerProfile = {
     // ... profile data
     photo: 'uploaded-photo-path.jpg', // Should work with string
   };
   ```

2. **Test Avatar Props**
   ```tsx
   interface AvatarProps {
     size: number;
     url: string | null;
     onUpload: (filePath: string) => void;
   }
   ```

### Expected Behavior:
- All types are compatible
- No TypeScript compilation errors
- Props are properly typed

## Test 5: Error Handling

### Test Steps:
1. **Test Network Errors**
   - Disconnect internet
   - Try to upload image
   - Verify error message is shown

2. **Test Permission Errors**
   - Deny camera roll permission
   - Try to select image
   - Verify permission request is shown

3. **Test Invalid Data**
   - Try to upload invalid file
   - Verify error handling

### Expected Behavior:
- Graceful error handling
- User-friendly error messages
- App doesn't crash on errors

## Test 6: Performance

### Test Steps:
1. **Test Image Quality**
   - Upload large image
   - Verify quality is optimized (0.8)
   - Check file size is reasonable

2. **Test Loading States**
   - Upload image
   - Verify loading indicator shows
   - Check upload completes

### Expected Behavior:
- Images are optimized for performance
- Loading states are smooth
- No memory leaks

## Integration Checklist

- [ ] Avatar component renders correctly
- [ ] Image picker opens and works
- [ ] Upload progress shows
- [ ] Success callback triggers
- [ ] Error handling works
- [ ] TypeScript compilation passes
- [ ] Profile data includes photo
- [ ] No console errors
- [ ] Performance is acceptable

## Troubleshooting

### Common Issues:

1. **Supabase Connection Error**
   - Check environment variables
   - Verify Supabase project is set up
   - Check network connectivity

2. **Image Upload Fails**
   - Check storage bucket exists
   - Verify permissions
   - Check file size limits

3. **TypeScript Errors**
   - Ensure all dependencies are installed
   - Check import paths
   - Verify type definitions

4. **Performance Issues**
   - Reduce image quality if needed
   - Implement image compression
   - Add loading states

## Next Steps

After running these tests:

1. **Set up Supabase Project**
   - Create Supabase project
   - Configure storage buckets
   - Set up database tables

2. **Configure Environment**
   - Add `.env` file with credentials
   - Update placeholder values

3. **Deploy and Test**
   - Test on real device
   - Verify production behavior
   - Monitor performance

## Files to Test

- `lib/supabase.ts` - Supabase configuration
- `lib/imageUpload.ts` - Upload utilities
- `components/Avatar.tsx` - Avatar component
- `components/ProfileSetupWithAvatar.tsx` - Integration example
- `types/index.ts` - Type definitions

All components should work together seamlessly with your existing code structure. 