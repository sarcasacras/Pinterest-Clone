import "./Notifications.css";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../../api/notificationsApi";
import Img from "../Image/Image";
import { Link } from "react-router";
import { useRef, useEffect } from "react";

export default function Notifications({ onClose }) {
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.getNotifications(),
  });

  console.log("Notifications data:", notifications);

  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        !event.target.closest('.menu-button [alt="notification"]')
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div className="notifications-dropdown" ref={notificationsRef}>
      {isLoading ? (
        <div>Loading notifications...</div>
      ) : error ? (
        <div>Error loading notifications</div>
      ) : (
        <div>
          {notifications?.notifications?.length > 0 ? (
            <div>
              {notifications.notifications.map((notification) => (
                <div key={notification._id} className="notification-item">
                  {notification.message}
                  {notification.type === "comment" && (
                    <div className="notification-comment">
                      <div className="notification-comment-left">
                        <Link
                          to={`/${notification.sender?.username}`}
                          onClick={onClose}
                        >
                          <Img
                            src={
                              notification.sender?.avatar ||
                              "/general/noavatar.svg"
                            }
                            alt={notification.sender?.displayName}
                            className="notification-comment-avatar"
                          />
                        </Link>
                      </div>
                      <div className="notification-comment-right">
                        <div className="notification-comment-nickname">
                          {notification.sender?.displayName}{" "}
                          <span className="notification-text">commented:</span>
                        </div>
                        <div className="notification-comment-content">
                          {notification.comment?.content}
                        </div>
                      </div>
                      <div className="notification-pin-image">
                        <Link
                          to={`/pin/${notification.pin?._id}`}
                          onClick={onClose}
                        >
                          {!notification.isRead && <div className="notification-unread-indicator"></div>}
                          <Img
                            src={notification.pin?.imageUrl}
                            alt="Pin"
                            w={100}
                            className="notification-pin-thumbnail"
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                  {notification.type === "like" && (
                    <div className="notification-comment">
                      <div className="notification-comment-left">
                        <Link
                          to={`/${notification.sender?.username}`}
                          onClick={onClose}
                        >
                          <Img
                            src={
                              notification.sender?.avatar ||
                              "/general/noavatar.svg"
                            }
                            alt={notification.sender?.displayName}
                            className="notification-comment-avatar"
                          />
                        </Link>
                      </div>
                      <div className="notification-like-right">
                        <span>
                          <strong>{notification.sender?.displayName}</strong>{" "}
                          liked your post!
                        </span>
                      </div>
                      <div className="notification-pin-image">
                        <Link
                          to={`/pin/${notification.pin?._id}`}
                          onClick={onClose}
                        >
                          {!notification.isRead && <div className="notification-unread-indicator"></div>}
                          <Img
                            src={notification.pin?.imageUrl}
                            alt="Pin"
                            w={100}
                            className="notification-pin-thumbnail"
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No notifications</div>
          )}
        </div>
      )}
    </div>,
    document.body
  );
}
