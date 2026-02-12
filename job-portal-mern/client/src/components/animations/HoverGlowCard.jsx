
import { motion } from "framer-motion";

const HoverGlowCard = ({ children, className = "", onClick }) => {
    return (
        <div className={`relative group ${className}`} onClick={onClick}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 w-full h-full"
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                {children}
            </motion.div>
            <div
                className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-500 group-hover:duration-200"
                style={{ zIndex: 0 }}
            ></div>
        </div>
    );
};

export default HoverGlowCard;
