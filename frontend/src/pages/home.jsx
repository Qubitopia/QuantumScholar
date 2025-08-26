import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import logo from '../assets/Qubitopia-logo-transparent-1456x1456.png';
const Home = () => {
    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 85%, #000) 100%)', color: 'var(--text)' }}>
            <Navbar />

            <section className="py-5 py-lg-6">
                <Container className="text-center">
                    <div className="mx-auto mb-4" style={{ width: 160, height: 160 }}>
                        <img src={logo} alt="QuantumScholar Logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h1 className="display-5 fw-bold mb-3 gradient-text">QuantumScholar Exams</h1>
                    <p className="lead mx-auto" style={{ maxWidth: 720, color: 'var(--muted)' }}>
                            Take proctored exams with confidence. Create assessments with a clear, manual question editor for teachers and admins.
                    </p>

                    {/* Primary CTAs */}
                    <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                        <Button as={Link} to="/classroom" size="lg" className="rounded-pill px-4" variant="success">
                            Take Exam
                        </Button>
                            <Button size="lg" className="rounded-pill px-4" variant="primary" onClick={console.log("Create Exam clicked")}>
                                Create Exam
                        </Button>
                    </div>
                </Container>
            </section>

            {/* Features */}
            <section className="py-4 py-lg-5" style={{ background: 'var(--bg)' }}>
                <Container>
                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="h-100 shadow-sm border-0 surface">
                                <Card.Body>
                                    <div className="mb-3" aria-hidden>
                                        <span className="icon-circle bg-primary-subtle text-primary">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" /></svg>
                                        </span>
                                    </div>
                                        <Card.Title className="fw-bold">Manual Question Editor</Card.Title>
                                        <Card.Text className="text-secondary">Build your assessments manually with MCQ, MSQ, and open-ended questions. Reorder easily and save safely.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 shadow-sm border-0 surface">
                                <Card.Body>
                                    <div className="mb-3" aria-hidden>
                                        <span className="icon-circle bg-success-subtle text-success">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" /></svg>
                                        </span>
                                    </div>
                                    <Card.Title className="fw-bold">Proctored & Secure</Card.Title>
                                    <Card.Text className="text-secondary">Camera checks, tab-switch detection, timed sections, and randomized question banks reduce malpractice.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 shadow-sm border-0 surface">
                                <Card.Body>
                                    <div className="mb-3" aria-hidden>
                                        <span className="icon-circle bg-warning-subtle text-warning">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 7V4h8v3" stroke="currentColor" strokeWidth="1.5" /></svg>
                                        </span>
                                    </div>
                                    <Card.Title className="fw-bold">Instant Analytics</Card.Title>
                                    <Card.Text className="text-secondary">Detailed insights by topic, Bloom level, and cohort. Export to CSV/PDF and share with stakeholders.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <Footer />
        </div>
    );
};

export default Home;