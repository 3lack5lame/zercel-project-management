# Authentication System Documentation

## Overview

A complete authentication system has been implemented for the ProjectHub application. This system includes user registration, login, password recovery, and protected routes.

## Architecture

### Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
Global authentication state management using React Context API.

**Features:**
- User session management
- localStorage persistence
- Multiple authentication methods
- Loading states and error handling
- User avatar generation via DiceBear API

**Methods:**
- `login(email, password)` - Authenticate user
- `signup(name, email, password, confirmPassword)` - Register new user
- `logout()` - Terminate user session
- `forgotPassword(email)` - Initiate password reset
- `updateProfile(updates)` - Modify user information

**Hook Usage:**
```javascript
const { user, isAuthenticated, loading, login, signup, logout } = useAuth();
```

#### 2. **ProtectedRoute** (`src/components/ProtectedRoute.jsx`)
Route guard component that ensures only authenticated users can access protected routes.

**Features:**
- Checks authentication status
- Shows loading state while checking
- Redirects to login page if not authenticated
- Preserves route children

**Usage:**
```jsx
<Route
    path="/"
    element={
        <ProtectedRoute>
            <Layout />
        </ProtectedRoute>
    }
/>
```

#### 3. **AuthProvider** (`src/context/AuthContext.jsx`)
Wrapper component that provides authentication context to the entire application.

**Usage:**
```jsx
<AuthProvider>
    <App />
</AuthProvider>
```

### Pages

#### 4. **Login Page** (`src/pages/Login.jsx`)
User authentication entry point.

**Features:**
- Email and password input fields
- Password visibility toggle
- "Remember me" checkbox
- "Forgot Password" link
- Sign up redirect
- Demo credentials display
- Dark mode support
- Form validation

**Demo Credentials:**
```
Email: demo@example.com
Password: password123
```

#### 5. **Signup Page** (`src/pages/Signup.jsx`)
User registration page.

**Features:**
- Full name input
- Email validation
- Password strength indicator
- Password confirmation field
- Terms and conditions agreement checkbox
- Password visibility toggles
- Dark mode support
- Comprehensive form validation

**Validation Rules:**
- All fields required
- Valid email format
- Password minimum 6 characters
- Passwords must match
- Terms must be agreed

#### 6. **Forgot Password Page** (`src/pages/ForgotPassword.jsx`)
Password recovery flow.

**Features:**
- Email input field
- Success confirmation message
- Auto-redirect to login after 5 seconds
- Support contact link
- Dark mode support

## Data Flow

### Login Flow
```
User Input → Login Page
    ↓
AuthContext.login() → Validation
    ↓
Mock API Call (1000ms)
    ↓
Create User Object
    ↓
Generate Mock Token
    ↓
Save to localStorage
    ↓
Update Auth State
    ↓
Display Success Toast
    ↓
Redirect to Dashboard
```

### Session Persistence
```
App Mount
    ↓
AuthProvider loads
    ↓
Check localStorage for 'user' and 'authToken'
    ↓
If found: Restore session
    ↓
If not found: Stay on login
```

### Protected Route Access
```
User navigates to protected route
    ↓
ProtectedRoute checks isAuthenticated
    ↓
If authenticated: Render component
    ↓
If not authenticated: Show loading → Redirect to /login
```

## Storage Format

