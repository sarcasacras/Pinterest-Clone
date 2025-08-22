import Img from "../Image/Image";
import "./UserIcon.css";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/authApi";
import { Link } from "react-router";

export default function UserIcon() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const userOptionsRef = useRef(null);

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      setOpen(false);
    },
    onError: () => {
      logout();
      setOpen(false);
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userOptionsRef.current &&
        !userOptionsRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="user" ref={userOptionsRef}>
        <Link to={`/${user.username}`}>
          <Img
            src={user.avatar || "/icons/user.svg"}
            alt=""
            className="userIcon"
            w={64}
          />
        </Link>
        <Img
          src="/icons/arrowDown.svg"
          alt=""
          className="arrowDownIcon"
          onClick={() => setOpen((prev) => !prev)}
        />
        {open && (
          <div className="userOptions">
            <a className="userOption" href="/">
              Settings
            </a>
            <Link 
              className="userOption" 
              to={`/${user.username}`}
              onClick={() => setOpen(false)}
            >
              Account
            </Link>
            <button
              className="userOption"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Log Out"}
            </button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <a href="/login" className="loginButton">
          Log In / Sign Up
        </a>
      </div>
    );
  }
}
