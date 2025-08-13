import "./LoginPage.css";
import Img from "../../components/Image/Image";
import { useState } from "react";

export default function LoginPage() {
  const [isRegistered, setIsRegistered] = useState(true);
  const [error, setError] = useState("");

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
            <form className="login-form">
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
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

              <button type="submit" className="login-btn">
                Log In
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
            
            <form className="login-form">
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

              <button type="submit" className="login-btn">
                Register
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
