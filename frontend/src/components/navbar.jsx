import { Link } from "react-router-dom";
import { FiSettings } from 'react-icons/fi';
import { VscAzure } from "react-icons/vsc";
const styles = {
    navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)', padding: '0.75rem 2.5rem', background: 'var(--bg-elev)', color: 'var(--text)' },
    navBrand: { display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text)' },
    navbarLogo: { width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center' },
    navbarTitle: { color: 'var(--text)', fontSize: '1.125rem', fontWeight: 'bold', lineHeight: '1.25', letterSpacing: '-0.015em', margin: 0 },
    navbarLinksDiv1: { display: 'flex', flex: 1, justifyContent: 'flex-end', gap: '2rem' },
    navbarLinksDiv2: { display: 'flex', alignItems: 'center', gap: '2.25rem' },
    navLinks: { color: 'var(--text)', opacity: 0.9, fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none', lineHeight: 'normal' },
    navbarLogin: { display: 'flex', minWidth: '84px', maxWidth: '480px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '9999px', height: '2.5rem', padding: '0 1rem', background: 'rgba(148,163,184,0.18)', color: 'var(--text)', fontSize: '0.95rem', fontWeight: 'bold', lineHeight: 'normal', letterSpacing: '0.015em', textDecoration: 'none' },
    navbarLoginHover: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
};

function navbar() {
    return (
        <header style={styles.navbar}>
            <div style={styles.navBrand}>
                <div style={styles.navbarLogo}>
                    <VscAzure />
                </div>
                <h2 style={styles.navbarTitle}>QuantumScholar</h2>
            </div>
            <div style={styles.navbarLinksDiv1}>
                <div style={styles.navbarLinksDiv2}>
                    <Link to="/" style={styles.navLinks}>Home</Link>
                    <Link to="/classroom" style={styles.navLinks}>Classroom</Link>
                    <Link to="/contact" style={styles.navLinks}>Contact</Link>
                    <Link to="/settings" style={styles.navLinks} aria-label="Settings">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <FiSettings size={16} />
                            <span>Settings</span>
                        </span>
                    </Link>
                </div>
                <Link to="/login" style={styles.navbarLogin}>
                    <span style={styles.navbarLoginHover}>Log In</span>
                </Link>

            </div>
        </header>
    )
}

export default navbar;