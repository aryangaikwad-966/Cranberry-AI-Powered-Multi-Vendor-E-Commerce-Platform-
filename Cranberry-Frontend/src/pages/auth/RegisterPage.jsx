import { useState, useEffect } from 'react';
import { toast } from '../../components/ui/sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import CranberryLogo from '../../components/ui/Cranberrylogo';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const GOOGLE_CLIENT_ID = '450428172091-02gr6i1g36271b41jq6tt9duheeqnvfs.apps.googleusercontent.com';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, googleLogin, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  // Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);
    try {
      const result = await googleLogin(response.credential);
      toast.success('Account created successfully!');
      const role = result.user?.role?.toLowerCase();

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'vendor') {
          navigate('/vendor');
        } else {
          navigate('/', { replace: true });
        }
        window.location.reload();
      }, 100);
    } catch (err) {
      toast.error(err.message || 'Google signup failed');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'customer'
      });
      toast.success('Registration successful! Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12" data-testid="register-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <span className="inline-flex items-center justify-center">
              <CranberryLogo size={40} />
            </span>
            <span className="font-display font-bold text-2xl text-slate-900">
              Cranberry
            </span>
          </Link>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold text-slate-900 text-center mb-2">
            Create an account
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Join Cranberry today
          </p>

          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="pl-10"
                  data-testid="name-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="pl-10"
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10"
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="pl-10"
                  data-testid="confirm-password-input"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-slate-300 text-[#0071E3]"
              />
              <span className="ml-2 text-sm text-slate-600">
                I agree to the{' '}
                <Link to="/terms" className="text-[#0071E3] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#0071E3] hover:underline">Privacy Policy</Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-lg"
              data-testid="register-button"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or sign up with</span>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <div id="google-signup-btn" className="flex justify-center"></div>

          <div className="mt-6 text-center">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-[#0071E3] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>

        {/* Vendor link */}
        <div className="mt-6 text-center">
          <span className="text-slate-500">Want to sell on our platform? </span>
          <Link to="/vendor/register" className="text-[#0071E3] hover:underline font-medium">
            Become a Vendor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
