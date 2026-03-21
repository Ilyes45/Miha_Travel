import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./NotifBell.css";

const NotifBell = () => {
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open,   setOpen]   = useState(false);
  const ref = useRef(null);

  const fetchNotifs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/notification", {
        headers: { authorization: token }
      });
      setNotifs(res.data.notifs);
      setUnread(res.data.unread);
    } catch (err) {
      console.log("NOTIF ERROR:", err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen && unread > 0) {
      try {
        const token = localStorage.getItem("token");
        await axios.put("/api/notification/read-all", {}, {
          headers: { authorization: token }
        });
        setUnread(0);
        setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
      } catch {}
    }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    if (diff < 60)    return "À l'instant";
    if (diff < 3600)  return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}j`;
  };

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="notif-bell" onClick={handleOpen}>
        🔔
        {unread > 0 && (
          <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span className="notif-header-title">Notifications</span>
          </div>

          <div className="notif-list">
            {notifs.length === 0 ? (
              <div className="notif-empty">Aucune notification</div>
            ) : (
              notifs.map((n) => (
                <div key={n._id} className={`notif-item ${!n.lu ? "unread" : ""}`}>
                  <div className="notif-icon">📋</div>
                  <div className="notif-content">
                    <p className="notif-msg">{n.message}</p>
                    <span className="notif-time">{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.lu && <div className="notif-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifBell;