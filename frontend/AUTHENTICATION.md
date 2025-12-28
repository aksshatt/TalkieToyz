# TalkieToys Frontend Authentication System

## Overview

This document describes the complete authentication system implemented for the TalkieToys React frontend, including JWT token management, protected routes, and user authentication flows.

## Architecture

### Core Components

1. **Axios Configuration** (`src/config/axios.ts`)
   - Axios instance with JWT interceptors
   - Automatic token attachment to requests
   - Token refresh on 401 errors
   - Redirect to login on authentication failure

2. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - User session persistence
   - Login, signup, and logout functionality
   - Token validation on app initialization

3. **Authentication Service** (`src/services/authService.ts`)
   - API methods for all auth operations
   - TypeScript interfaces for type safety
   - Centralized error handling

4. **Private Route Component** (`src/components/auth/PrivateRoute.tsx`)
   - Route protection for authenticated pages
   - Role-based access control
   - Loading state during auth check
   - Redirect to login with return URL

## Features Implemented

### 1. User Authentication

#### Login (`src/pages/auth/Login.tsx`)
- Email and password validation
- Form error handling
- Loading states
- Demo credentials display
- Kid-friendly, colorful design
- Redirect to intended page after login

#### Signup (`src/pages/auth/Signup.tsx`)
- Full name, email, password fields
- Password confirmation
- Role selection (Parent/Therapist)
- Visual role selector with emojis
- Form validation
- Automatic login after signup

### 2. Password Management

#### Forgot Password (`src/pages/auth/ForgotPassword.tsx`)
- Email submission for reset
- Success confirmation screen
- Error handling

#### Reset Password (`src/pages/auth/ResetPassword.tsx`)
- Token-based password reset
- Password confirmation
- Success message with auto-redirect
- Link expiration handling

### 3. User Profile

#### Profile Page (`src/pages/Profile.tsx`)
- View user information
- Edit profile (name, phone, bio)
- Role-specific styling
- Logout functionality
- Account creation date
- Loading and error states

### 4. Token Management

#### Persistent Authentication
- Tokens stored in localStorage
- Automatic token refresh
- Token validation on app load
- Secure token transmission

#### Token Refresh Flow
1. API returns 401 Unauthorized
2. Interceptor catches error
3. Attempts token refresh
4. Retries original request
5. Redirects to login if refresh fails

### 5. Protected Routes

#### Implementation
```tsx
<PrivateRoute requiredRole="therapist">
  <TherapistDashboard />
</PrivateRoute>
```

#### Features
- Authentication check
- Role-based access control
- Loading state
- Access denied screen
- Return URL preservation

## File Structure

```
frontend/src/
├── config/
│   └── axios.ts                 # Axios instance with interceptors
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── services/
│   └── authService.ts           # API service methods
├── components/
│   └── auth/
│       └── PrivateRoute.tsx     # Protected route wrapper
├── pages/
│   ├── Home.tsx                 # Public home page
│   ├── Profile.tsx              # User profile page
│   └── auth/
│       ├── Login.tsx            # Login page
│       ├── Signup.tsx           # Signup page
│       ├── ForgotPassword.tsx   # Password reset request
│       └── ResetPassword.tsx    # Password reset confirmation
├── utils/
│   └── validation.ts            # Form validation utilities
└── App.tsx                      # Route configuration
```

## Usage Guide

### Using Authentication Context

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Making Authenticated API Calls

```tsx
import axiosInstance from '../config/axios';

// Token automatically attached
const response = await axiosInstance.get('/protected-endpoint');
```

### Creating Protected Routes

```tsx
import PrivateRoute from './components/auth/PrivateRoute';

// Simple protected route
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

// Role-based protected route
<Route
  path="/admin"
  element={
    <PrivateRoute requiredRole="admin">
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

### Form Validation

```tsx
import { validateEmail, validatePassword } from '../utils/validation';

const emailError = validateEmail(email);
if (emailError) {
  setErrors({ email: emailError });
}
```

## API Endpoints

The authentication system expects these backend endpoints:

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `DELETE /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `PATCH /api/v1/auth/profile` - Update profile
- `PATCH /api/v1/auth/password` - Change password
- `POST /api/v1/auth/password/reset` - Request password reset
- `POST /api/v1/auth/password/reset/confirm` - Confirm password reset
- `POST /api/v1/auth/refresh` - Refresh access token

## Design System

### Color Palette

- **Purple-Pink Gradient**: Primary actions, headers
- **Blue-Purple Gradient**: Secondary actions
- **Green**: Success states
- **Red-Pink**: Errors, logout
- **Orange-Pink**: Password reset

### UI Components

- **Rounded Borders**: 3xl (24px) for cards
- **Shadows**: xl for elevation
- **Animations**: Scale and rotation on hover
- **Loading States**: Spinning SVG indicator
- **Emojis**: Kid-friendly visual elements

### Typography

- **Headers**: Bold, large (text-4xl to text-6xl)
- **Body**: Medium weight, readable
- **Buttons**: Bold, white text
- **Errors**: Small, bold, red

## Security Features

1. **JWT Token Storage**
   - Secure localStorage
   - Automatic cleanup on logout
   - Token refresh mechanism

2. **Form Validation**
   - Client-side validation
   - Server-side error display
   - Password strength requirements

3. **Protected Routes**
   - Authentication check
   - Role verification
   - Automatic redirects

4. **Token Refresh**
   - Automatic on 401
   - Retry failed requests
   - Graceful fallback to login

5. **HTTPS Ready**
   - Secure token transmission
   - Environment-based configuration

## Environment Variables

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:3000/api/v1
```

For production:

```bash
VITE_API_URL=https://api.talkietoys.com/api/v1
```

## Testing

### Demo Credentials

The login page displays these demo credentials:

- **Parent**: parent@example.com / password123
- **Therapist**: therapist@example.com / password123
- **Admin**: admin@talkietoys.com / password123

### Manual Testing Checklist

- [ ] User can sign up with valid data
- [ ] User can log in with credentials
- [ ] Invalid login shows error
- [ ] User session persists on refresh
- [ ] Protected routes redirect to login
- [ ] User can update profile
- [ ] User can request password reset
- [ ] User can reset password with token
- [ ] User can log out
- [ ] Token refresh works on 401
- [ ] Role-based access control works

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured
   - Check API URL in .env file

2. **Token Not Attached**
   - Verify localStorage has access_token
   - Check axios interceptor configuration

3. **Infinite Refresh Loop**
   - Check refresh token endpoint
   - Verify token expiration logic

4. **Routes Not Working**
   - Ensure BrowserRouter wraps App
   - Check route path configuration

5. **TypeScript Errors**
   - Ensure all interfaces are imported
   - Check for missing type definitions

## Future Enhancements

- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Social login (Google, Facebook)
- [ ] Remember me checkbox
- [ ] Session timeout warning
- [ ] Password strength indicator
- [ ] Account deletion
- [ ] Profile picture upload
- [ ] Activity log

## Contributing

When adding new authentication features:

1. Update TypeScript interfaces in `authService.ts`
2. Add API methods to `authService.ts`
3. Create page components with validation
4. Update routing in `App.tsx`
5. Add tests for new functionality
6. Update this documentation

## License

This authentication system is part of the TalkieToys project.
