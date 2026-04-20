import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import "./GeorgiaRegionsMap.css";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/bumbeishvili/geojson-georgian-regions/master/geo_regions.geojson";

const REGION_LABELS = [
  { value: "tbilisi", label: "Tbilisi" },
  { value: "adjara", label: "Adjara" },
  { value: "guria", label: "Guria" },
  { value: "imereti", label: "Imereti" },
  { value: "kakheti", label: "Kakheti" },
  { value: "kvemo-kartli", label: "Kvemo Kartli" },
  { value: "mtskheta-mtianeti", label: "Mtskheta-Mtianeti" },
  { value: "samtskhe-javakheti", label: "Samtskhe-Javakheti" },
  { value: "shida-kartli", label: "Shida Kartli" },
  { value: "racha", label: "Racha" },
  { value: "lechkhumi", label: "Lechkhumi" },
  { value: "kvemo-svaneti", label: "Kvemo Svaneti" },
  { value: "samegrelo", label: "Samegrelo" },
  { value: "zemo-svaneti", label: "Zemo Svaneti" },

  // NOTE: geo_regions.geojson typically includes Abkhazia,
  // but South Ossetia is often not present as a separate polygon.
  { value: "abkhazia", label: "Abkhazia" },
  { value: "south-ossetia", label: "South Ossetia" },
];

const OCCUPIED = new Set(["abkhazia", "south-ossetia"]);

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-");

const pickName = (props) => {
  if (!props) return "";
  return (
    props.__displayName ||
    props.name ||
    props.NAME_1 ||
    props.NAME ||
    props.region ||
    props.Region ||
    props.subregion ||
    props.SUBREGION ||
    props.admin1Name ||
    props.name_en ||
    props.NAME_EN ||
    props.shapeName ||
    ""
  );
};

// Match dataset strings to our labels (you can add more if your geojson differs)
const NAME_ALIASES = {
  "samegrelo-zemo svaneti": "Samegrelo",
  "racha-lechkhumi-kvemo svaneti": "Racha",
  "south ossetia": "South Ossetia",
  "south-ossetia": "South Ossetia",
  "tbilisi (capital)": "Tbilisi",
};

const GeorgiaRegionsMap = ({ value = [], onChange }) => {
  const [geo, setGeo] = useState(null);

  // tooltip state
  const [tip, setTip] = useState({
    show: false,
    x: 0,
    y: 0,
    title: "",
    body: "",
    occupied: false,
  });

  const selectedSet = useMemo(() => new Set(value), [value]);

  const labelToValue = useMemo(() => {
    const m = new Map();
    REGION_LABELS.forEach((r) => m.set(norm(r.label), r.value));
    return m;
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(GEOJSON_URL, { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        setGeo(data);
      } catch {
        if (!alive) return;
        setGeo(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const toggle = (val) => {
    const next = new Set(value);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    onChange?.([...next]);
  };

  const showTip = (e, title, occupied) => {
    const x = e.clientX + 14;
    const y = e.clientY + 14;

    setTip({
      show: true,
      x,
      y,
      title,
      occupied,
      body: occupied ? "Occupied by Russia" : "",
    });
  };

  const moveTip = (e) => {
    if (!tip.show) return;
    setTip((p) => ({ ...p, x: e.clientX + 14, y: e.clientY + 14 }));
  };

  const hideTip = () => {
    setTip((p) => ({ ...p, show: false }));
  };

  return (
    <div className="grmWrapper">
      {/* Tooltip */}
      {tip.show ? (
        <div
          className={`grmTooltip ${tip.occupied ? "grmTooltipOccupied" : ""}`}
          style={{ left: tip.x, top: tip.y }}
        >
          <div className="grmTooltipTitle">{tip.title}</div>
          {tip.body ? <div className="grmTooltipBody">{tip.body}</div> : null}
        </div>
      ) : null}

      <div className="grmMap">
        {/* ✅ centered + 1.5x bigger than previous (was ~50%; now 75%) */}
        <div className="grmSvgWrap">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 5200, center: [44.7, 42.1] }}
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              {/* ✅ barbed-wire-ish pattern ONLY for tooltip background */}
              <pattern
                id="tipBarbedPattern"
                patternUnits="userSpaceOnUse"
                width="18"
                height="18"
                patternTransform="rotate(25)"
              >
                <line
                  x1="0"
                  y1="9"
                  x2="18"
                  y2="9"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="2"
                />
                <line
                  x1="4"
                  y1="6"
                  x2="7"
                  y2="12"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1.2"
                />
                <line
                  x1="7"
                  y1="6"
                  x2="4"
                  y2="12"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1.2"
                />
                <line
                  x1="12"
                  y1="6"
                  x2="15"
                  y2="12"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1.2"
                />
                <line
                  x1="15"
                  y1="6"
                  x2="12"
                  y2="12"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>

            <Geographies
              geography={geo || { type: "FeatureCollection", features: [] }}
            >
              {({ geographies }) => (
                <>
                  {geographies.map((g) => {
                    const raw = pickName(g.properties);
                    const aliased = NAME_ALIASES[norm(raw)] || raw;

                    // map geojson name -> our region value
                    const v = labelToValue.get(norm(aliased));
                    const isSelectable = Boolean(v);
                    const isSelected = v ? selectedSet.has(v) : false;
                    const isOccupied = v ? OCCUPIED.has(v) : false;

                    return (
                      <Geography
                        key={g.rsmKey}
                        geography={g}
                        onClick={() => (isSelectable ? toggle(v) : null)}
                        onMouseEnter={(e) =>
                          showTip(e, aliased || raw || "", isOccupied)
                        }
                        onMouseMove={moveTip}
                        onMouseLeave={hideTip}
                        className={[
                          "grmRegion",
                          isSelected ? "grmRegionActive" : "",
                          isSelectable ? "grmRegionClickable" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })}
                </>
              )}
            </Geographies>
          </ComposableMap>

          {/* ✅ If South Ossetia isn’t in the GeoJSON, show a hint (so you know why you can't see it) */}
          <div className="grmBottomHint">
            If you don’t see “South Ossetia”, it’s because this GeoJSON doesn’t
            include it as a separate polygon. Switch to a dataset that has it.
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeorgiaRegionsMap;
