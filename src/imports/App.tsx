import { useState, useEffect } from "react";

// ── Types & Data ────────────────────────────────────────────────────────────
type Piece = { label: string; color: string };
type Outfit = { top: Piece; bottom: Piece; shoes: Piece; extra: Piece };

const OCCASIONS = [
  "Brunch", "Date Night", "Casual", "Office",
  "Party", "Airport", "Gym", "Museum",
  "Picnic", "Rooftop", "Fancy Dinner", "Cozy Day",
] as const;

type Occasion = (typeof OCCASIONS)[number];

const OUTFITS: Record<Occasion, Outfit[]> = {
  "Brunch":       [{ top: { label: "Witte linnen blouse",   color: "#E8DFD0" }, bottom: { label: "Crème wide-leg broek", color: "#DDD5C5" }, shoes: { label: "Beige mules",        color: "#C8B898" }, extra: { label: "Gouden oorbellen",  color: "#D4AF6A" } },
                   { top: { label: "Lichtroze cardigan",     color: "#EDD4CC" }, bottom: { label: "Witte satijnen rok",  color: "#F0ECEA" }, shoes: { label: "Witte sneakers",     color: "#ECEAE6" }, extra: { label: "Geweven tas",        color: "#C8BA9E" } }],
  "Date Night":   [{ top: { label: "Lila satijnen top",     color: "#C4B0D8" }, bottom: { label: "Zwarte wijde broek",  color: "#484050" }, shoes: { label: "Zwarte kitten heels",color: "#3A3440" }, extra: { label: "Parelketting",       color: "#EDE8E0" } },
                   { top: { label: "Gedrapeerd jurkje",      color: "#E8C0C8" }, bottom: { label: "—",                  color: "#E8C0C8" }, shoes: { label: "Nude pumps",         color: "#D4B8A0" }, extra: { label: "Gouden clutch",      color: "#D4AF6A" } }],
  "Casual":       [{ top: { label: "Ribgebreide cardigan",   color: "#DFC8B8" }, bottom: { label: "Light wash jeans",   color: "#B0C0D4" }, shoes: { label: "Witte sneakers",     color: "#ECEAE6" }, extra: { label: "Canvas tas",         color: "#D8D0C0" } },
                   { top: { label: "Oversized wit t-shirt",  color: "#F0EEE8" }, bottom: { label: "Baggy jeans",        color: "#8898B0" }, shoes: { label: "Chunky loafers",     color: "#7A6858" }, extra: { label: "Baseball cap",       color: "#C8C0B0" } }],
  "Office":       [{ top: { label: "Gestreepte blouse",      color: "#D0D8E8" }, bottom: { label: "Khaki wijde broek",  color: "#B0B090" }, shoes: { label: "Cognac loafers",     color: "#9B6B45" }, extra: { label: "Schildpadril",       color: "#7A5E45" } },
                   { top: { label: "Crème coltrui",          color: "#E8E0D0" }, bottom: { label: "Donkerblauwe rok",   color: "#6878A0" }, shoes: { label: "Zwarte pumps",       color: "#3A3440" }, extra: { label: "Leren handtas",      color: "#8A6850" } }],
  "Party":        [{ top: { label: "Paillettetop",           color: "#C8C0D8" }, bottom: { label: "Mini satijnen rok",  color: "#E0B8C8" }, shoes: { label: "Strappy heels",      color: "#D4AF6A" }, extra: { label: "Clutch",             color: "#9B8EC4" } },
                   { top: { label: "Cut-out jurk",           color: "#D8C0D4" }, bottom: { label: "—",                  color: "#D8C0D4" }, shoes: { label: "Platform sandalen",  color: "#C8B898" }, extra: { label: "Statement oorbellen",color: "#C4B0D8" } }],
  "Airport":      [{ top: { label: "Oversized hoodie",       color: "#D4D0C8" }, bottom: { label: "Jogger pants",       color: "#B8B4AC" }, shoes: { label: "Chunky sneakers",    color: "#E0DCCC" }, extra: { label: "Baseball cap",       color: "#8A8A8A" } },
                   { top: { label: "Trenchcoat",             color: "#C8B898" }, bottom: { label: "Zwarte legging",     color: "#484050" }, shoes: { label: "Platform sneakers",  color: "#E0DCCC" }, extra: { label: "Mini rugzak",        color: "#9B8EC4" } }],
  "Gym":          [{ top: { label: "Sports bra",             color: "#9B8EC4" }, bottom: { label: "Bike shorts",        color: "#7878A0" }, shoes: { label: "Hardloopschoenen",   color: "#E0DCCC" }, extra: { label: "Haarband",           color: "#C8D0B8" } },
                   { top: { label: "Tank top",               color: "#C4D8C8" }, bottom: { label: "Flare legging",      color: "#9088C0" }, shoes: { label: "Witte sneakers",     color: "#ECEAE6" }, extra: { label: "Waterfles",          color: "#A8C8D8" } }],
  "Museum":       [{ top: { label: "Coltrui top",            color: "#C8C0D8" }, bottom: { label: "Midi slip skirt",    color: "#E0B8C8" }, shoes: { label: "Mary Jane flats",    color: "#3A3440" }, extra: { label: "Boektas",            color: "#D4C8A8" } },
                   { top: { label: "Geblokte blazer",        color: "#B0B4C8" }, bottom: { label: "Rechte jeans",       color: "#8898B0" }, shoes: { label: "Loafers",            color: "#7A6858" }, extra: { label: "Baret",              color: "#9890B0" } }],
  "Picnic":       [{ top: { label: "Gebloemde cami",         color: "#E8C8D0" }, bottom: { label: "Linnen shorts",      color: "#E0D4B8" }, shoes: { label: "Espadrilles",        color: "#C8A870" }, extra: { label: "Strohoed",           color: "#D4B878" } },
                   { top: { label: "Boho bloesje",           color: "#D8E4CC" }, bottom: { label: "Wrap rok",           color: "#C8D0B8" }, shoes: { label: "Sandalen",           color: "#C0A878" }, extra: { label: "Rieten tas",         color: "#C8A870" } }],
  "Rooftop":      [{ top: { label: "Corset top",             color: "#C4B0C8" }, bottom: { label: "Uitlopende broek",   color: "#8878A0" }, shoes: { label: "Sleehakken",         color: "#9B6B45" }, extra: { label: "Crossbody tas",      color: "#D4A5A5" } },
                   { top: { label: "Pailletterokje + top",   color: "#D0C8E0" }, bottom: { label: "—",                  color: "#D0C8E0" }, shoes: { label: "Mules",              color: "#C8B898" }, extra: { label: "Gouden ketting",     color: "#D4AF6A" } }],
  "Fancy Dinner": [{ top: { label: "Zijden wrap blouse",     color: "#E8C8C0" }, bottom: { label: "Satijnen broek",     color: "#C0B8D8" }, shoes: { label: "Stiletto's",         color: "#3A3440" }, extra: { label: "Pareltas",           color: "#D4AF6A" } },
                   { top: { label: "Halterneck jurk",        color: "#C8D0D8" }, bottom: { label: "—",                  color: "#C8D0D8" }, shoes: { label: "Kitten heels",       color: "#9B6B45" }, extra: { label: "Statement ring",     color: "#D4AF6A" } }],
  "Cozy Day":     [{ top: { label: "Dikke kabeltrui",        color: "#E8D4C0" }, bottom: { label: "Geruit flanel",      color: "#C8B0A0" }, shoes: { label: "Fluffy slippers",    color: "#E8D4C0" }, extra: { label: "Gebreide beanie",    color: "#C4B0A0" } },
                   { top: { label: "Zachte fleece vest",     color: "#D4C8E0" }, bottom: { label: "Joggingbroek",       color: "#B8B4C8" }, shoes: { label: "UGG laarzen",        color: "#C8B090" }, extra: { label: "Deken sjaal",        color: "#D8C8B8" } }],
};

// ── Aura blob background ────────────────────────────────────────────────────
function AuraBlob({ colors, opacity = 0.45 }: { colors: string[]; opacity?: number }) {
  const positions = [
    { top: "10%", left: "20%", w: 280, h: 280 },
    { top: "35%", left: "55%", w: 220, h: 220 },
    { top: "60%", left: "15%", w: 200, h: 200 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {colors.slice(0, 3).map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            background: c,
            width: positions[i].w,
            height: positions[i].h,
            top: positions[i].top,
            left: positions[i].left,
            transform: "translate(-50%, -50%)",
            filter: "blur(72px)",
            opacity,
          }}
        />
      ))}
    </div>
  );
}

// ── Mannequin SVG that wears outfit colors ──────────────────────────────────
function Mannequin({ outfit, glowColors }: { outfit: Outfit; glowColors: string[] }) {
  const topC   = outfit.top.color;
  const botC   = outfit.bottom.color === "—" ? outfit.top.color : outfit.bottom.color;
  const shoeC  = outfit.shoes.color;
  const isDress = outfit.bottom.label === "—";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 340 }}>
      {/* Aura glow behind figure */}
      {glowColors.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            background: c,
            width: 160 + i * 40,
            height: 160 + i * 40,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            filter: "blur(48px)",
            opacity: 0.35 - i * 0.08,
          }}
        />
      ))}

      <svg width="160" height="320" viewBox="0 0 160 320" fill="none" className="relative z-10 drop-shadow-sm">
        {/* Head */}
        <ellipse cx="80" cy="32" rx="22" ry="24" fill="#F0E8DC" stroke="#D8CCC0" strokeWidth="1"/>
        {/* Hair suggestion */}
        <ellipse cx="80" cy="18" rx="22" ry="12" fill="#C8B8A8" opacity="0.6"/>
        {/* Face */}
        <circle cx="73" cy="32" r="2.5" fill="#9A8878" opacity="0.6"/>
        <circle cx="87" cy="32" r="2.5" fill="#9A8878" opacity="0.6"/>
        <path d="M74 40 Q80 44 86 40" stroke="#C8A898" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

        {/* Neck */}
        <rect x="74" y="54" width="12" height="10" rx="2" fill="#F0E8DC"/>

        {/* Top / torso */}
        {isDress ? (
          /* Dress — flows from shoulder to below knee */
          <>
            <path d="M44 68 L30 90 L26 200 Q26 210 36 210 L124 210 Q134 210 134 200 L130 90 L116 68 Q100 62 80 62 Q60 62 44 68Z" fill={topC} stroke="#fff" strokeWidth="0.5" opacity="0.95"/>
            {/* Dress flare */}
            <path d="M36 170 Q26 230 28 250 L132 250 Q134 230 124 170Z" fill={topC} opacity="0.75"/>
          </>
        ) : (
          <>
            {/* Top garment */}
            <path d="M46 68 L32 92 L30 148 Q30 156 38 156 L122 156 Q130 156 130 148 L128 92 L114 68 Q100 62 80 62 Q60 62 46 68Z" fill={topC} stroke="#fff" strokeWidth="0.5" opacity="0.95"/>
            {/* Bottom garment */}
            <path d="M34 154 L28 252 Q28 260 38 260 L74 260 L74 180 L86 180 L86 260 L122 260 Q132 260 132 252 L126 154Z" fill={botC} stroke="#fff" strokeWidth="0.5" opacity="0.95"/>
          </>
        )}

        {/* Arms */}
        <path d="M44 72 Q22 110 20 150 Q18 162 28 164 Q36 166 40 154 L48 116Z" fill={topC} stroke="#fff" strokeWidth="0.5" opacity="0.9"/>
        <path d="M116 72 Q138 110 140 150 Q142 162 132 164 Q124 166 120 154 L112 116Z" fill={topC} stroke="#fff" strokeWidth="0.5" opacity="0.9"/>

        {/* Hands */}
        <ellipse cx="24" cy="167" rx="8" ry="10" fill="#F0E8DC" stroke="#D8CCC0" strokeWidth="0.5"/>
        <ellipse cx="136" cy="167" rx="8" ry="10" fill="#F0E8DC" stroke="#D8CCC0" strokeWidth="0.5"/>

        {/* Legs (only if not dress) */}
        {!isDress && (
          <>
            <rect x="34" y="256" width="36" height="36" rx="4" fill={botC} opacity="0.7"/>
            <rect x="90" y="256" width="36" height="36" rx="4" fill={botC} opacity="0.7"/>
          </>
        )}
        {isDress && (
          <>
            <rect x="42" y="244" width="30" height="40" rx="3" fill={topC} opacity="0.5"/>
            <rect x="88" y="244" width="30" height="40" rx="3" fill={topC} opacity="0.5"/>
          </>
        )}

        {/* Shoes */}
        <path d="M28 290 Q28 300 50 302 L56 302 Q60 302 60 296 L58 288Z" fill={shoeC} stroke="#C0B8A8" strokeWidth="0.5"/>
        <path d="M102 288 L100 296 Q100 302 104 302 L110 302 Q132 300 132 290Z" fill={shoeC} stroke="#C0B8A8" strokeWidth="0.5"/>
      </svg>
    </div>
  );
}

// ── Occasion pill ───────────────────────────────────────────────────────────
function OccasionPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
      style={{
        background: active ? "#9B8EC4" : "rgba(255,255,255,0.7)",
        color: active ? "#fff" : "#6B6560",
        border: active ? "none" : "1px solid #E2DED9",
        boxShadow: active ? "0 4px 16px rgba(155,142,196,0.35)" : "none",
        backdropFilter: "blur(8px)",
      }}
    >
      {label}
    </button>
  );
}

// ── Piece row with swipe ────────────────────────────────────────────────────
function PieceRow({
  slotLabel, piece, onPrev, onNext, dotCount, dotActive,
}: {
  slotLabel: string; piece: Piece;
  onPrev: () => void; onNext: () => void;
  dotCount: number; dotActive: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-right flex-shrink-0 font-medium" style={{ fontSize: 11, color: "#9A9590", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {slotLabel}
      </span>
      <button onClick={onPrev} className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid #E2DED9" }}>
        <span style={{ color: "#6B6560", fontSize: 14, lineHeight: 1 }}>‹</span>
      </button>
      <div className="flex-1 flex items-center gap-2 px-3 rounded-xl" style={{ height: 48, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #F0ECE8" }}>
        <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: piece.color, border: "1px solid rgba(0,0,0,0.06)" }}/>
        <span style={{ fontSize: 13, color: "#2C2A28", fontWeight: 500, lineHeight: 1.2 }}>{piece.label}</span>
      </div>
      <button onClick={onNext} className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-all active:scale-90" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid #E2DED9" }}>
        <span style={{ color: "#6B6560", fontSize: 14, lineHeight: 1 }}>›</span>
      </button>
      <div className="flex gap-1 w-8 justify-center">
        {Array.from({ length: dotCount }).map((_, i) => (
          <div key={i} className="rounded-full transition-all" style={{ width: i === dotActive ? 12 : 5, height: 5, background: i === dotActive ? "#9B8EC4" : "#D4D0C8" }}/>
        ))}
      </div>
    </div>
  );
}

