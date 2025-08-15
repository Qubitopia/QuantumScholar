import React, { useMemo, useState } from 'react';
import Navbar from '../components/navbar.jsx';
import { useTheme } from '../common/theme.jsx';
import { FiUser, FiMail, FiBell, FiLock, FiMonitor, FiCreditCard, FiSliders } from 'react-icons/fi';
import { TfiPlug } from "react-icons/tfi";
const sectionss = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'account', label: 'Account', icon: FiMail },
    { id: 'privacy', label: 'Privacy', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'appearance', label: 'Appearance', icon: FiMonitor },
    { id: 'integrations', label: 'Integrations', icon: TfiPlug },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'advanced', label: 'Advanced', icon: FiSliders },
];
const sections = [
    { id: 'appearance', label: 'Appearance', icon: FiMonitor },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'advanced', label: 'Advanced', icon: FiSliders },
];

function Sidebar({ active, onSelect }) {
    return (
        <aside style={{
            width: 260,
            borderRight: '1px solid var(--border)',
            padding: '1rem',
            display: 'none'
        }} className="d-none d-md-block">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>USER SETTINGS</div>
            <nav style={{ display: 'grid', gap: 6 }}>
                {sections.map(({ id, label, icon: Icon }) => {
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

function MobileSectionPicker({ active, onSelect }) {
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
                {sections.map(s => (
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

function ProfilePanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Profile</h2>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Display name</label>
                    <input className="form-control" placeholder="Your name" />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Handle</label>
                    <input className="form-control" placeholder="@username" />
                </div>
                <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" rows={3} placeholder="Short bio" />
                </div>
            </div>
            <div className="mt-3">
                <button className="btn btn-primary">Save</button>
            </div>
        </section>
    );
}

function AccountPanel() {
    return (
        <section>
            <h2 className="h5 fw-bold mb-3">Account</h2>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="you@example.com" />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Change password</label>
                    <input type="password" className="form-control" placeholder="New password" />
                </div>
            </div>
            <div className="mt-3 d-flex gap-2">
                <button className="btn btn-primary">Update</button>
                <button className="btn btn-outline-danger">Deactivate</button>
            </div>
        </section>
    );
}

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
    account: AccountPanel,
    privacy: PrivacyPanel,
    notifications: NotificationsPanel,
    appearance: AppearancePanel,
    integrations: IntegrationsPanel,
    billing: BillingPanel,
    advanced: AdvancedPanel,
};

const Settings = () => {
    const [active, setActive] = useState('appearance');
    const Panel = useMemo(() => panelMap[active] ?? AppearancePanel, [active]);

    return (
        <div style={{ minHeight: '100vh', width: '100vw', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                <Sidebar active={active} onSelect={setActive} />

                <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <MobileSectionPicker active={active} onSelect={setActive} />
                    <div className="container-fluid" style={{ padding: '1rem' }}>
                        <div className="surface shadow-soft rounded-4 p-4 p-md-5" style={{ maxWidth: 900, width: '100%', border: '1px solid var(--border)' }}>
                            <Panel />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;