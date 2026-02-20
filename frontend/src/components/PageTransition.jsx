import { motion } from 'framer-motion'

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.6, -0.05, 0.01, 0.99], // Custom cubic bezier for "fintech" smoothness
            staggerChildren: 0.1
        }
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: "easeInOut"
        }
    }
}

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition
