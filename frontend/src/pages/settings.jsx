import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import { useTheme } from '../common/theme.jsx';
import { FiUser, FiBell, FiLock, FiMonitor, FiCreditCard, FiSliders } from 'react-icons/fi';
import { TfiPlug } from "react-icons/tfi";
import { getCookie, setCookie, deleteCookie } from '../common/cookie.js';
import { apiPost } from '../common/api.js';
import { apiPut } from '../common/api.js';
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
    const [name, setName] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setName(user?.Name || user?.name || '');
        setSaved(false);
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

function BillingPanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Billing</h2>
            <p style={{ color: 'var(--muted)' }}>Manage your subscription and invoices.</p>
            <div className="surface rounded-3 p-3" style={{ border: '1px solid var(--border)' }}>
                <div className="d-flex justify-content-between">
                    <div>
                        <div className="fw-semibold">Free plan</div>
                        <div style={{ color: 'var(--muted)' }}>0/month</div>
                    </div>
                    <button className="btn btn-primary">Upgrade</button>
                </div>
            </div>
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
    const [active, setActive] = useState('appearance');
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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