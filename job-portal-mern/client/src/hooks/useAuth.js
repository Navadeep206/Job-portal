import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};


// Instead of:

// useContext(AuthContext)


// We use:

// useAuth()


// Cleaner ✅