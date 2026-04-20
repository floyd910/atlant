import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./ToursPage.css";
import Header from "../../components/header/Header";
import ToursList from "../../components/toursList/ToursList.";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://pingeorgia-back.vercel.app";

const normalizeCategory = (raw) => {
  if (!raw) return "";
  return String(raw).trim().toLowerCase().replace(/_/g, "-");
};

const prettyLabel = (slug) => {
  if (!slug) return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const ToursPage = () => {
  const { category: categoryParam } = useParams();

  const category = useMemo(
    () => normalizeCategory(categoryParam),
    [categoryParam],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tours, setTours] = useState([]);

  const pickToursArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.tours)) return data.tours;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    return [];
  };

  const filterByCategory = (arr, cat) => {
    if (!cat || cat === "all") return arr;
    return (arr || []).filter((t) => {
      const cats = Array.isArray(t.categories) ? t.categories : [];
      return cats.map((x) => normalizeCategory(x)).includes(cat);
    });
  };

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError("");
      setTours([]);

      try {
        // ✅ Try server-side filter first
        const url = `${API_BASE}/api/tours?category=${encodeURIComponent(
          category,
        )}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("no-filter");

        const data = await res.json().catch(() => null);
        const arr = pickToursArray(data);

        if (!alive) return;
        setTours(filterByCategory(arr, category));
        setLoading(false);
      } catch (e) {
        try {
          // ✅ Fallback: fetch all + filter client-side
          const resAll = await fetch(`${API_BASE}/api/tours`);
          if (!resAll.ok)
            throw new Error(`Failed to load tours (HTTP ${resAll.status})`);

          const dataAll = await resAll.json().catch(() => null);
          const arrAll = pickToursArray(dataAll);

          if (!alive) return;
          setTours(filterByCategory(arrAll, category));
          setLoading(false);
        } catch (err2) {
          if (!alive) return;
          setError(err2?.message || "Failed to load tours");
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [category]);

  const pageTitle = useMemo(() => {
    if (!category) return "Tours";
    if (category === "all") return "All tours";
    return prettyLabel(category);
  }, [category]);

  return (
    <>
      <Header />
      <div className="toursPage">
        <div className="toursPage__wrap">
          <ToursList items={tours} title={pageTitle} />
        </div>
      </div>
    </>
  );
};

export default ToursPage;
