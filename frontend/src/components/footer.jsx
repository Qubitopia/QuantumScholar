import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
const styles = {
    footer: {
        backgroundColor: 'var(--bg-elev)',
        color: 'var(--text)',
        padding: '1.5rem 0',
        marginTop: 'auto',
        borderTop: '1px solid var(--border)'
    },
    link: {
        color: 'var(--text)',
        marginRight: '1rem',
        textDecoration: 'none',
        opacity: 0.9
    },
    linkLast: {
        color: 'var(--text)',
        textDecoration: 'none',
        opacity: 0.9
    }
};
const Footer = () => (
    <footer style={styles.footer}>
        <Container>
            <Row>
                <Col md={6}>
                    <h5>Mock Project</h5>
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </Col>
                <Col md={6} className="text-md-end">
                    <a href="/privacy" style={styles.link} className="me-3">Privacy Policy</a>
                    <a href="/terms" style={styles.linkLast}>Terms of Service</a>
                </Col>
            </Row>
        </Container>
    </footer>
);

export default Footer;
