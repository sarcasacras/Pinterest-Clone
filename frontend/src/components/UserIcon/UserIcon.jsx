import Img from "../Image/Image";
import "./UserIcon.css";
import { useState, useRef, useEffect } from "react";

export default function UserIcon() {
  const loggedIn = true;
  const [open, setOpen] = useState(false);
  const userOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userOptionsRef.current && !userOptionsRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (loggedIn) {
    return (
      <div className="user"  ref={userOptionsRef}>
        <Img src="/icons/user.svg" alt="" className="userIcon" />
        <Img
          src="/icons/arrowDown.svg"
          alt=""
          className="arrowDownIcon"
          onClick={() => setOpen((prev) => !prev)}
        />
        {open && (
          <div className="userOptions">
            <a className="userOption" href="/">Settings</a>
            <a className="userOption" href="/">Account</a>
            <a className="userOption" href="/">Log Out</a>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <a href="/" className="loginButton">Log In / Sign Up</a>
      </div>
    )
  }

  
}
