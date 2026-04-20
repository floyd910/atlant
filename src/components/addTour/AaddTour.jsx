import React, { useMemo, useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import Select from "react-select";
// import { DayPicker } from "react-day-picker";

import "react-quill/dist/quill.snow.css";
// import "react-day-picker/dist/style.css";
import "./AddTour.css";

/**
 * Cloudinary direct upload (no backend):
 * Put them in .env as:
 * VITE_CLOUDINARY_CLOUD_NAME=xxxx
 * VITE_CLOUDINARY_UPLOAD_PRESET=xxxx
 *
 * NOTE: This assumes UNSIGNED uploads using an upload preset.
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dvngcbhqt";
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "pingeorgia_tours";
const CLOUDINARY_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "tours";

// ✅ API base (your Express)
const API_BASE =
  import.meta.env.VITE_API_BASE || "https://pingeorgia-back.vercel.app";

const AddTour = () => {
  const [title, setTitle] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");

  // ✅ local selected files (NOT uploaded yet)
  // items: { id, file, previewUrl, name, size, type }
  const [localImages, setLocalImages] = useState([]);
  const [coverId, setCoverId] = useState(null);

  const [saving, setSaving] = useState(false);

  // categories multi-select
  const [categories, setCategories] = useState([]);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  // ✅ regions multi-select (Georgian main regions)
  const [regions, setRegions] = useState([]);

  // messages / errors
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ show backend response details when backend crashes (so you can debug 500)
  const [debug, setDebug] = useState(null);

  // Keep stable id generator
  const idRef = useRef(0);
  const nextId = () => {
    idRef.current += 1;
    return `img_${Date.now()}_${idRef.current}`;
  };

  // ✅ Updated categories you provided
  const categoryOptions = useMemo(
    () => [
      { value: "day-trips", label: "Day trips" },
      { value: "multi-day-trips", label: "Multi-day trips" },
      { value: "hiking-tours", label: "Hiking tours" },
      { value: "adventure-tours", label: "Adventure tours" },
      { value: "sightseeing-tours", label: "Sightseeing tours" },
      { value: "corporate-tours", label: "Corporate tours" },
      { value: "find-on-map", label: "Find on map" },
      { value: "winter", label: "winter" },
    ],
    [],
  );

  // ✅ Georgian main regions (mkhare) + autonomous republics + Tbilisi
  // ✅ separated: Racha-Lechkhumi and Kvemo Svaneti -> (Racha-Lechkhumi) + (Kvemo Svaneti)
  const regionOptions = useMemo(
    () => [
      { value: "tbilisi", label: "Tbilisi" },

      { value: "adjara", label: "Adjara" },
      { value: "abkhazia", label: "Abkhazia" },

      { value: "guria", label: "Guria" },
      { value: "imereti", label: "Imereti" },
      { value: "kakheti", label: "Kakheti" },
      { value: "kvemo-kartli", label: "Kvemo Kartli" },
      { value: "mtskheta-mtianeti", label: "Mtskheta-Mtianeti" },

      // ✅ separated here
      { value: "racha-lechkhumi", label: "Racha-Lechkhumi" },
      { value: "kvemo-svaneti", label: "Kvemo Svaneti" },

      { value: "samegrelo", label: "Samegrelo" },
      { value: "zemo-svaneti", label: "Zemo Svaneti" },

      { value: "samtskhe-javakheti", label: "Samtskhe-Javakheti" },
      { value: "shida-kartli", label: "Shida Kartli" },
    ],
    [],
  );

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    [],
  );

  const validate = () => {
    const next = {};

    if (!title.trim()) next.title = "Title is required";
    if (
      !descriptionHtml ||
      descriptionHtml.replace(/<[^>]*>/g, "").trim().length < 10
    ) {
      next.description = "Description is too short";
    }

    if (!categories || categories.length === 0)
      next.categories = "Select at least one category";

    // ✅ regions required
    if (!regions || regions.length === 0)
      next.regions = "Select at least one region";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const ensureCoverFirst = (arr, cid) => {
    if (!arr?.length) return arr || [];
    if (!cid) return arr;

    const idx = arr.findIndex((x) => x.id === cid);
    if (idx <= 0) return arr;

    const cover = arr[idx];
    const rest = arr.filter((x) => x.id !== cid);
    return [cover, ...rest];
  };

  const setAsCover = (id) => {
    setCoverId(id);
    setLocalImages((prev) => ensureCoverFirst(prev, id));
  };

  const onPickImages = (e) => {
    setMsg("");
    setDebug(null);

    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Build local previews
    const added = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const id = nextId();
      const previewUrl = URL.createObjectURL(file);

      added.push({
        id,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    if (!added.length) {
      e.target.value = "";
      return;
    }

    setLocalImages((prev) => {
      const next = [...prev, ...added];

      // If no cover yet, pick first added as cover
      if (!coverId) {
        const first = added[0];
        if (first?.id) {
          setCoverId(first.id);
          return ensureCoverFirst(next, first.id);
        }
      }

      // Keep cover first
      return ensureCoverFirst(next, coverId);
    });

    // allow re-select same file
    e.target.value = "";
  };

  const removeImage = (id) => {
    setLocalImages((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);

      const next = prev.filter((x) => x.id !== id);

      // if removed cover, new cover = first
      if (coverId === id) {
        const nextCover = next[0]?.id || null;
        setCoverId(nextCover);
        return ensureCoverFirst(next, nextCover);
      }

      return ensureCoverFirst(next, coverId);
    });
  };

  const clearAllImages = () => {
    setLocalImages((prev) => {
      prev.forEach((x) => x.previewUrl && URL.revokeObjectURL(x.previewUrl));
      return [];
    });
    setCoverId(null);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      localImages.forEach(
        (x) => x.previewUrl && URL.revokeObjectURL(x.previewUrl),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCustomCategory = () => {
    const raw = customCategoryInput.trim();
    if (!raw) return;

    const value = raw.toLowerCase().replace(/\s+/g, "-");
    const obj = { value, label: raw };

    setCategories((prev) => {
      if (prev.some((c) => c.value === value)) return prev;
      return [...prev, obj];
    });

    setCustomCategoryInput("");
  };

  const uploadToCloudinary = async (file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary credentials missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET",
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    if (CLOUDINARY_FOLDER) form.append("folder", CLOUDINARY_FOLDER);

    const res = await fetch(url, { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message =
        data?.error?.message || data?.message || "Cloudinary upload failed";
      throw new Error(message);
    }

    return {
      url: data.secure_url,
      public_id: data.public_id,
      original_filename: data.original_filename,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  };

  // ✅ read server response even when it's not JSON (some crashes return HTML)
  const safeReadResponse = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await res.json().catch(() => ({}));
      return { kind: "json", data: json };
    }
    const text = await res.text().catch(() => "");
    return { kind: "text", data: text };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setDebug(null);

    if (!validate()) {
      setMsg("Fix errors ❌");
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setMsg("Cloudinary env missing ❌");
      return;
    }

    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      setMsg("Not logged in ❌");
      return;
    }

    setSaving(true);

    try {
      // ✅ make sure cover is first BEFORE upload (so uploaded[0] is cover)
      const orderedLocal = ensureCoverFirst(localImages, coverId);

      // ✅ upload only now
      const uploaded = [];
      for (const item of orderedLocal) {
        const one = await uploadToCloudinary(item.file);
        uploaded.push(one);
      }

      // ✅ backend wants ONLY urls
      const payload = {
        title: title.trim(),
        descriptionHtml,
        categories: categories.map((c) => c.value),
        regions: regions.map((r) => r.value),
        images: uploaded.map((img) => img.url),
      };

      // ✅ log what we are sending (helps debug)
      console.log("POST payload:", payload);
      console.log("API_BASE:", API_BASE);

      const res = await fetch(`${API_BASE}/api/tours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      const parsed = await safeReadResponse(res);

      // ✅ store debug details even on success (helps confirm backend reply)
      setDebug({
        url: `${API_BASE}/api/tours`,
        status: res.status,
        ok: res.ok,
        kind: parsed.kind,
        response: parsed.data,
      });

      if (!res.ok) {
        // try to extract best message
        const serverMsg =
          parsed.kind === "json"
            ? parsed.data?.message || parsed.data?.error
            : String(parsed.data || "").slice(0, 300);

        throw new Error(serverMsg || `Save failed (HTTP ${res.status})`);
      }

      setMsg("Saved ✅");
      // optional: clear form after save
      // setTitle("");
      // setDescriptionHtml("");
      // setCategories([]);
      // setRegions([]);
      // clearAllImages();
    } catch (err) {
      setMsg(err?.message || "Save failed");

      // ✅ also show fetch-level errors in debug
      setDebug((prev) => ({
        ...(prev || {}),
        clientError: err?.message || String(err),
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="aaddTourPage">
      <div className="aaddTourCard">
        <div className="aaddTourHeader">
          <h1 className="aaddTourTitle">Add Tour</h1>
        </div>

        <form className="aaddTourForm" onSubmit={onSubmit}>
          {/* Title */}
          <div className="field">
            <label className="label">Title</label>
            <input
              className={`input ${errors.title ? "inputError" : ""}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Old Tbilisi Walking Tour"
            />
            {errors.title ? <div className="error">{errors.title}</div> : null}
          </div>

          {/* Description */}
          <div className="field">
            <label className="label">Description</label>
            <div
              className={`editorWrap ${errors.description ? "editorError" : ""}`}
            >
              <ReactQuill
                theme="snow"
                value={descriptionHtml}
                onChange={setDescriptionHtml}
                modules={quillModules}
                placeholder="Write tour description..."
              />
            </div>
            {errors.description ? (
              <div className="error">{errors.description}</div>
            ) : null}
          </div>

          {/* Images */}
          <div className="field">
            <label className="label">Images</label>

            <div className="uploadRow">
              <input
                className="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={onPickImages}
                disabled={saving}
              />
              <div className="uploadNote">
                {saving ? "Saving..." : "Choose images (multiple allowed)"}
              </div>
              {localImages.length ? (
                <button
                  type="button"
                  className="btnGhost"
                  onClick={clearAllImages}
                  disabled={saving}
                >
                  Clear
                </button>
              ) : null}
            </div>

            {!CLOUD_NAME || !UPLOAD_PRESET ? (
              <div className="warn">
                Cloudinary env missing. Set:
                <br />
                <span className="mono">
                  VITE_CLOUDINARY_CLOUD_NAME
                </span> and{" "}
                <span className="mono">VITE_CLOUDINARY_UPLOAD_PRESET</span>
              </div>
            ) : null}

            {localImages.length ? (
              <div className="imageGrid">
                {localImages.map((img) => {
                  const isCover = img.id === coverId;
                  return (
                    <div className="imageItem" key={img.id}>
                      <div
                        className={`coverBadge ${isCover ? "coverBadgeOn" : ""}`}
                      >
                        {isCover ? "COVER" : " "}
                      </div>

                      <img
                        className={`thumb ${isCover ? "thumbCover" : ""}`}
                        src={img.previewUrl}
                        alt={img.name || "tour"}
                      />

                      <div className="imageBtns">
                        <button
                          type="button"
                          className={`coverBtn ${isCover ? "coverBtnOn" : ""}`}
                          onClick={() => setAsCover(img.id)}
                          disabled={saving}
                        >
                          {isCover ? "Cover ✅" : "Set as cover"}
                        </button>

                        <button
                          type="button"
                          className="removeBtn"
                          onClick={() => removeImage(img.id)}
                          disabled={saving}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="hint">No images selected yet (optional).</div>
            )}
          </div>

          {/* Categories */}
          <div className="field">
            <label className="label">
              Categories (you can choose multiple)
            </label>

            <div className={`${errors.categories ? "selectError" : ""}`}>
              <Select
                isMulti
                value={categories}
                onChange={(v) => setCategories(v || [])}
                options={categoryOptions}
                placeholder="Select categories..."
                classNamePrefix="reactSelect"
              />
            </div>

            <div className="customCategoryRow">
              <input
                className="input"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Add custom category (optional)"
                disabled={saving}
              />
              <button
                type="button"
                className="btnGhost"
                onClick={addCustomCategory}
                disabled={saving}
              >
                Add
              </button>
            </div>

            {errors.categories ? (
              <div className="error">{errors.categories}</div>
            ) : null}
          </div>

          {/* ✅ Regions */}
          <div className="field">
            <label className="label">Regions (Georgia) (multi-select)</label>

            <div className={`${errors.regions ? "selectError" : ""}`}>
              <Select
                isMulti
                value={regions}
                onChange={(v) => setRegions(v || [])}
                options={regionOptions}
                placeholder="Select regions..."
                classNamePrefix="reactSelect"
              />
            </div>

            {errors.regions ? (
              <div className="error">{errors.regions}</div>
            ) : null}
          </div>

          {/* Submit */}
          <div className="actions">
            <button className="btn" disabled={saving}>
              {saving ? "Saving..." : "Save Tour"}
            </button>
          </div>

          {msg ? <div className="msg">{msg}</div> : null}

          {/* ✅ DEBUG BOX (temporary): shows backend response when 500 happens */}
          {debug ? (
            <div
              className="msg"
              style={{
                marginTop: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <strong>Debug:</strong>
              {"\n"}
              {JSON.stringify(debug, null, 2)}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default AddTour;
