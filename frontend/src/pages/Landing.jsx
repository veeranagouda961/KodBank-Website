import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import './Landing.css'

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const staggerContainer = {
    initial: {},
    in: {
        transition: {
            staggerChildren: 0.2
        }
    }
}

const Landing = () => (
    <PageTransition>
        <div className="landing-container">
            {/* Watermark Logo Background */}
            <motion.div
                className="watermark-logo"
                animate={{
                    y: [0, -20, 0],
                    rotate: [-10, 0, -10]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                🏦
            </motion.div>
            <div className="landing-content">
                {/* Left Side - Text & CTAs */}
                <motion.div
                    className="landing-text-section"
                    variants={staggerContainer}
                    initial="initial"
                    animate="in"
                >
                    <motion.div className="badge" variants={fadeInUp}>
                        <span className="badge-dot"></span> Next-Gen Banking
                    </motion.div>
                    <motion.h1 variants={fadeInUp} className="hero-title">
                        Banking made <br />
                        <span className="text-highlight">Simple & Secure</span>
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="hero-subtitle">
                        Take control of your finances with KodBank. Experience lightning-fast transactions, zero hidden fees, and bank-grade security all in one sleek app.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="hero-cta-group">
                        <Link to="/register" className="btn-primary hero-btn">
                            Open an Account
                        </Link>
                        <Link to="/login" className="btn-secondary hero-btn">
                            Sign In
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="hero-stats">
                        <div className="stat-item">
                            <h4>1M+</h4>
                            <p>Active Users</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h4>$0</h4>
                            <p>Monthly Fees</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h4>4.9/5</h4>
                            <p>App Rating</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side - Illustration */}
                <motion.div
                    className="landing-illustration"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3 } }}
                >
                    <div className="illustration-wrapper">
                        <motion.h2
                            className="bg-logo-title"
                            initial={{ x: "-50%" }}
                            animate={{ y: [0, -5, 0], x: "-50%", opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        >
                            <span className="logo-emoji">🏦</span> KodBank
                        </motion.h2>

                        {/* Main App Card */}
                        <motion.div
                            className="mockup-card main-mockup"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        >
                            <div className="mockup-header">
                                <span className="logo-emoji">🏦</span> KodBank
                            </div>
                            <div className="mockup-about">
                                <h4>About KodBank</h4>
                                <p>Simple, secure digital banking platform.</p>
                            </div>
                            <div className="mockup-graph">
                                <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                                    <path d="M0,60 L0,40 C30,40 50,15 80,25 C110,35 140,5 170,20 L200,10 L200,60 Z" fill="rgba(245, 158, 11, 0.2)" />
                                    <path d="M0,40 C30,40 50,15 80,25 C110,35 140,5 170,20 L200,10" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            className="floating-item coin coin-1"
                            animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                        >
                            🪙
                        </motion.div>

                        <motion.div
                            className="floating-item coin coin-2"
                            animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                        >
                            🪙
                        </motion.div>

                        <motion.div
                            className="floating-item security-badge"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
                        >
                            <span className="shield">🛡️</span> Secure
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.footer
                className="landing-footer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <div>Developed by <span className="highlight-text">Veeranagouda</span></div>
                <span className="footer-separator">•</span>
                <div>KodNest ID: <span className="highlight-text">KODYVB03M</span></div>
                <span className="footer-separator">•</span>
                <div>&copy; KodBank. Copyright received.</div>
            </motion.footer>
        </div>
    </PageTransition>
)

export default Landing
