// src/pages/TourPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./TourPage.css";

import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://pingeorgia-back.vercel.app";

// ✅ Cloudinary transform helpers (performance + crop/resize)
const cldFill = (url, w, h) => {
  const u = String(url || "").trim();
  if (!u) return "";
  if (!u.includes("/upload/")) return u;
  const parts = [`f_auto`, `q_auto`, `dpr_auto`];
  if (w) parts.push(`w_${w}`);
  if (h) parts.push(`h_${h}`, `c_fill`, `g_auto`);
  return u.replace("/upload/", `/upload/${parts.join(",")}/`);
};

const TourPage = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ hide whole page until main image loaded (if there is a main image)
  const [mainLoaded, setMainLoaded] = useState(false);

  // ✅ gallery
  const [mainImg, setMainImg] = useState("");
  const [secondaryImgs, setSecondaryImgs] = useState([]);

  // ✅ fullscreen viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState("");

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setErr("");
      setItem(null);
      setMainLoaded(false);
      setMainImg("");
      setSecondaryImgs([]);
      setViewerOpen(false);
      setViewerUrl("");

      try {
        const res = await fetch(`${API_BASE}/api/tours/${id}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load tour");
        if (!alive) return;

        const got = data?.item || null;
        setItem(got);

        const arr = Array.isArray(got?.images) ? got.images : [];
        const cover = got?.coverUrl || arr[0] || "";

        // unique, keep order
        const uniq = [];
        const seen = new Set();
        const push = (u) => {
          const s = String(u || "").trim();
          if (!s) return;
          if (seen.has(s)) return;
          seen.add(s);
          uniq.push(s);
        };

        push(cover);
        arr.forEach(push);

        const m = uniq[0] || "";
        const rest = uniq.slice(1);

        setMainImg(m);
        setSecondaryImgs(rest);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load tour");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    if (id) run();

    return () => {
      alive = false;
    };
  }, [id]);

  // ✅ close viewer on ESC + lock scroll
  useEffect(() => {
    if (!viewerOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setViewerOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [viewerOpen]);

  const chips = useMemo(() => {
    const regs = Array.isArray(item?.regions) ? item.regions : [];
    const cats = Array.isArray(item?.categories) ? item.categories : [];
    // (not shown near main image; you can show later if you want somewhere else)
    const uniq = [];
    const seen = new Set();
    [...regs, ...cats].forEach((x) => {
      const s = String(x || "").trim();
      if (!s) return;
      if (seen.has(s)) return;
      seen.add(s);
      uniq.push(s);
    });
    return uniq;
  }, [item]);

  const openViewer = (url) => {
    const s = String(url || "").trim();
    if (!s) return;
    setViewerUrl(s);
    setViewerOpen(true);
  };

  const showFullLoader = loading || (!err && !!mainImg && !mainLoaded);

  if (err) {
    return (
      <div className="tourPage">
        <div className="tourWrap">
          <div className="tourError">{err}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="tourPage">
        {showFullLoader ? <Loader /> : null}

        <div className={`tourWrap ${showFullLoader ? "tourHidden" : ""}`}>
          <h1 className="tourTitle">{item?.title}</h1>

          {/* ✅ spacing after title, then ONLY main image */}
          {mainImg ? (
            <div className="tourMainImage">
              <img
                className="tourMainImg"
                src={cldFill(mainImg, 1800, 1000)}
                alt={item?.title || "tour"}
                loading="eager"
                decoding="async"
                onLoad={() => setMainLoaded(true)}
                onError={() => setMainLoaded(true)}
                onClick={() => openViewer(mainImg)}
              />
            </div>
          ) : null}

          {/* ✅ 75% width reading area: description */}
          <div className="tourReadingArea">
            <div
              className="tourDescription ql-editor"
              dangerouslySetInnerHTML={{
                __html: String(item?.descriptionHtml || ""),
              }}
            />

            {/* ✅ secondary images AFTER description, same width, 3 per line */}
            {secondaryImgs.length ? (
              <div className="tourMoreImages">
                <div className="tourMoreGrid">
                  {secondaryImgs.map((u) => (
                    <button
                      key={u}
                      type="button"
                      className="tourMoreItem"
                      onClick={() => openViewer(u)}
                      aria-label="Open image"
                    >
                      <img
                        className="tourMoreImg"
                        src={cldFill(u, 900, 650)}
                        alt="tour"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ✅ FULLSCREEN VIEWER */}
        {viewerOpen ? (
          <div className="imgViewer" onMouseDown={() => setViewerOpen(false)}>
            <div
              className="imgViewerInner"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="imgViewerClose"
                onClick={() => setViewerOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <img
                className="imgViewerImg"
                src={cldFill(viewerUrl, 2600, 1600)}
                alt="tour"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default TourPage;
