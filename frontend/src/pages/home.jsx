import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, InputGroup, Badge, Card, Modal } from 'react-bootstrap';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import logo from '../assets/Qubitopia-logo-transparent-1456x1456.png';
const Home = () => {
    const [query, setQuery] = useState('');
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('Generate a 30-minute Algebra quiz on linear equations and inequalities.');
    const [aiLevel, setAiLevel] = useState('Intermediate');
    const [aiCount, setAiCount] = useState(10);

    const placeholder = useMemo(() => 'Search exams, topics, or enter code…', []);

    const submitSearch = (e) => {
        e.preventDefault();
    };

    const handleAIGenerate = (e) => {
        e.preventDefault();
        // This is a UI placeholder; wire to your backend/AI service later
        const params = new URLSearchParams({ prompt: aiPrompt, level: aiLevel, count: String(aiCount) });
    };

    return (
        <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 85%, #000) 100%)', color: 'var(--text)' }}>
            <Navbar />

            {/* Hero */}
            <section className="py-5 py-lg-6">
                <Container className="text-center">
                    <div className="mx-auto mb-4" style={{ width: 64, height: 64 }}>
                        <img src={logo} alt="QuantumScholar Logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h1 className="display-5 fw-bold mb-3 gradient-text">QuantumScholar Exams</h1>
                      <p className="lead mx-auto" style={{ maxWidth: 720, color: 'var(--muted)' }}>
                        Take proctored exams with confidence. Create assessments in minutes with AI-assisted question procurement for teachers and admins.
                    </p>

                    {/* Google-like search box */}
                    <Form onSubmit={submitSearch} className="mx-auto mt-4 w-100" style={{ maxWidth: 720 }}>
                        <div className="glass shadow-soft rounded-pill p-2 px-3">
                            <InputGroup>
                                <InputGroup.Text className="bg-transparent border-0 pe-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-6-6" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                </InputGroup.Text>
                                <Form.Control
                                    className="border-0 shadow-none search-input"
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={placeholder}
                                />
                                <Button type="submit" variant="primary" className="rounded-pill px-4">Search</Button>
                            </InputGroup>
                        </div>
                        <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap floating-badges">
              <span className="chip">Math</span>
              <span className="chip">Physics</span>
              <span className="chip">Chemistry</span>
              <span className="chip">Coding</span>
              <span className="chip">Mock Tests</span>
                        </div>
                    </Form>

                    {/* Primary CTAs */}
                    <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                        <Button as={Link} to="/classroom" size="lg" className="rounded-pill px-4" variant="success">
                            Take Exam
                        </Button>
                        <Button size="lg" className="rounded-pill px-4" variant="primary" onClick={() => setShowAIModal(true)}>
                            Create Exam with AI
                        </Button>
                        <Button as={Link} to="/settings" size="lg" className="rounded-pill px-4 btn-outline-surface" variant="outline-secondary">
                            Admin Console
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
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5"/></svg>
                                        </span>
                                    </div>
                                    <Card.Title className="fw-bold">AI Procurement</Card.Title>
                                    <Card.Text className="text-secondary">Source high-quality questions from your syllabus using structured prompts. Adjust difficulty, count, and tagging instantly.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 shadow-sm border-0 surface">
                                <Card.Body>
                                    <div className="mb-3" aria-hidden>
                                        <span className="icon-circle bg-success-subtle text-success">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5"/></svg>
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
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7V4h8v3" stroke="currentColor" strokeWidth="1.5"/></svg>
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
            {/* AI Generator Modal */}
            <Modal show={showAIModal} onHide={() => setShowAIModal(false)} centered>
                <Form onSubmit={handleAIGenerate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Exam with AI</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Prompt</Form.Label>
                            <Form.Control as="textarea" rows={3} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
                            <Form.Text className="text-secondary">Describe the syllabus, outcomes, and constraints.</Form.Text>
                        </Form.Group>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Difficulty</Form.Label>
                                    <Form.Select value={aiLevel} onChange={(e) => setAiLevel(e.target.value)}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Questions</Form.Label>
                                    <Form.Control type="number" min={5} max={100} value={aiCount} onChange={(e) => setAiCount(Number(e.target.value))} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAIModal(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Generate</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Home;