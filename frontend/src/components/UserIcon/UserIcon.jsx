import "./UserIcon.css";
import { useState } from "react";

export default function UserIcon() {
  const loggedIn = true;
  const [open, setOpen] = useState(false);

  if (loggedIn) {
    return (
      <div className="user">
        <img src="/icons/user.svg" alt="" className="userIcon" />
        <img
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
