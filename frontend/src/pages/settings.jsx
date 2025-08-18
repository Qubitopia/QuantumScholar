import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import { useTheme } from '../common/theme.jsx';
import { FiUser, FiBell, FiLock, FiMonitor, FiCreditCard, FiSliders } from 'react-icons/fi';
import { TfiPlug } from "react-icons/tfi";
import { getCookie, setCookie, deleteCookie } from '../common/cookie.js';
import { apiPut,apiPost,apiGet } from '../common/api.js';
import { useNavigate } from 'react-router-dom';
const sections = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'privacy', label: 'Privacy', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'appearance', label: 'Appearance', icon: FiMonitor },
    { id: 'integrations', label: 'Integrations', icon: TfiPlug },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'advanced', label: 'Advanced', icon: FiSliders },
];
const limitedSections = [
    { id: 'appearance', label: 'Appearance', icon: FiMonitor },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'advanced', label: 'Advanced', icon: FiSliders },
];

async function loadData(token) {
  const { data } = await apiGet('/api/profile', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  setCookie('qs-user', JSON.stringify(data.user), { days: 7 });
  console.log(data);
  return data.user;
}

function Sidebar({ items, active, onSelect }) {
    return (
        <aside style={{
            width: 260,
            borderRight: '1px solid var(--border)',
            padding: '1rem',
            display: 'none'
        }} className="d-none d-md-block">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>USER SETTINGS</div>
            <nav style={{ display: 'grid', gap: 6 }}>
                {items.map(({ id, label, icon: Icon }) => {
                    const selected = id === active;
                    return (
                        <button key={id} onClick={() => onSelect(id)}
                            style={{
                                textAlign: 'left',
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '0.6rem 0.75rem',
                                borderRadius: 8,
                                border: '1px solid var(--border)',
                                background: selected ? 'color-mix(in srgb, var(--bg-elev) 92%, transparent)' : 'transparent',
                                color: 'var(--text)',
                                cursor: 'pointer'
                            }}>
                            <Icon size={16} />
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

function MobileSectionPicker({ items, active, onSelect }) {
    return (
        <div className="d-md-none" style={{
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 1rem',
            background: 'var(--bg-elev)'
        }}>
            <label htmlFor="section" style={{ fontSize: 12, color: 'var(--muted)' }}>
                Settings section
            </label>
            <select id="section" value={active} onChange={(e) => onSelect(e.target.value)} className="form-select mt-1">
                {items.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                ))}
            </select>
        </div>
    );
}

function AppearancePanel() {
    const { theme, setTheme } = useTheme();
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Appearance</h2>
            <p style={{ color: 'var(--muted)' }}>Choose how QuantumScholar looks on this device.</p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12 }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} />
                    Light
                </label>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                    Dark
                </label>
            </div>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Preference is saved locally.</p>
        </section>
    );
}

function ProfilePanel({ user, onUserUpdate }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [saved, setSaved] = useState(false);
    
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const profileRes = await loadData(getCookie('qs-token'));
                if (!mounted) return;
                setName(profileRes?.Name || profileRes?.name || '');
                setSaved(false);
            } catch (e) {
                // optional: handle error state here
            }
        })();
        return () => {
            mounted = false;
        };
    }, [user]);
        const originalName = useMemo(() => user?.Name || user?.name || '', [user]);
        const changed = (name ?? '') !== originalName;

    const fmt = (value) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d.getTime())) return String(value);
        try {
            return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
        } catch {
            return d.toLocaleString();
        }
    };

    const saveName = () => {
        if (!user) return;
        const updated = { ...user, Name: name };
        setCookie('qs-user', JSON.stringify(updated), { days: 7 });
        const token = getCookie('qs-token');
        apiPut('/api/profile', { 'Name': name }, { headers: { Authorization: `Bearer ${token}` } }).then(() => {
            onUserUpdate && onUserUpdate(updated);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    };

    const deactivate = () => {
        // Clear cookie and reset user in parent
        deleteCookie('qs-user', { path: '/' });
        onUserUpdate && onUserUpdate(null);
    };

    const logout = async () => {
        onUserUpdate && onUserUpdate(null);
        navigate('/', { replace: true });
        deleteCookie('qs-user', { path: '/' });
        deleteCookie('qs-token', { path: '/' });
    };

    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Profile</h2>
            {user ? (
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input className="form-control" value={user.public_email || user.email || ''} disabled />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">User ID</label>
                        <input className="form-control" value={user.id ?? ''} disabled />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">QS Coins</label>
                        <input className="form-control" value={user.qs_coins ?? 0} disabled />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Active</label>
                        <input className="form-control" value={String(user.is_active ?? '')} disabled />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Created At</label>
                        <input className="form-control" value={fmt(user.created_at)} disabled />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Updated At</label>
                        <input className="form-control" value={fmt(user.updated_at)} disabled />
                    </div>
                    <div className="col-12 d-flex align-items-center gap-2 mt-2">
                        {changed && name?.trim() && (
                            <button className="btn btn-primary" onClick={saveName}>Save</button>
                        )}
                        {saved && <span className="text-success" role="status">Saved</span>}
                        <span className="ms-auto" />
                        <button className="btn btn-outline-secondary" onClick={logout}>Log out</button>
                        <button className="btn btn-outline-danger" onClick={deactivate}>Deactivate</button>
                    </div>
                </div>
            ) : (
                <p style={{ color: 'var(--muted)' }}>You are not logged in. Please sign in to manage your profile.</p>
            )}
        </section>
    );
}

