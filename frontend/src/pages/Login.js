import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/admin');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="border border-[#1A1A1A] bg-white p-8">
          <h1 className="heading-2 mb-2 text-center" data-testid="login-title">Admin Login</h1>
          <p className="body-text text-center mb-8" data-testid="login-subtitle">Sign in to manage your recipes</p>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <Label htmlFor="email" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                required
                data-testid="login-email-input"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-['Outfit'] font-bold text-sm uppercase tracking-wider mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#1A1A1A] rounded-none focus:ring-[#386641]"
                required
                data-testid="login-password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#386641] text-white hover:bg-[#2B4F32] px-8 py-3 font-['Outfit'] font-bold tracking-wide transition-all rounded-none"
              data-testid="login-submit-button"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;