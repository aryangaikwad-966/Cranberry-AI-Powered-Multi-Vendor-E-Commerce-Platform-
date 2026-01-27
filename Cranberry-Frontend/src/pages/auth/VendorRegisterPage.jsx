import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Store } from 'lucide-react';
import CranberryLogo from '../../components/ui/Cranberrylogo';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from '../../components/ui/sonner';

const VendorRegisterPage = () => {
    const navigate = useNavigate();
    const { register, error, clearError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        storeDescription: '',
    });
    const [validationError, setValidationError] = useState('');

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
        if (!formData.storeName) {
            setValidationError('Store name is required');
            return;
        }
        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'vendor',
                storeName: formData.storeName,
                storeDescription: formData.storeDescription
            });
            toast.success('Vendor registration successful! Please sign in.');
            navigate('/login', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const displayError = validationError || error;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12" data-testid="vendor-register-page">
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
                        Become a Vendor
                    </h1>
                    <p className="text-slate-500 text-center mb-8">
                        Register your store and start selling
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
                        <div>
                            <Label htmlFor="storeName">Store Name</Label>
                            <div className="relative mt-1">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="storeName"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder="Your Store Name"
                                    required
                                    className="pl-10"
                                    data-testid="store-name-input"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="storeDescription">Store Description</Label>
                            <Input
                                id="storeDescription"
                                name="storeDescription"
                                value={formData.storeDescription}
                                onChange={handleChange}
                                placeholder="Describe your store (optional)"
                                className=""
                                data-testid="store-description-input"
                            />
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
                            data-testid="vendor-register-button"
                        >
                            {isLoading ? 'Creating account...' : 'Register as Vendor'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <span className="text-slate-500">Already have an account? </span>
                        <Link to="/login" className="text-[#0071E3] hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegisterPage;
