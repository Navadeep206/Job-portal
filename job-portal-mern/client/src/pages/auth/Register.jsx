import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FadeIn from "../../components/animations/FadeIn";

// Enhanced Register.jsx with accessibility and debug logging
function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("DEBUG REGISTER: Form State:", form);

    try {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <FadeIn delay={0.1}>
        <Card className="w-full max-w-lg p-8 shadow-xl border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h2>
            <p className="text-slate-500">Join us to find your dream job</p>
          </div>

          {error && (
            <div className="bg-red-50 text-error text-sm p-3 rounded-xl mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <div className="relative mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1 ml-1" htmlFor="role">
                I am a...
              </label>
              <select
                id="role"
                className="input-field appearance-none cursor-pointer"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-lg shadow-primary/25 mt-4"
              isLoading={loading}
            >
              Register
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-hover transition-colors">
              Login here
            </Link>
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}

export default Register;
