import React from 'react';
import Navbar from '../components/navbar.jsx';
import { useTheme } from '../common/theme.jsx';
const Settings = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar />
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: 600,
                    background: 'var(--bg-elev)',
                    borderRadius: 12,
                    boxShadow: 'var(--card-shadow)',
                    padding: 32,
                    color: 'var(--text)'
                }}>
                    <h1>Settings</h1>
                    <form>
                        <fieldset style={{ marginBottom: 24 }}>
                            <legend style={{ fontWeight: 'bold', marginBottom: 8 }}>Appearance</legend>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="light"
                                        checked={theme === 'light'}
                                        onChange={() => setTheme('light')}
                                    />
                                    Light
                                </label>
                                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="dark"
                                        checked={theme === 'dark'}
                                        onChange={() => setTheme('dark')}
                                    />
                                    Dark
                                </label>
                            </div>
                            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Theme preference is saved to this browser.</p>
                        </fieldset>
                        <div style={{ marginBottom: 16 }}>
                            <label>
                                <strong>Username:</strong>
                                <input type="text" name="username" style={{ marginLeft: 10 }} />
                            </label>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>
                                <strong>Email:</strong>
                                <input type="email" name="email" style={{ marginLeft: 10 }} />
                            </label>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label>
                                <strong>Change Password:</strong>
                                <input type="password" name="password" style={{ marginLeft: 10 }} />
                            </label>
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;