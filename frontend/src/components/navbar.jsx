import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FiSettings, FiMenu, FiX, FiUser } from 'react-icons/fi';
import logo from '../assets/Qubitopia-logo-transparent-1456x1456.png';
import { getCookie } from '../common/cookie.js';

const styles = {
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)', padding: '0.75rem 1rem', background: 'var(--bg-elev)', color: 'var(--text)' },
    navBrand: { display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text)' },
    navbarLogo: { width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center' },
    navbarTitle: { color: 'var(--text)', fontSize: '1.125rem', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '-0.015em', margin: 0 },
    navbarLinksDiv1: { display: 'flex', flex: 1, justifyContent: 'flex-end', gap: '2rem' },
    navbarLinksDiv2: { display: 'flex', alignItems: 'center', gap: '2.25rem' },
    navLinks: { color: 'var(--text)', opacity: 0.9, fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none', lineHeight: 'normal' },
    navbarLogin: { display: 'flex', minWidth: '84px', maxWidth: '480px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '9999px', height: '2.5rem', padding: '0 1rem', background: 'rgba(148,163,184,0.18)', color: 'var(--text)', fontSize: '0.95rem', fontWeight: 'bold', lineHeight: 'normal', letterSpacing: '0.015em', textDecoration: 'none' },
    navbarLoginHover: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        toggleBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 999, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)' },
        mobileMenu: { background: 'var(--bg-elev)', borderTop: '1px solid var(--border)' },
        mobileLink: { display: 'block', padding: '0.875rem 1rem', color: 'var(--text)', textDecoration: 'none', borderBottom: '1px solid var(--border)' },
    logo:{ width: '150%', height: 'auto'},
    avatarBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 999, border: '1px solid var(--border)', background: 'rgba(148,163,184,0.12)', color: 'var(--text)' }
};

function Navbar() {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => getCookie('qs-user') != null);
    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);
    useEffect(() => {
        const update = () => setIsLoggedIn(getCookie('qs-user') != null);
        update();
        window.addEventListener('focus', update);
        return () => window.removeEventListener('focus', update);
    }, []);

    return (
        <>
            <header style={styles.navbar}>
                <Link to='/' style={styles.navLinks}>
                <div style={styles.navBrand}>
                    <div style={styles.navbarLogo}>
                        <img src={logo} alt="QuantumScholar Logo" style={styles.logo} />
                    </div>
                    <h2 style={styles.navbarTitle}>QuantumScholar</h2>
                </div>
                </Link>
                {/* Desktop nav */}
                <div className="d-none d-md-flex" style={styles.navbarLinksDiv1}>
                    <div style={styles.navbarLinksDiv2}>
                        <Link to="/" style={styles.navLinks}>Home</Link>
                        <Link to="/exam/manageExam" style={styles.navLinks}>Manage Exams</Link>
                        {isLoggedIn ? (
                            <Link to="/settings" aria-label="Open Settings" title="Settings" style={{ textDecoration: 'none' }}>
                                <span style={styles.avatarBtn}>
                                    <FiUser size={18} />
                                </span>
                            </Link>
                        ) : (
                            <Link to="/settings" style={styles.navLinks} aria-label="Settings">
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FiSettings size={16} />
                                    <span>Settings</span>
                                </span>
                            </Link>
                        )}
                    </div>
                    {!isLoggedIn && (
                        <Link to="/login" style={styles.navbarLogin}>
                            <span style={styles.navbarLoginHover}>Log In</span>
                        </Link>
                    )}
                </div>

                {/* Mobile toggle */}
                <button aria-label="Menu" onClick={toggle} className="d-md-none" style={styles.toggleBtn}>
                    {open ? <FiX size={18} /> : <FiMenu size={18} />}
                </button>
            </header>

            {/* Mobile menu */}
            {open && (
                <nav className="d-md-none" style={styles.mobileMenu}>
                    <Link to="/" style={styles.mobileLink} onClick={close}>Home</Link>
                    <Link to="/contact" style={styles.mobileLink} onClick={close}>Contact</Link>
                    <Link to="/settings" style={styles.mobileLink} onClick={close}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiSettings size={16} />
                            <span>Settings</span>
                        </span>
                    </Link>
                    {!isLoggedIn && (
                        <div style={{ padding: '0.75rem 1rem' }}>
                            <Link to="/login" onClick={close} style={{ ...styles.navbarLogin, width: '100%' }}>
                                <span style={styles.navbarLoginHover}>Log In</span>
                            </Link>
                        </div>
                    )}
                </nav>
            )}
        </>
    );
}

export default Navbar;