import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import FadeIn from "../../components/animations/FadeIn";
import { AlertTriangle } from 'lucide-react';

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

    try {
      const res = await API.post("/auth/register", form);
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

  const roleOptions = [
    { value: "user", label: "Job Seeker" },
    { value: "recruiter", label: "Recruiter" },
  ];

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-10">
      <FadeIn delay={0.1}>
        <Card className="w-full max-w-lg p-8 shadow-2xl border-slate-100 dark:border-slate-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Create an Account</h2>
            <p className="text-slate-500 dark:text-slate-400">Join us to find your dream job</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-error dark:text-red-400 text-sm p-4 rounded-xl mb-6 text-center border border-red-100 dark:border-red-800 flex items-center justify-center gap-2">
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <Select
              label="I am a..."
              name="role"
              value={form.role}
              onChange={handleChange}
              options={roleOptions}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-xl shadow-primary/25 mt-4"
              isLoading={loading}
            >
              Register
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
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
