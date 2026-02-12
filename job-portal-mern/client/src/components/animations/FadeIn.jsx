
import { motion } from "framer-motion";

const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
    const directions = {
        up: { y: 20, x: 0 },
        down: { y: -20, x: 0 },
        left: { y: 0, x: 20 },
        right: { y: 0, x: -20 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
