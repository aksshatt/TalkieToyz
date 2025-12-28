# Authentication System - Quick Start Guide

## Files Created

### Configuration
- `src/config/axios.ts` - Axios with JWT interceptors
- `.env` - Environment variables

### Context & Services
- `src/contexts/AuthContext.tsx` - Global auth state
- `src/services/authService.ts` - API methods

### Components
- `src/components/auth/PrivateRoute.tsx` - Route protection

### Pages
- `src/pages/Home.tsx` - Public home page
- `src/pages/Profile.tsx` - User profile
- `src/pages/auth/Login.tsx` - Login page
- `src/pages/auth/Signup.tsx` - Signup page
- `src/pages/auth/ForgotPassword.tsx` - Password reset request
- `src/pages/auth/ResetPassword.tsx` - Password reset confirmation

### Utilities
- `src/utils/validation.ts` - Form validation

### Updated Files
- `src/App.tsx` - Route configuration
- `src/main.tsx` - BrowserRouter wrapper

## Running the Application

### 1. Start Backend (Terminal 1)
```bash
cd backend
bundle exec rails server
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 3. Open Browser
Navigate to: http://localhost:5173

## Test Authentication

### Demo Credentials
- **Parent**: parent@example.com / password123
- **Therapist**: therapist@example.com / password123
- **Admin**: admin@talkietoys.com / password123

### Test Flow
1. Go to http://localhost:5173
2. Click "Sign Up" or "Login"
3. Use demo credentials or create new account
4. Visit /profile to see protected route
5. Edit profile information
6. Logout and login again

## Key Features

✅ JWT token management with auto-refresh
✅ Persistent authentication (localStorage)
✅ Protected routes with role-based access
✅ Form validation with error messages
✅ Loading states throughout
✅ Kid-friendly, colorful TailwindCSS design
✅ Password reset flow
✅ User profile management
✅ Automatic redirect to login when unauthorized

## Routes

- `/` - Home (public)
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password reset request
- `/reset-password?token=xxx` - Password reset confirmation
- `/profile` - User profile (protected)

## Using Auth in Your Components

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Making API Calls

```tsx
import axiosInstance from './config/axios';

// Token automatically attached
const response = await axiosInstance.get('/products');
```

## Creating Protected Routes

```tsx
import PrivateRoute from './components/auth/PrivateRoute';

<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

// With role requirement
<Route
  path="/admin"
  element={
    <PrivateRoute requiredRole="admin">
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

## Troubleshooting

### Cannot login
- Check that backend is running on port 3000
- Verify VITE_API_URL in .env
- Check browser console for errors

### Token errors
- Clear localStorage and try again
- Check backend auth endpoints are working
- Verify JWT secret is configured

### CORS errors
- Ensure backend cors.rb allows localhost:5173
- Restart backend server

### Routes not working
- Ensure all imports are correct
- Check BrowserRouter is in main.tsx
- Verify react-router-dom is installed

## Next Steps

1. Implement backend authentication endpoints (JWT)
2. Add email verification
3. Implement remember me functionality
4. Add social login options
5. Create admin dashboard
6. Add user roles and permissions

## Need Help?

- Check AUTHENTICATION.md for detailed documentation
- Review backend/docs/API_DOCUMENTATION.md for API details
- Test endpoints using the demo credentials