// ── Main outfit home screen ─────────────────────────────────────────────────
function OutfitHome() {
  const [occasion, setOccasion] = useState<Occasion>("Brunch");
  const [outfitIdx, setOutfitIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [animating, setAnimating] = useState(false);

  const outfitList = OUTFITS[occasion];
  const outfit = outfitList[outfitIdx];

  // Derive aura colors from outfit pieces
  const glowColors = [outfit.top.color, outfit.bottom.color === "—" ? outfit.top.color : outfit.bottom.color, outfit.shoes.color];

  function changeOccasion(occ: Occasion) {
    setAnimating(true);
    setTimeout(() => {
      setOccasion(occ);
      setOutfitIdx(0);
      setSaved(false);
      setAnimating(false);
    }, 220);
  }

  function cycleOutfit(dir: 1 | -1) {
    setAnimating(true);
    setTimeout(() => {
      setOutfitIdx((i) => (i + dir + outfitList.length) % outfitList.length);
      setAnimating(false);
    }, 180);
  }

  const slots = [
    { label: "Top",   piece: outfit.top },
    { label: "Bottom", piece: outfit.bottom.label === "—" ? outfit.top : outfit.bottom },
    { label: "Shoes", piece: outfit.shoes },
    { label: "Extra", piece: outfit.extra },
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: "#F7F5F2" }}>
      <AuraBlob colors={glowColors} opacity={0.42} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-2 z-10 flex-shrink-0">
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 400, fontStyle: "italic", letterSpacing: "0.04em" }}>
          My Digital Closet
        </h1>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #E2DED9", backdropFilter: "blur(8px)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6560" strokeWidth="1.8" strokeLinecap="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>

      {/* Occasion for */}
      <div className="px-6 pb-1 z-10 flex-shrink-0">
        <p style={{ fontSize: 12, color: "#9A9590", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Outfit voor
        </p>
      </div>

      {/* Occasion pills */}
      <div className="flex gap-2 px-6 pb-4 overflow-x-auto z-10 flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {OCCASIONS.map((occ) => (
          <OccasionPill key={occ} label={occ} active={occasion === occ} onClick={() => changeOccasion(occ)} />
        ))}
      </div>

      {/* Avatar + navigation */}
      <div className="flex items-center justify-center gap-4 px-4 z-10 flex-shrink-0">
        <button
          onClick={() => cycleOutfit(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #E2DED9", backdropFilter: "blur(8px)" }}
        >
          <span style={{ color: "#6B6560", fontSize: 18 }}>‹</span>
        </button>

        <div
          className="transition-all duration-200"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "scale(0.95)" : "scale(1)" }}
        >
          <Mannequin outfit={outfit} glowColors={glowColors} />
        </div>

        <button
          onClick={() => cycleOutfit(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.75)", border: "1px solid #E2DED9", backdropFilter: "blur(8px)" }}
        >
          <span style={{ color: "#6B6560", fontSize: 18 }}>›</span>
        </button>
      </div>

      {/* Outfit index dots */}
      <div className="flex gap-2 justify-center py-2 z-10 flex-shrink-0">
        {outfitList.map((_, i) => (
          <div key={i} className="rounded-full transition-all" style={{ width: i === outfitIdx ? 16 : 6, height: 6, background: i === outfitIdx ? "#9B8EC4" : "#D4D0C8" }}/>
        ))}
      </div>

      {/* Piece swipe rows */}
      <div className="px-5 z-10 space-y-2 flex-shrink-0">
        {slots.map(({ label, piece }, si) => (
          <PieceRow
            key={label}
            slotLabel={label}
            piece={piece}
            onPrev={() => {}}
            onNext={() => {}}
            dotCount={2}
            dotActive={0}
          />
        ))}
      </div>

      {/* Save button */}
      <div className="px-6 pt-4 pb-6 z-10 flex-shrink-0">
        <button
          onClick={() => setSaved(true)}
          className="w-full py-4 rounded-full font-medium text-base tracking-wide transition-all active:scale-95"
          style={{
            background: saved ? "#D4A5A5" : "#9B8EC4",
            color: "#fff",
            boxShadow: saved ? "0 4px 20px rgba(212,165,165,0.4)" : "0 4px 20px rgba(155,142,196,0.4)",
          }}
        >
          {saved ? "Look opgeslagen ✓" : "Look opslaan"}
        </button>
        <p className="text-center mt-2" style={{ fontSize: 11, color: "#B0ABA6" }}>
          Gebaseerd op jouw kast · {occasion}
        </p>
      </div>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ width: "100%", maxWidth: 390, height: "100dvh", margin: "0 auto", background: "#F7F5F2" }}
    >
      <OutfitHome />
    </div>
  );
}
