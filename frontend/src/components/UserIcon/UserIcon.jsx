import Img from "../Image/Image";
import "./UserIcon.css";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../api/authApi";

export default function UserIcon() {
  const { user, logout } = useAuth();
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

  if (user) {
    return (
      <div className="user" ref={userOptionsRef}>
        <Img src="/icons/user.svg" alt="" className="userIcon" />
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
            <a className="userOption" href="/">
              Account
            </a>
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
