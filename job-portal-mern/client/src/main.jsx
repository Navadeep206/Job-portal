import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>
    <JobProvider>
      <App />
    </JobProvider>
  </AuthProvider>
);

