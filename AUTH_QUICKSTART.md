# Authentication Quick Start Guide

## 🚀 Getting Started

The authentication system is fully integrated into ProjectHub. Here's how to use it:

## Testing the Auth System

### Method 1: Using Demo Credentials

1. Navigate to `http://localhost:5174/login`
2. Enter the demo credentials:
   - **Email:** `demo@example.com`
   - **Password:** `password123`
3. Click "Login"
4. You'll be redirected to the dashboard

### Method 2: Creating a New Account

1. Go to `http://localhost:5174/signup`
2. Fill in your details:
   - Full Name: (any name)
   - Email: (any valid email format)
   - Password: (min 6 characters)
   - Confirm Password: (must match)
3. Agree to terms and conditions
4. Click "Create Account"
5. You'll be logged in automatically

### Method 3: Testing Password Recovery

1. Go to `http://localhost:5174/forgot-password`
2. Enter any valid email (e.g., `demo@example.com`)
3. Click "Send Reset Link"
4. You'll see a success message
5. You'll be auto-redirected to login after 5 seconds

## Features Implemented

✅ **User Registration** - Signup with name, email, password
✅ **User Login** - Login with email and password
✅ **Password Recovery** - Reset password flow
✅ **Session Persistence** - Stay logged in after refresh
✅ **Protected Routes** - Secure pages from unauthorized access
✅ **User Profile** - Display user info in navbar
✅ **Logout** - Clear session and redirect to login
✅ **Toast Notifications** - Feedback on auth actions
✅ **Dark Mode** - All auth pages support dark mode
✅ **Form Validation** - Comprehensive error checking

## Key Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/login` | Login page | Public |
| `/signup` | Sign up page | Public |
| `/forgot-password` | Password recovery | Public |
| `/` | Dashboard | Protected |
| `/projects` | Projects page | Protected |
| `/team` | Team page | Protected |
| `/settings` | Settings page | Protected |
| `/integrations` | Integrations page | Protected |

## Testing Session Persistence

1. Login with demo credentials
2. Check user avatar in navbar (should show user info)
3. Refresh the page
4. You should remain logged in
5. Open DevTools > Application > LocalStorage
6. Look for `user` and `authToken` keys

## Testing Protected Routes

1. Open DevTools Console
2. Run: `localStorage.clear()`
3. Refresh the page
4. You should be redirected to login
5. Try accessing `/projects` directly - should redirect to login

## Understanding the Flow

```
User visits app
    ↓
AuthProvider initializes
    ↓
Check localStorage for session
    ↓
If logged in: Show dashboard
If not: Show login page
    ↓
User submits login form
    ↓
Validate credentials
    ↓
Create user object
    ↓
Save to localStorage
    ↓
Redirect to dashboard
```

## Component Integration

### Using Auth in Components

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { user, logout } = useAuth();
    
    return (
        <div>
            <p>Welcome, {user?.name}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

### Protecting Routes

```jsx
<Route
    path="/protected"
    element={
        <ProtectedRoute>
            <ProtectedComponent />
        </ProtectedRoute>
    }
/>
```

## Troubleshooting

### "Cannot read property 'useAuth'"
- Ensure AuthProvider wraps your entire app in App.jsx

### Logged out after refresh
- Check if localStorage is enabled in your browser
- Check if cookies are being blocked

### Redirect loop
- Clear browser cache and localStorage
- Ensure ProtectedRoute is properly imported

### Demo credentials not working
- Use exact email: `demo@example.com`
- Use exact password: `password123`
- Passwords are case-sensitive

## Current Limitations (Mock Implementation)

The current system uses mock authentication with localStorage:
- No real backend validation
- No email verification
- No actual password reset emails
- No database persistence
- No security headers

For production, see [AUTHENTICATION.md](./AUTHENTICATION.md#production-considerations)

## Available Demo Accounts

| Email | Password | Status |
|-------|----------|--------|
| demo@example.com | password123 | Always works |
| any@email.com | password123 | Works immediately |
| test@test.com | password123 | Works immediately |

You can signup with any email/password combo instantly!

## Files Modified/Created

### New Files
- `src/context/AuthContext.jsx` - Auth state management
- `src/components/ProtectedRoute.jsx` - Route protection
- `src/pages/Login.jsx` - Login interface
- `src/pages/Signup.jsx` - Registration interface
- `src/pages/ForgotPassword.jsx` - Password recovery
- `AUTHENTICATION.md` - Full documentation

### Modified Files
- `src/App.jsx` - Auth routes and provider
- `src/components/Navbar.jsx` - User info and logout

## Next Steps

1. **For Development:**
   - Test all auth flows with the guide above
   - Explore the components to understand the pattern
   - Customize styling to match your brand

2. **For Production:**
   - Read [AUTHENTICATION.md](./AUTHENTICATION.md#production-considerations)
   - Implement backend API integration
   - Add email verification
   - Set up secure token management
   - Configure database user storage

3. **For Enhancement:**
   - Add OAuth (Google, GitHub)
   - Implement 2FA
   - Add social login
   - Create account settings
   - Add activity logs

## Support Resources

- [Full Authentication Documentation](./AUTHENTICATION.md)
- [React Router Documentation](https://reactrouter.com)
- [React Context API Docs](https://react.dev/reference/react/useContext)
- [localStorage MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Video Overview (Coming Soon)

A video walkthrough of the authentication system will be available soon on the project page.

---

**Happy authenticating!** 🔐
