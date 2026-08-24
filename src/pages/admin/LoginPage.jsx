import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, Loader2, ArrowLeft, Film, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } catch (error) {
      console.warn("First sign-in attempt failed, trying create/init:", error.code);
      try {
        const { createUserWithEmailAndPassword } = await import("firebase/auth");
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back, Admin!");
        navigate("/admin");
      } catch (createError) {
        console.error("Sign-in / create error:", createError);
        toast.error("Login failed: " + (error.message || "Invalid credentials"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) { toast.error("Please enter your email first."); return; }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-glow" />

      {/* Back link */}
      <Link
        to="/"
        style={{
          position: "absolute", top: 24, left: 24,
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "#6b7280", textDecoration: "none",
          transition: "color 0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#e5e7eb"}
        onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} />
        Back to site
      </Link>

      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-logo">
          <Film style={{ width: 24, height: 24 }} />
        </div>

        <h1>Admin Sign In</h1>
        <p>Sign in to manage your United Films CMS.</p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 6 }}>
            <label className="admin-label">Email Address</label>
          </div>
          <div className="admin-login-input-wrap">
            <Mail />
            <input
              type="email"
              className="admin-login-input"
              placeholder="admin@unitedfilms.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label className="admin-label">Password</label>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isResetting}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11, color: "#f59e0b", padding: 0,
                opacity: isResetting ? 0.5 : 1,
              }}
            >
              {isResetting ? "Sending…" : "Forgot password?"}
            </button>
          </div>
          <div className="admin-login-input-wrap" style={{ position: "relative" }}>
            <Lock />
            <input
              type={showPassword ? "text" : "password"}
              className="admin-login-input"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ paddingRight: 40 }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", color: "#6b7280", cursor: "pointer",
                display: "flex", alignItems: "center",
              }}
            >
              {showPassword
                ? <EyeOff style={{ width: 14, height: 14 }} />
                : <Eye style={{ width: 14, height: 14 }} />}
            </button>
          </div>

          <button type="submit" className="admin-login-submit" disabled={isLoading}>
            {isLoading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : null}
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#4b5563" }}>
          Access restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
