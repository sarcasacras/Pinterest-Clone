import "./LoginPage.css";
import Img from "../../components/Image/Image";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [isRegistered, setIsRegistered] = useState(true);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ username, password }) => authApi.login(username, password),
    onSuccess: (data) => {
      login(data.user);
      navigate('/');
    },
    onError: (error) => {
      setError(error.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData) => authApi.register(userData),
    onSuccess: (data) => {
      login(data.user);
      navigate('/');
    },
    onError: (error) => {
      setError(error.message || 'Registration failed');
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    loginMutation.mutate({ username, password });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('username'),
      displayName: formData.get('name'),
      email: formData.get('register-email'),
      password: formData.get('register-password'),
    };
    registerMutation.mutate(userData);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Img
          src="/icons/website_logo.png"
          alt="Pinterest Logo"
          className="login-logo"
        />

        {isRegistered && (
          <>
            <h1 className="login-title">Log in to your account</h1>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            <div className="login-footer">
              <small>
                Don't have an acccount?
                <button
                  className="register-button"
                  onClick={() => setIsRegistered(false)}
                >
                  Register
                </button>
              </small>
            </div>
          </>
        )}

        {!isRegistered && (
          <>
            <h1 className="login-title">Create an account</h1>
            
            <form className="login-form" onSubmit={handleRegister}>
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="register-email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  name="register-password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <div className="login-footer">
              <small>
                Already have an account?
                <button className="register-button" onClick={() => setIsRegistered(true)}>Sign In</button>
              </small>
            </div>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