// Account panel removed as per requirement

function PrivacyPanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Privacy</h2>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="dm" defaultChecked />
                <label className="form-check-label" htmlFor="dm">Allow DMs from classmates</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="profile" />
                <label className="form-check-label" htmlFor="profile">Make profile discoverable</label>
            </div>
        </section>
    );
}

function NotificationsPanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Notifications</h2>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Email frequency</label>
                    <select className="form-select">
                        <option>All</option>
                        <option>Important only</option>
                        <option>None</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Push notifications</label>
                    <select className="form-select">
                        <option>Enabled</option>
                        <option>Disabled</option>
                    </select>
                </div>
            </div>
        </section>
    );
}

function IntegrationsPanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Integrations</h2>
            <p style={{ color: 'var(--muted)' }}>Connect Google Classroom, Microsoft Teams, or LMS systems (coming soon).</p>
            <button className="btn btn-outline-primary">Connect Google</button>
        </section>
    );
}

function BillingPanel({ user, onUserUpdate }) {
    const [coinsToBuy, setCoinsToBuy] = useState(50);
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState('/api/purchase-qscoins-inr');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const RZP_KEY_ID = import.meta.env.VITE_RZP_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    const normalizedUser = getCookie('qs-user');

    const handleBuy = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const amountCoins = Number(coinsToBuy);
        if (!user) {
            setError('Please log in to purchase coins.');
            return;
        }
        if (!amountCoins || amountCoins < 1) {
            setError('Enter a valid coin amount (1 or more).');
            return;
        }
        try {
            setLoading(true);
            const key = (RZP_KEY_ID || '').trim();
            if (!key) {
                setError('Missing Razorpay Key ID. Set VITE_RZP_KEY_ID in frontend/.env and restart dev server.');
                setLoading(false);
                return;
            }

            const token = getCookie('qs-token');
            const orderRes = await apiPost(currency, { qscoins: amountCoins }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
            console.log("currency:", currency,"order currency:", orderRes.data);
            const orderId = orderRes.data.razorpay_order_id;
            if (!orderId) throw new Error('No order id returned by server');

            const options = {
                key,
                amount: orderRes.data.amount,
                currency: orderRes.data.currency,
                name: 'QuantumScholar',
                description: 'QS Coins purchase',
                order_id: orderId,
                prefill: {
                    name: normalizedUser?.Name,
                    email: normalizedUser?.public_email,
                },
                theme: { color: '#2e6da4' },
                handler: async function (response) {
                    try {
                        await apiPost('/api/verify-razorpay-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

                        try {
                            const profileRes = loadData(token);
                            console.log(profileRes.data.user);
                            const updated = profileRes.data.user || null;
                            if (updated) {
                                    const serialized = JSON.stringify(updated);
                                    setCookie('qs-user', serialized, { days: 7, path: '/' });
                                    try { localStorage.setItem('qs-user', serialized); } catch { /* ignore */ }
                                onUserUpdate && onUserUpdate(updated);
                            }
                        } catch { /* ignore */ }

                        setSuccess('Payment verified and coins credited.');
                    } catch (err) {
                        setError(err?.response?.data?.message || err.message || 'Verification failed');
                    }
                },
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Purchase failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            
            <h2 className="h5 fw-bold mb-3">Billing</h2>
            <p style={{ color: 'var(--muted)' }}>Buy QS Coins and see your recent transactions.</p>

            <div className="surface rounded-3 p-3 mb-3" style={{ border: '1px solid var(--border)' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <div className="fw-semibold">Current balance</div>
                        <div style={{ color: 'var(--muted)' }}>{user?.qs_coins ?? 0} QS Coins</div>
                    </div>
                    {!user && (
                        <a className="btn btn-outline-primary" href="/login">Log in to buy</a>
                    )}
                </div>
            </div>

            <form className="surface rounded-3 p-3 mb-4" style={{ border: '1px solid var(--border)' }} onSubmit={handleBuy}>
                <div className="row g-3 align-items-end">
                    <div className="col-sm-4">
                        <label className="form-label">QS Coins to buy</label>
                        <input type="number" min={1} className="form-control" value={coinsToBuy}
                               onChange={(e) => setCoinsToBuy(parseInt(e.target.value || '0', 10))} />
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Currency</label>
                        <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="/api/purchase-qscoins-inr">INR (Razorpay)</option>
                            <option value="/api/purchase-qscoins-usd">USD (Razorpay)</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary" disabled={loading || !user}>
                        {loading ? 'Processing…' : 'Buy with Razorpay'}
                    </button>
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}
                {success && <div className="text-success mt-2">{success}</div>}
            </form>
        </section>
    );
}

function AdvancedPanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Advanced</h2>
            <button className="btn btn-outline-danger">Clear cached data</button>
        </section>
    );
}

const panelMap = {
    profile: ProfilePanel,
    privacy: PrivacyPanel,
    notifications: NotificationsPanel,
    appearance: AppearancePanel,
    integrations: IntegrationsPanel,
    billing: BillingPanel,
    advanced: AdvancedPanel,
};

const Settings = () => {
    const [user, setUser] = useState(() => {
        const raw = getCookie('qs-user');
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!getCookie('qs-user'));
    const [active, setActive] = useState(() => (getCookie('qs-user') ? 'profile' : 'appearance'));
    const Panel = useMemo(() => panelMap[active] ?? AppearancePanel, [active]);

    // Read user cookie on mount and when window regains focus
    useEffect(() => {
        const updateFromCookie = () => {
            const raw = getCookie('qs-user');
            if (!raw) {
                setUser(null);
                setIsLoggedIn(false);
                return;
            }
            try {
                const parsed = JSON.parse(raw);
                setUser(parsed);
                setIsLoggedIn(true);
            } catch {
                // Not JSON? Consider any value as logged in flag
                setUser(null);
                setIsLoggedIn(true);
            }
        };
        updateFromCookie();
        window.addEventListener('focus', updateFromCookie);
        return () => window.removeEventListener('focus', updateFromCookie);
    }, []);

    const availableSections = isLoggedIn ? sections : limitedSections;

    // Ensure active section is always valid for current availability
    useEffect(() => {
        if (!availableSections.find(s => s.id === active)) {
            setActive(availableSections[0]?.id || 'appearance');
        }
    }, [isLoggedIn]);

    return (
        <div style={{ minHeight: '100vh', width: '100vw', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <Sidebar items={availableSections} active={active} onSelect={setActive} />

                <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <MobileSectionPicker items={availableSections} active={active} onSelect={setActive} />
                    <div className="container-fluid" style={{ padding: '1rem' }}>
                        <div className="surface shadow-soft rounded-4 p-4 p-md-5" style={{ maxWidth: 900, width: '100%', border: '1px solid var(--border)' }}>
                            <Panel user={user} onUserUpdate={setUser} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;