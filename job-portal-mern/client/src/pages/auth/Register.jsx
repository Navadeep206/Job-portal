import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

// Enhanced Register.jsx with accessibility and debug logging
function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("DEBUG REGISTER: Form State:", form);
    console.log("DEBUG REGISTER: Selected Role:", form.role);

    try {
      console.log(`REGISTER: Sending request to /auth/register at ${API.defaults.baseURL}`);
      const res = await API.post("/auth/register", form);
      console.log("REGISTER: Success", res.data);
      login(res.data);
      navigate("/");
    } catch (err) {
      console.error("REGISTER: Error", err);
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      if (err.code === "ERR_NETWORK") {
        setError("Network Error: Is the server running? Check port 5005.");
      }
    }
  };


  return (
    <div className="flex items-center justify-center p-4 fade-in" style={{ minHeight: "80vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
        <h2 className="mb-4 text-center">Create an Account</h2>
        <p className="text-center mb-6">Join us to find your dream job</p>

        {error && <div className="badge badge-error mb-4 w-full text-center p-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="input"
              name="name"
              autoComplete="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="label" htmlFor="role">I am a...</label>
            <select
              id="role"
              className="input"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button className="btn btn-primary w-full" style={{ width: "100%" }}>Register</button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
