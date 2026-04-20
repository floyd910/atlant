import React, { useState, useEffect, useCallback } from "react";
import Logo from "../../assets/pin-new-logo.png";
import "./Admin.css";
import AddTour from "../../components/addTour/AaddTour";

const Admin = () => {
  const [user, setUser] = useState("giomegre");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ✅ token in state (so UI updates correctly)
  const [token, setToken] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE || "https://pingeorgia-back.vercel.app";

  // ✅ Cloudinary env (frontend-safe only)
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  // optional
  const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "";
  const CLOUDINARY_TAG = import.meta.env.VITE_CLOUDINARY_TAG || "";

  // ✅ load token once on page load / refresh
  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    setToken(t);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("admin_token", data.token);

      // ✅ update state so UI reacts immediately
      setToken(data.token);

      setMsg("Logged in ✅");
      setPassword("");
    } catch (err) {
      setMsg("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setMsg("Logged out");
  };

  // ✅ Direct frontend upload to Cloudinary (UNSIGNED upload preset)
  const uploadToCloudinary = useCallback(
    async (file) => {
      if (!file) throw new Error("No file selected");

      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error(
          "Missing Cloudinary env vars: VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET",
        );
      }

      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      // optional extras (only if you want)
      if (CLOUDINARY_FOLDER) form.append("folder", CLOUDINARY_FOLDER);
      if (CLOUDINARY_TAG) form.append("tags", CLOUDINARY_TAG);

      const res = await fetch(url, { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Cloudinary usually returns { error: { message } }
        throw new Error(data?.error?.message || "Cloudinary upload failed");
      }

      // data.secure_url is the final image URL you want to save
      return data;
    },
    [
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_FOLDER,
      CLOUDINARY_TAG,
    ],
  );

  return (
    <div className="adminPage">
      {!token ? (
        <div className="adminCard">
          <div className="adminHeader">
            <img className="adminLogo" src={Logo} alt="logo" />
            <h1 className="adminTitle">Admin</h1>
          </div>

          <form className="adminForm" onSubmit={onSubmit}>
            <label className="adminLabel">User</label>
            <input
              className="adminInput"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />

            <label className="adminLabel">Password</label>
            <input
              className="adminInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <br />

            <button className="adminBtn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {msg ? <div className="adminMsg">{msg}</div> : null}
          </form>
        </div>
      ) : (
        <>
          {/* ✅ ADMIN TOP HEADER (only when logged in) */}
          <div className="adminTopbar">
            <div className="adminTopbarLeft">
              <img className="adminTopbarLogo" src={Logo} alt="logo" />
              <div className="adminTopbarTitle">Admin Panel</div>
            </div>

            <button
              className="adminTopbarLogout"
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>

          <AddTour
            adminToken={token}
            onLogout={logout}
            uploadToCloudinary={uploadToCloudinary}
          />
        </>
      )}
    </div>
  );
};

export default Admin;
