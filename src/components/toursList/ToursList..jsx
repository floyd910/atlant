// src/components/toursList/ToursList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ToursList.css";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://pingeorgia-back.vercel.app";

const stripHtml = (html) =>
  String(html || "")
    .replace(/<[^>]*>/g, "")
    .trim();

const cldThumb = (url, w = 520, h = 360) => {
  const u = String(url || "").trim();
  if (!u) return "";
  if (!u.includes("/upload/")) return u;
  return u.replace(
    "/upload/",
    `/upload/f_auto,q_auto,dpr_auto,c_fill,g_auto,w_${w},h_${h}/`,
  );
};

const ToursList = ({ items, title }) => {
  const hasExternal = items !== undefined; // 🔥 important

  const [fetchedItems, setFetchedItems] = useState([]);
  const [loading, setLoading] = useState(!hasExternal);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (hasExternal) return; // ✅ NEVER fetch if items prop exists

    let alive = true;

    const run = async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(`${API_BASE}/api/tours`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load tours");
        }

        if (!alive) return;
        setFetchedItems(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load tours");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [hasExternal]);

  // 🔥 choose correct source
  const source = hasExternal ? items : fetchedItems;

  const cards = useMemo(() => {
    return (source || []).map((t) => {
      const id = t?._id || t?.id;

      const rawThumb = t?.images?.[0] || t?.coverUrl || "";
      const cover = cldThumb(rawThumb, 520, 360);

      const excerpt = stripHtml(t?.descriptionHtml).slice(0, 170);
      const cats = Array.isArray(t?.categories) ? t.categories : [];
      const regs = Array.isArray(t?.regions) ? t.regions : [];

      return { id, cover, title: t?.title, excerpt, cats, regs };
    });
  }, [source]);

  return (
    <div className="tours_list">
      <div className="toursWrap">
        {/* ✅ show title only if provided */}
        {title ? (
          <div className="toursHeader">
            <h1 className="toursTitle">{title}</h1>
          </div>
        ) : (
          <div className="toursHeader">
            <h1 className="toursTitle">Tours</h1>
          </div>
        )}

        {loading && <div className="toursInfo">Loading...</div>}

        {err && <div className="toursError">{err}</div>}

        {!loading && !err && cards.length > 0 && (
          <div className="toursGrid">
            {cards.map((t) => (
              <Link key={t.id} className="tourCard" to={`/tour/${t.id}`}>
                <div className="tourImgWrap">
                  {t.cover ? (
                    <img
                      className="tourImg"
                      src={t.cover}
                      alt={t.title || "tour"}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="tourImgPlaceholder">No image</div>
                  )}
                </div>

                <div className="tourBody">
                  <div className="tourName">{t.title}</div>

                  <div className="tourMeta tourChips">
                    {t.regs?.slice(0, 2).map((r) => (
                      <span key={r} className="chip">
                        {r}
                      </span>
                    ))}

                    {t.cats?.slice(0, 2).map((c) => (
                      <span key={c} className="chip chip2">
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="tourExcerpt">{t.excerpt || " "}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursList;