### User Object (localStorage key: 'user')
```json
{
    "id": "1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Auth Token (localStorage key: 'authToken')
Mock JWT-like token: `base64encodedUser_timestamp`

## Route Structure

### Public Routes (No Authentication Required)
- `/login` - Login page
- `/signup` - Sign up page
- `/forgot-password` - Password recovery

### Protected Routes (Authentication Required)
- `/` - Dashboard
- `/projects` - Projects list
- `/team` - Team management
- `/settings` - Application settings
- `/integrations` - Third-party integrations
- `/projectsDetail` - Project details
- `/taskDetails` - Task details

## Navbar Integration

The Navbar component now displays:
- User's actual name and email
- User's avatar from DiceBear API
- Working logout button that clears auth state and redirects to login

**User Dropdown Menu:**
1. Profile
2. Settings
3. Help & Support
4. Logout (with warning color)

## Error Handling

All authentication methods include:
- Form validation
- Toast notifications for feedback
- Error messages in return objects
- Try-catch error handling

**Common Errors:**
- "Email and password are required"
- "Invalid email format"
- "Password must be at least 6 characters"
- "Passwords do not match"
- "All fields are required"

## Testing Guide

### Manual Testing Steps

1. **Test Signup:**
   - Navigate to `/signup`
   - Enter name, email, password
   - Confirm password
   - Accept terms
   - Click "Create Account"
   - Should redirect to dashboard

2. **Test Login:**
   - Navigate to `/login`
   - Use demo credentials or signup email
   - Click "Login"
   - Should redirect to dashboard

3. **Test Session Persistence:**
   - Login successfully
   - Refresh the page
   - Should remain logged in
   - User data should display in navbar

4. **Test Logout:**
   - Click user avatar dropdown
   - Click "Logout"
   - Should redirect to login
   - localStorage should be cleared

5. **Test Protected Routes:**
   - Open browser DevTools
   - Clear localStorage
   - Try accessing `/projects`
   - Should redirect to login
   - Should show brief loading state

6. **Test Forgot Password:**
   - Navigate to `/forgot-password`
   - Enter email
   - Should show success message
   - Should auto-redirect to login

## Production Considerations

The current implementation uses mock authentication with localStorage. For production, implement:

### 1. **Backend API Integration**
Replace mock API calls with real endpoints:
```javascript
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
```

### 2. **Secure Token Storage**
Replace localStorage with httpOnly cookies:
```javascript
// Set token in httpOnly cookie
// Server sets: Set-Cookie: authToken=...; HttpOnly; Secure; SameSite=Strict
// Client cannot access via JavaScript (protects from XSS)
```

### 3. **Token Refresh**
Implement JWT refresh token mechanism:
```javascript
// Get new access token using refresh token before expiration
// Refresh token stored in httpOnly cookie (server-side only)
```

### 4. **Email Verification**
- Send verification email during signup
- Require email verification before account activation
- Resend verification link functionality

### 5. **Password Security**
- Implement proper password reset with email verification
- Hash passwords server-side (bcrypt or similar)
- Enforce strong password requirements
- Implement rate limiting on login attempts

### 6. **Two-Factor Authentication (2FA)**
- Add TOTP/SMS 2FA option
- Display 2FA setup during signup
- Require 2FA on login if enabled

### 7. **OAuth Integration**
- Google OAuth
- GitHub OAuth
- Microsoft OAuth

### 8. **Session Management**
- Implement session timeout
- Add "Remember me" functionality
- Device tracking
- Session invalidation on logout from all devices

### 9. **Security Headers**
- CORS configuration
- CSRF token validation
- X-Frame-Options
- Content Security Policy

### 10. **Monitoring & Logging**
- Log authentication events
- Monitor failed login attempts
- Alert on suspicious activity
- User activity tracking

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx (466 lines)
├── components/
│   └── ProtectedRoute.jsx (25 lines)
├── pages/
│   ├── Login.jsx (210 lines)
│   ├── Signup.jsx (230 lines)
│   └── ForgotPassword.jsx (160 lines)
└── App.jsx (Updated with auth routes)
```

## Dependencies

- `react-hot-toast` - Toast notifications
- `react-router-dom` - Routing and navigation
- `lucide-react` - Icons
- Browser localStorage API

## Browser Compatibility

The authentication system works on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- All modern mobile browsers

Requires localStorage support and ES6 JavaScript.

## Troubleshooting

### User not staying logged in after refresh
- Check if localStorage is enabled
- Check if 'user' and 'authToken' keys are set
- Check browser's private/incognito mode (localStorage may be cleared on close)

### Redirect loop between login and dashboard
- Verify ProtectedRoute component is properly wrapped
- Check AuthProvider is at top level in App.jsx
- Ensure AuthContext.jsx loading state is correct

### User info not displaying in navbar
- Verify useAuth hook is being called
- Check if user object is populated in localStorage
- Verify avatar URL from DiceBear API is accessible

### Toast notifications not showing
- Ensure `<Toaster />` is present in App.jsx
- Check if react-hot-toast is properly installed
- Verify no CSS conflicts hiding toast

## Future Enhancements

- [ ] Email verification workflow
- [ ] Social login (Google, GitHub)
- [ ] Multi-factor authentication
- [ ] Account recovery options
- [ ] Profile picture upload
- [ ] Two-step verification
- [ ] Activity log
- [ ] Connected devices management
- [ ] Password change history
- [ ] Account deletion workflow

## API Endpoints (For Backend Implementation)

Recommended endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/verify-email` - Verify email address

## Support

For issues or questions about the authentication system:
1. Check this documentation
2. Review the source code comments
3. Check browser console for error messages
4. Verify all files are in correct locations

## License

This authentication system is part of ProjectHub and follows the same MIT License.
