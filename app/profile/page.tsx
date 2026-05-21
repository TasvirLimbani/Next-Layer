'use client';

import { useAppContext } from '@/lib/context';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react';
import {
  Edit2,
  Heart,
  Home,
  KeyRound,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  UserPlus,
} from 'lucide-react';

type AuthMode = 'login' | 'signup';

type AuthResponse = {
  status?: boolean;
  success?: boolean;
  message?: string;
  user?: Partial<UserProfile>;
  data?: Partial<UserProfile>;
  result?: Partial<UserProfile>;
};

const emptyProfile: UserProfile = {
  id: '',
  email: '',
  name: '',
  address: '',
  phone: '',
};

export default function ProfilePage() {
  const { user, setUser } = useAppContext();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isEditing, setIsEditing] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [formData, setFormData] = useState<UserProfile>(user ?? emptyProfile);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData(emptyProfile);
      setAuthMode('login');
    }
    setIsEditing(false);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setUser(formData);
    setIsEditing(false);
  };

  const resolveUserProfile = (
    source: AuthResponse,
    fallback: UserProfile,
    mode: AuthMode
  ): UserProfile => {
    const apiUser = source.user ?? source.data ?? source.result ?? {};

    return {
      id: apiUser.id?.toString() || fallback.id || Date.now().toString(),
      name: apiUser.name || fallback.name || (mode === 'login' ? fallback.email.split('@')[0] || 'Guest User' : ''),
      email: apiUser.email || fallback.email,
      phone: apiUser.phone || fallback.phone || '',
      address: apiUser.address || fallback.address || '',
    };
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');

    const email = loginForm.email.trim();
    if (!email || !loginForm.password.trim()) {
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: loginForm.password,
        }),
      });

      const data = (await response.json()) as AuthResponse;

      if (!response.ok || data.status === false || data.success === false) {
        setAuthError(data.message || 'Login failed. Please try again.');
        return;
      }

      const nextUser = resolveUserProfile(data, { ...emptyProfile, email }, 'login');
      setUser(nextUser);
      setLoginForm({ email: '', password: '' });
    } catch {
      setAuthError('Login failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');

    const name = signupForm.name.trim();
    const email = signupForm.email.trim();

    if (!name || !email || !signupForm.password.trim()) {
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password: signupForm.password,
        }),
      });

      const data = (await response.json()) as AuthResponse;

      if (!response.ok || data.status === false || data.success === false) {
        setAuthError(data.message || 'Signup failed. Please try again.');
        return;
      }

      const nextUser = resolveUserProfile(
        data,
        {
          ...emptyProfile,
          name,
          email,
          phone: signupForm.phone.trim(),
          address: signupForm.address.trim(),
        },
        'signup'
      );

      setUser(nextUser);
      setSignupForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
      });
    } catch {
      setAuthError('Signup failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsEditing(false);
    setAuthMode('login');
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4">
              <User size={16} />
              Account Access
            </div>

            <h1 className="text-3xl font-bold mb-3">Sign in or create your account</h1>
            <p className="text-gray-600 mb-6">
              Use login for an existing account, or sign up to create a new one and come back to your profile instantly.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`px-4 py-3 rounded-lg border font-semibold text-sm transition flex items-center justify-center gap-2 ${authMode === 'login'
                  ? 'border-amber-600 bg-amber-50 text-amber-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <LogIn size={16} />
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`px-4 py-3 rounded-lg border font-semibold text-sm transition flex items-center justify-center gap-2 ${authMode === 'signup'
                  ? 'border-amber-600 bg-amber-50 text-amber-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <UserPlus size={16} />
                Sign up
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  <LogIn size={16} />
                  {authLoading ? 'Logging in...' : 'Login'}
                </button>
                {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <div className="relative">
                      <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={signupForm.address}
                        onChange={(e) => setSignupForm((prev) => ({ ...prev, address: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                        placeholder="Street address"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  <UserPlus size={16} />
                  {authLoading ? 'Creating account...' : 'Create Account'}
                </button>
                {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
              </form>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">What you can do after signing in</h2>
            <div className="space-y-4 text-sm text-gray-700">
              <p className="flex items-start gap-3">
                <User size={16} className="mt-0.5 text-amber-700" />
                Edit your profile details and keep your account information up to date.
              </p>
              <p className="flex items-start gap-3">
                <Package size={16} className="mt-0.5 text-amber-700" />
                Review orders, wishlist items, and shopping activity from one place.
              </p>
              <p className="flex items-start gap-3">
                <Heart size={16} className="mt-0.5 text-amber-700" />
                Save products you like and return to them later.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br rounded-full mx-auto mb-4" style={{ backgroundImage: 'linear-gradient(to bottom right, #C4A57B, #8B7355)' }}>
              <User size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{formData.name || 'Guest User'}</h2>
            <p className="text-sm text-gray-600 text-center mb-6">{formData.email}</p>

            <nav className="space-y-2">
              <Link href="#profile" className="block px-4 py-2 hover:bg-gray-100 rounded transition font-semibold text-sm">
                My Profile
              </Link>
              <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100 rounded transition font-semibold text-sm flex items-center gap-2">
                <Heart size={16} />
                Wishlist
              </Link>
              <Link href="#orders" className="block px-4 py-2 hover:bg-gray-100 rounded transition font-semibold text-sm flex items-center gap-2">
                <Package size={16} />
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded transition font-semibold text-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>

            <p className="mt-6 text-xs text-gray-500 text-center">Signed in as {user.email}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User size={24} />
                My Profile
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 rounded font-semibold text-sm hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Edit2 size={16} />
                {isEditing ? 'CANCEL' : 'EDIT'}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2 text-white font-semibold rounded hover:opacity-90 transition"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  SAVE CHANGES
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Full Name</p>
                  <p className="text-gray-900">{formData.name || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-gray-900">{formData.email || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold mb-1">Phone</p>
                  <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-gray-600 font-semibold mb-1">Address</p>
                  <p className="text-gray-900 flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    {formData.address || 'Not provided'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order History */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Package size={24} />
              Recent Orders
            </h2>

            <div className="text-center py-8">
              <Package size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No orders yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Start shopping to see your orders here
              </p>
              <Link href="/shop">
                <button
                  className="px-6 py-2 text-white font-semibold rounded hover:opacity-90 transition"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  SHOP NOW
                </button>
              </Link>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Preferences</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-700">
                  Receive email updates about new products and special offers
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-700">
                  Receive notifications about order status
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">
                  Allow marketing communications
                </span>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
