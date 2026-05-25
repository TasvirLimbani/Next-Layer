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

type AddressRecord = {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  created_at?: string;
};

type AddressResponse = {
  status?: boolean;
  addresses?: AddressRecord[];
  message?: string;
};

type OrderRecord = {
  id: number;
  user_id: number;
  payment_id: string;
  total_amount: string;
  order_status: string;
  tracking_id: string | null;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  created_at: string;
};

type OrdersResponse = {
  status?: boolean;
  orders?: OrderRecord[];
  message?: string;
};

type AddressDraft = {
  id?: number;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
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
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [addressRecords, setAddressRecords] = useState<AddressRecord[]>([]);
  const [addressDrafts, setAddressDrafts] = useState<AddressDraft[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
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
  const hasSavedAddress = addressRecords.length > 0;

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData(emptyProfile);
      setAuthMode('login');
      setAddressRecords([]);
      setAddressDrafts([]);
      setAddressError('');
    }
    setIsEditing(false);
  }, [user]);

  useEffect(() => {
    setAddressDrafts(
      addressRecords.map((address) => ({
        id: address.id,
        user_id: String(address.user_id),
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      }))
    );
  }, [addressRecords]);

  useEffect(() => {
    let isActive = true;

    const loadAddresses = async () => {
      if (!user?.id) {
        if (isActive) {
          setAddressRecords([]);
          setAddressDrafts([]);
          setAddressLoading(false);
          setAddressError('');
        }
        return;
      }

      try {
        setAddressLoading(true);
        setAddressError('');

        const response = await fetch(`/api/address?user_id=${encodeURIComponent(String(user.id))}`, {
          cache: 'no-store',
        });

        const data = (await response.json()) as AddressResponse;

        if (!response.ok || !data.status) {
          throw new Error(data.message || 'Failed to load addresses');
        }

        if (isActive) {
          setAddressRecords(Array.isArray(data.addresses) ? data.addresses : []);
        }
      } catch (error) {
        if (isActive) {
          setAddressRecords([]);
          setAddressDrafts([]);
          setAddressError(error instanceof Error ? error.message : 'Failed to load addresses');
        }
      } finally {
        if (isActive) {
          setAddressLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let isActive = true;

    const loadOrders = async () => {
      if (!user?.id) {
        if (isActive) {
          setOrders([]);
          setOrdersLoading(false);
          setOrdersError('');
        }
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError('');

        const response = await fetch(`/api/orders?user_id=${encodeURIComponent(String(user.id))}`, {
          cache: 'no-store',
        });

        const data = (await response.json()) as OrdersResponse;

        if (!response.ok || !data.status) {
          throw new Error(data.message || 'Failed to load order history');
        }

        if (isActive) {
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (error) {
        if (isActive) {
          setOrders([]);
          setOrdersError(error instanceof Error ? error.message : 'Failed to load order history');
        }
      } finally {
        if (isActive) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddressDrafts((prev) =>
      prev.map((address, addressIndex) =>
        addressIndex === index ? { ...address, [name]: value } : address
      )
    );
  };

  const addAddressDraft = () => {
    if (addressDrafts.length > 0) return;

    setAddressDrafts([
      {
        user_id: user?.id ? String(user.id) : '',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
      },
    ]);
    setIsEditing(true);
  };

  const openAddressEditor = () => {
    if (!hasSavedAddress && addressDrafts.length === 0) {
      addAddressDraft();
      return;
    }

    setIsEditing(true);
  };

  const saveAddressDraft = async (address: AddressDraft) => {
    const response = await fetch('/api/address', {
      method: address.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...(address.id ? { id: address.id } : {}),
        user_id: Number(user?.id),
        name: address.name.trim(),
        phone: address.phone.trim(),
        address: address.address.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      }),
    });

    const data = (await response.json()) as AddressResponse;

    if (!response.ok || !data.status) {
      throw new Error(data.message || 'Failed to save address');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError('');
      setUser(formData);

      if (user?.id && addressDrafts.length > 0) {
        for (const address of addressDrafts) {
          await saveAddressDraft(address);
        }

        const refreshed = await fetch(`/api/address?user_id=${encodeURIComponent(String(user.id))}`, {
          cache: 'no-store',
        });
        const refreshedData = (await refreshed.json()) as AddressResponse;

        if (refreshed.ok && refreshedData.status) {
          const nextAddresses = Array.isArray(refreshedData.addresses) ? refreshedData.addresses : [];
          setAddressRecords(nextAddresses);
          setAddressDrafts(
            nextAddresses.map((address) => ({
              id: address.id,
              user_id: String(address.user_id),
              name: address.name,
              phone: address.phone,
              address: address.address,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
            }))
          );
        }
      }

      setIsEditing(false);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
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

  const formatOrderDate = (value: string) => {
    const parsed = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsed);
  };

  const getStatusStyles = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized.includes('deliver')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }

    if (normalized.includes('ship')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }

    if (normalized.includes('cancel')) {
      return 'bg-red-50 text-red-700 border-red-200';
    }

    return 'bg-amber-50 text-amber-700 border-amber-200';
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
                onClick={isEditing ? () => setIsEditing(false) : openAddressEditor}
                className="px-4 py-2 border border-gray-300 rounded font-semibold text-sm hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Edit2 size={16} />
                {isEditing ? 'CANCEL' : hasSavedAddress ? 'EDIT' : 'ADD ADDRESS'}
              </button>
            </div>

            {profileError && <p className="mb-4 text-sm text-red-600">{profileError}</p>}

            {isEditing ? (
              <div className="space-y-4">
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <MapPin size={18} />
                      Address Details
                    </h3>
                  </div>

                  {addressLoading ? (
                    <p className="text-sm text-gray-600">Loading addresses...</p>
                  ) : addressError ? (
                    <p className="text-sm text-red-600">{addressError}</p>
                  ) : addressDrafts.length === 0 ? (
                    <button
                      type="button"
                      onClick={addAddressDraft}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: '#C4A57B' }}
                    >
                      <MapPin size={16} />
                      Add Address
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {addressDrafts.map((address, index) => (
                        <div key={address.id ?? index} className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">Address #{index + 1}</p>
                            <span className="text-xs text-gray-500">ID: {address.id ?? 'new'}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              name="name"
                              value={address.name}
                              onChange={(e) => handleAddressInputChange(index, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                              placeholder="Name"
                            />
                            <input
                              type="tel"
                              name="phone"
                              value={address.phone}
                              onChange={(e) => handleAddressInputChange(index, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                              placeholder="Phone"
                            />
                            <input
                              type="text"
                              name="address"
                              value={address.address}
                              onChange={(e) => handleAddressInputChange(index, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600 sm:col-span-2"
                              placeholder="Address"
                            />
                            <input
                              type="text"
                              name="city"
                              value={address.city}
                              onChange={(e) => handleAddressInputChange(index, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                              placeholder="City"
                            />
                            <input
                              type="text"
                              name="state"
                              value={address.state}
                              onChange={(e) => handleAddressInputChange(index, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                              placeholder="State"
                            />
                            <input
                              type="text"
                              name="pincode"
                              value={address.pincode}
                              onChange={(e) => handleAddressInputChange(index, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-600"
                              placeholder="Pincode"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={profileLoading}
                  className="w-full py-2 text-white font-semibold rounded hover:opacity-90 transition"
                  style={{ backgroundColor: '#C4A57B' }}
                >
                  {profileLoading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-600 font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Address Details
                  </p>

                  {addressLoading ? (
                    <p className="text-gray-500">Loading addresses...</p>
                  ) : addressError ? (
                    <p className="text-red-600">{addressError}</p>
                  ) : addressRecords.length === 0 ? (
                    <button
                      type="button"
                      onClick={openAddressEditor}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: '#C4A57B' }}
                    >
                      <MapPin size={16} />
                      Add Address
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {addressRecords.map((address) => (
                        <div key={address.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <p className="font-semibold text-gray-900">{address.name}</p>
                          <p className="text-gray-700">{address.phone}</p>
                          <p className="text-gray-700 mt-1">{address.address}</p>
                          <p className="text-gray-700">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order History */}
          <div id="orders" className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package size={24} />
                Recent Orders
              </h2>
              <span className="text-sm text-gray-500">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : ordersError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                {ordersError}
              </div>
            ) : orders.length === 0 ? (
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
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-amber-50/40 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-lg font-bold text-gray-900">Order #{order.id}</p>
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(order.order_status)}`}>
                            {order.order_status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          Placed on {formatOrderDate(order.created_at)}
                        </p>
                        {/* <p className="text-sm text-gray-600">
                          Payment ID: <span className="font-medium text-gray-800">{order.payment_id}</span>
                        </p> */}
                        {order.tracking_id ? (
                          <p className="text-sm text-gray-600">
                            Tracking ID: <span className="font-medium text-gray-800">{order.tracking_id}</span>
                          </p>
                        ) : null}
                      </div>

                      <div className="rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-100 sm:min-w-40">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">₹{Number(order.total_amount).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl bg-white/80 p-4 border border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Shipping Details</p>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p className="font-semibold text-gray-900">{order.shipping_name}</p>
                          <p>{order.shipping_phone}</p>
                          <p>{order.shipping_address}</p>
                          <p>
                            {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/80 p-4 border border-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Order Info</p>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">User ID</span>
                            <span className="font-medium text-gray-900">{order.user_id}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">Status</span>
                            <span className="font-medium text-gray-900">{order.order_status}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">Created</span>
                            <span className="font-medium text-gray-900">{formatOrderDate(order.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
