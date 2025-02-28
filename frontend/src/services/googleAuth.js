import { jwtDecode } from "jwt-decode";

export const handleGoogleLogin = async (response, callbacks) => {
  const { setAuth, setUser, setLoading } = callbacks;
  
  try {
    setLoading({ isLoading: true, message: 'Signing in with Google...' });
    
    const credential = response.credential;
    const decoded = jwtDecode(credential);
    
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential,
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      }),
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Failed to authenticate with Google');
    }

    const data = await res.json();

    setAuth({
      isAuthenticated: true,
      token: data.data.token,
      userId: data.data.userId,
      provider: 'google'
    });

    setUser({
      username: data.data.username,
      email: data.data.email,
      credits: data.data.credits,
      googleId: decoded.sub,
      avatar: decoded.picture,
      isEmailVerified: true
    });

    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userId', data.data.userId);

    return true;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  } finally {
    setLoading({ isLoading: false, message: '' });
  }
};
