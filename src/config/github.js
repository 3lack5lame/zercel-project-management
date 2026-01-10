// GitHub OAuth Configuration (via Supabase)
// Supabase handles all GitHub OAuth flow securely

export const GITHUB_PROVIDER = 'github';

// Redirect URL for Supabase OAuth callback
export const getSupabaseRedirectUrl = () => {
  return `${window.location.origin}/auth/github/callback`;
};

export default {
  GITHUB_PROVIDER,
  getSupabaseRedirectUrl,
};
