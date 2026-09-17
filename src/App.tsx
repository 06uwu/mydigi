import { useState, useRef, useCallback } from "react"

type Screen = "onboarding" | "paspop" | "wardrobe" | "outfit" | "profiel"

type ClothingItem = {
  id: string
  category: "top" | "bottom" | "shoes" | "outer"
  label: string
  color: string
  emoji: string
  photo: string
}

function ClothingPhoto({
  photo,
  category,
  label,
  className,
}: {
  photo: string
  category: ClothingItem["category"]
  label: string
  className: string
}) {
  return (
    <img
      src={photo}
      alt={label}
      loading="lazy"
      draggable={false}
      style={{
        objectPosition:
          category === "shoes" ? "center 62%" : category === "bottom" ? "center 42%" : "center 34%",
      }}
      className={`object-contain mix-blend-multiply saturate-[0.9] contrast-[1.08] brightness-[1.03] ${className}`}
    />
  )
}

type StyleCategory = "boho" | "minimalistic" | "casual" | "party"

const STIJL_CATEGORIEEN: { id: StyleCategory; label: string; icon: string }[] = [
  { id: "minimalistic", label: "Minimaal", icon: "◻" },
  { id: "casual", label: "Casual", icon: "◈" },
  { id: "boho", label: "Boho", icon: "◇" },
  { id: "party", label: "Feest", icon: "◆" },
]

const GARDEROBE_PRESETS: Record<StyleCategory, ClothingItem[]> = {
  minimalistic: [
    { id: "t1", category: "top", label: "Wit linnen blouse", color: "#F0EDE8", emoji: "👕", photo: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=85" },
    { id: "b1", category: "bottom", label: "Rechte beige broek", color: "#D4C9B8", emoji: "👖", photo: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=85" },
    { id: "s1", category: "shoes", label: "Witte leren loafers", color: "#FAFAF8", emoji: "👟", photo: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=85" },
    { id: "o1", category: "outer", label: "Camel wollen jas", color: "#C8A882", emoji: "🧥", photo: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=500&q=85" },
  ],
  casual: [
    { id: "t2", category: "top", label: "Oversized grijs t-shirt", color: "#B8B8B8", emoji: "👕", photo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=85" },
    { id: "b2", category: "bottom", label: "Wijdpijp spijkerbroek", color: "#4A6FA5", emoji: "👖", photo: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=85" },
    { id: "s2", category: "shoes", label: "Klassieke witte sneakers", color: "#F5F5F5", emoji: "👟", photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=85" },
    { id: "o2", category: "outer", label: "Olijfgroene bomberjack", color: "#6B7C4A", emoji: "🧥", photo: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=500&q=85" },
  ],
  boho: [
    { id: "t3", category: "top", label: "Bloemen wikkelblouse", color: "#C4956A", emoji: "👘", photo: "https://images.unsplash.com/photo-1564257577054-2e43f3b2d1c8?auto=format&fit=crop&w=500&q=85" },
    { id: "b3", category: "bottom", label: "Vloeiende maxi rok", color: "#8B6F47", emoji: "👗", photo: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=500&q=85" },
    { id: "s3", category: "shoes", label: "Bruine leren sandalen", color: "#B8935A", emoji: "👡", photo: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=85" },
    { id: "o3", category: "outer", label: "Gehaakt kimono vest", color: "#D4A57A", emoji: "🥻", photo: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=500&q=85" },
  ],
  party: [
    { id: "t4", category: "top", label: "Pailletten crop top", color: "#C9A96E", emoji: "✨", photo: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=500&q=85" },
    { id: "b4", category: "bottom", label: "Mini leren rok", color: "#2C2A28", emoji: "👗", photo: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=500&q=85" },
    { id: "s4", category: "shoes", label: "Hoge hakken sandalen", color: "#1A1A1A", emoji: "👠", photo: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=500&q=85" },
    { id: "o4", category: "outer", label: "Satijnen blazer", color: "#8B7355", emoji: "🧥", photo: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=500&q=85" },
  ],
}

// ── Onboarding ────────────────────────────────────────────────────────────────

const ONBOARDING_SLIDES = [
  {
    title: "Jouw digitale garderobe,\nvoor jou gemaakt.",
    subtitle: "Upload je kleding één keer. Stijlvol gekleed — elke dag weer.",
    icon: "✦",
  },
  {
    title: "Scan & digitaliseer\nje kledingkast.",
    subtitle: "Richt je camera op een kledingstuk en het verschijnt direct in je garderobe.",
    icon: "◈",
  },
  {
    title: "Outfits gebouwd\nom jou heen.",
    subtitle: "Bekijk complete looks direct geprojecteerd op jouw persoonlijke paspop.",
    icon: "◇",
  },
]

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [slide, setSlide] = useState(0)
  const current = ONBOARDING_SLIDES[slide]
  const isLast = slide === ONBOARDING_SLIDES.length - 1

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F5F2" }}>
      <div className="flex justify-between items-center px-6 pt-12 pb-4">
        <span className="font-display text-lg tracking-wide" style={{ color: "#2C2A28" }}>
          My Digital Closet
        </span>
        {!isLast && (
          <button onClick={onDone} className="text-sm font-medium" style={{ color: "#9A8E7E" }}>
            Overslaan
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
          style={{ background: "#EDE8E0" }}
        >
          {current.icon}
        </div>
        <div className="space-y-4 max-w-xs">
          <h1
            className="font-display text-3xl leading-tight whitespace-pre-line"
            style={{ color: "#2C2A28" }}
          >
            {current.title}
          </h1>
          <p className="text-base font-light leading-relaxed" style={{ color: "#7A6E61" }}>
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-8">
        {ONBOARDING_SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === slide ? 24 : 8,
              height: 8,
              background: i === slide ? "#2C2A28" : "#D4CFC8",
            }}
          />
        ))}
      </div>

      <div className="px-6 pb-12">
        <button
          onClick={() => (isLast ? onDone() : setSlide((s) => s + 1))}
          className="w-full py-4 rounded-2xl text-base font-medium transition-all active:scale-95"
          style={{ background: "#2C2A28", color: "#F7F5F2" }}
        >
          {isLast ? "Aan de slag" : "Volgende"}
        </button>
      </div>
    </div>
  )
}

// ── Paspop setup (herbruikbaar voor profiel) ───────────────────────────────────

type PaspopScreenProps = {
  initialBodyPhoto?: string | null
  initialFacePhoto?: string | null
  onDone: (bodyPhoto: string | null, facePhoto: string | null) => void
  isEdit?: boolean
}

function PaspopScreen({ initialBodyPhoto, initialFacePhoto, onDone, isEdit = false }: PaspopScreenProps) {
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(initialBodyPhoto ?? null)
  const [facePhoto, setFacePhoto] = useState<string | null>(initialFacePhoto ?? null)
  const [step, setStep] = useState<"body" | "face" | "processing" | "done">(
    isEdit ? "body" : "body",
  )
  const bodyRef = useRef<HTMLInputElement>(null)
  const faceRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "body" | "face") => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      if (type === "body") {
        setBodyPhoto(url)
        setStep("face")
      } else {
        setFacePhoto(url)
        setStep("processing")
        setTimeout(() => setStep("done"), 2200)
      }
    },
    [],
  )

  if (step === "processing") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center"
        style={{ background: "#F7F5F2" }}
      >
        <div className="relative w-20 h-20">
          <div
            className="w-20 h-20 rounded-full border-2 animate-spin"
            style={{ borderColor: "#EDE8E0", borderTopColor: "#2C2A28" }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-2xl">✦</span>
        </div>
        <h2 className="font-display text-2xl" style={{ color: "#2C2A28" }}>
          {isEdit ? "Paspop bijwerken…" : "Paspop aanmaken…"}
        </h2>
        <p className="text-sm font-light" style={{ color: "#9A8E7E" }}>
          Verhoudingen analyseren &amp; silhouet in kaart brengen
        </p>
      </div>
    )
  }

  if (step === "done") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-8 px-8 text-center"
        style={{ background: "#F7F5F2" }}
      >
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-4"
            style={{ borderColor: "#2C2A28" }}
          >
            {facePhoto ? (
              <img src={facePhoto} alt="gezicht" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl"
                style={{ background: "#EDE8E0" }}
              >
                👤
              </div>
            )}
          </div>
          <div
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "#2C2A28", color: "#F7F5F2" }}
          >
            ✓
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl" style={{ color: "#2C2A28" }}>
            {isEdit ? "Paspop bijgewerkt!" : "Jouw paspop is klaar!"}
          </h2>
          <p className="text-sm font-light" style={{ color: "#9A8E7E" }}>
            {isEdit
              ? "Je outfits worden nu aangepast op jouw nieuwe look."
              : "Alle toekomstige outfits worden op jou afgestemd."}
          </p>
        </div>

        <button
          onClick={() => onDone(bodyPhoto, facePhoto)}
          className="w-full max-w-xs py-4 rounded-2xl text-base font-medium active:scale-95 transition-all"
          style={{ background: "#2C2A28", color: "#F7F5F2" }}
        >
          {isEdit ? "Terug naar profiel →" : "Mijn garderobe opbouwen →"}
        </button>
      </div>
    )
  }

  const isBodyStep = step === "body"

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F5F2" }}>
      <div className="px-6 pt-12 pb-6">
        <p className="text-sm font-medium mb-1" style={{ color: "#9A8E7E" }}>
          Stap {isBodyStep ? "1" : "2"} van 2
        </p>
        <h1
          className="font-display text-3xl leading-tight whitespace-pre-line"
          style={{ color: "#2C2A28" }}
        >
          {isBodyStep ? "Foto van\nhet hele lichaam" : "Foto van\nje gezicht"}
        </h1>
        <p className="mt-2 text-sm font-light" style={{ color: "#7A6E61" }}>
          {isBodyStep
            ? "Sta voor een egale achtergrond, armen iets van je lichaam af."
            : "Een duidelijke frontale foto bij goed licht werkt het best."}
        </p>
      </div>

      <div className="px-6 mb-6">
        <div className="h-1 rounded-full" style={{ background: "#EDE8E0" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: isBodyStep ? "50%" : "100%", background: "#2C2A28" }}
          />
        </div>
      </div>

      <div className="flex-1 px-6 flex flex-col gap-4">
        <div
          className="flex-1 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all"
          style={{ borderColor: "#C8C2BA", background: "#F0EDE8", minHeight: 320 }}
          onClick={() => (isBodyStep ? bodyRef.current?.click() : faceRef.current?.click())}
        >
          {(isBodyStep ? bodyPhoto : facePhoto) ? (
            <img
              src={(isBodyStep ? bodyPhoto : facePhoto)!}
              alt="voorbeeldweergave"
              className="w-full h-full object-cover rounded-3xl"
              style={{ maxHeight: 400 }}
            />
          ) : (
            <>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "#E5E0D8" }}
              >
                {isBodyStep ? "🧍" : "🤳"}
              </div>
              <div className="text-center">
                <p className="font-medium text-sm" style={{ color: "#2C2A28" }}>
                  Tik om te uploaden
                </p>
                <p className="text-xs mt-1" style={{ color: "#9A8E7E" }}>
                  of maak een foto
                </p>
              </div>
            </>
          )}
        </div>

        <input
          ref={bodyRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e, "body")}
        />
        <input
          ref={faceRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFile(e, "face")}
        />
      </div>

      <div className="px-6 pb-12 pt-6 flex flex-col gap-3">
        {(isBodyStep ? bodyPhoto : facePhoto) ? (
          <button
            onClick={() => (isBodyStep ? setStep("face") : setStep("processing"))}
            className="w-full py-4 rounded-2xl text-base font-medium active:scale-95 transition-all"
            style={{ background: "#2C2A28", color: "#F7F5F2" }}
          >
            {isBodyStep ? "Volgende: gezichtsfoto →" : "Mijn paspop aanmaken →"}
          </button>
        ) : (
          <button
            onClick={() => (isBodyStep ? bodyRef.current?.click() : faceRef.current?.click())}
            className="w-full py-4 rounded-2xl text-base font-medium"
            style={{ background: "#EDE8E0", color: "#7A6E61" }}
          >
            {isBodyStep ? "Lichaamsfoto uploaden" : "Gezichtsfoto uploaden"}
          </button>
        )}
        {isEdit && (
          <button
            onClick={() => onDone(initialBodyPhoto ?? null, initialFacePhoto ?? null)}
            className="w-full py-3 rounded-2xl text-sm font-medium"
            style={{ color: "#9A8E7E" }}
          >
            Annuleren
          </button>
        )}
      </div>
    </div>
  )
}

// ── Garderobe ─────────────────────────────────────────────────────────────────

const DEMO_ITEMS: ClothingItem[] = [
  { ...GARDEROBE_PRESETS.minimalistic[0], id: "w1" },
  { ...GARDEROBE_PRESETS.casual[1], id: "w2", label: "Beige wijdpijp broek", color: "#D4C9B8" },
  { ...GARDEROBE_PRESETS.minimalistic[3], id: "w3" },
  { ...GARDEROBE_PRESETS.casual[0], id: "w4" },
  { ...GARDEROBE_PRESETS.minimalistic[2], id: "w5" },
  { ...GARDEROBE_PRESETS.casual[1], id: "w6", label: "Rechte spijkerbroek" },
]

const scanTeller = { current: 0 }

function GarderobeScreen({
  items,
  onAddItem,
  onDone,
}: {
  items: ClothingItem[]
  onAddItem: (item: ClothingItem) => void
  onDone: () => void
}) {
  const [scanning, setScanning] = useState(false)
  const [gescand, setGescand] = useState(false)
  const [progress, setProgress] = useState(0)

  const startScan = () => {
    setScanning(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 4
      })
    }, 80)

    setTimeout(() => {
      setScanning(false)
      setGescand(true)
      const nieuwItem: ClothingItem = {
        id: `scan-${++scanTeller.current}`,
        category: "top",
        label: "Gescand olijfgroen coltrui",
        color: "#6B7C4A",
        emoji: "🧣",
        photo: GARDEROBE_PRESETS.casual[0].photo,
      }
      onAddItem(nieuwItem)
    }, 80 * 26)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F5F2" }}>
      <div className="px-6 pt-12 pb-4 flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl" style={{ color: "#2C2A28" }}>
            Mijn Garderobe
          </h1>
          <p className="text-sm font-light mt-1" style={{ color: "#9A8E7E" }}>
            {items.length} items gedigitaliseerd
          </p>
        </div>
        <button
          onClick={onDone}
          className="text-sm font-medium px-4 py-2 rounded-xl"
          style={{ background: "#2C2A28", color: "#F7F5F2" }}
        >
          Styleer mij →
        </button>
      </div>

      <div className="px-6 mb-6">
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{ background: "#2C2A28", minHeight: 220 }}
        >
          <div className="flex flex-col items-center justify-center gap-4 py-10 px-6">
            {scanning ? (
              <>
                <div className="relative w-24 h-24">
                  <div
                    className="absolute inset-0 rounded-full border-2 animate-ping"
                    style={{ borderColor: "#C8A882", animationDuration: "1.5s" }}
                  />
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                    style={{ background: "#3A3835" }}
                  >
                    📷
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs mb-2" style={{ color: "#9A8E7E" }}>
                    <span>Kledingstuk scannen…</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#3A3835" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress}%`, background: "#C8A882" }}
                    />
                  </div>
                </div>
              </>
            ) : gescand ? (
              <>
                <div className="text-5xl">✓</div>
                <p className="text-base font-medium" style={{ color: "#F7F5F2" }}>
                  Item toegevoegd aan garderobe!
                </p>
                <button
                  onClick={() => setGescand(false)}
                  className="text-sm px-4 py-2 rounded-xl"
                  style={{ background: "#3A3835", color: "#C8A882" }}
                >
                  Nog een scannen
                </button>
              </>
            ) : (
              <>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div
                    className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg"
                    style={{ borderColor: "#C8A882" }}
                  />
                  <div
                    className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg"
                    style={{ borderColor: "#C8A882" }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg"
                    style={{ borderColor: "#C8A882" }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg"
                    style={{ borderColor: "#C8A882" }}
                  />
                  <span className="text-4xl">👗</span>
                </div>
                <p className="text-sm text-center" style={{ color: "#9A8E7E" }}>
                  Houd een kledingstuk in beeld &amp; tik op scannen
                </p>
                <button
                  onClick={startScan}
                  className="px-8 py-3 rounded-2xl text-sm font-medium active:scale-95 transition-all"
                  style={{ background: "#C8A882", color: "#2C2A28" }}
                >
                  Kledingstuk scannen
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-32">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "#9A8E7E" }}
        >
          Digitale kledingkast
        </p>
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-3 flex flex-col items-center gap-2 aspect-square justify-center"
              style={{ background: "#EDE8E0" }}
            >
              <div
                className="w-full h-28 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: "#FFFFFF", border: "1px solid #E7E2DC" }}
              >
                <ClothingPhoto
                  photo={item.photo}
                  category={item.category}
                  label={item.label}
                  className={`w-full ${item.category === "shoes" ? "h-20" : "h-full"}`}
                />
              </div>
              <p
                className="text-xs text-center leading-tight line-clamp-2"
                style={{ color: "#5A504A" }}
              >
                {item.label}
              </p>
            </div>
          ))}

          <div
            className="rounded-2xl flex flex-col items-center justify-center gap-1 aspect-square cursor-pointer border-2 border-dashed"
            style={{ borderColor: "#C8C2BA" }}
          >
            <span className="text-2xl" style={{ color: "#C8C2BA" }}>+</span>
            <p className="text-xs" style={{ color: "#C8C2BA" }}>Uploaden</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Outfit ────────────────────────────────────────────────────────────────────

type ClothingSlot = ClothingItem["category"]

const SLOT_VOLGORDE: ClothingSlot[] = ["outer", "top", "bottom", "shoes"]

const SLOT_NAMEN: Record<string, string> = {
  outer: "Bovenkleding",
  top: "Top",
  bottom: "Onder",
  shoes: "Schoenen",
}

const ITEMS_PER_SLOT: Record<ClothingSlot, ClothingItem[]> = {
  outer: STIJL_CATEGORIEEN.flatMap(({ id }) => GARDEROBE_PRESETS[id].filter((item) => item.category === "outer")),
  top: STIJL_CATEGORIEEN.flatMap(({ id }) => GARDEROBE_PRESETS[id].filter((item) => item.category === "top")),
  bottom: STIJL_CATEGORIEEN.flatMap(({ id }) => GARDEROBE_PRESETS[id].filter((item) => item.category === "bottom")),
  shoes: STIJL_CATEGORIEEN.flatMap(({ id }) => GARDEROBE_PRESETS[id].filter((item) => item.category === "shoes")),
}

const LAYER_POSITIONS: Record<ClothingSlot, string> = {
  outer: "top-[17%] left-[16%] w-[68%] h-[25%]",
  top: "top-[31%] left-[24%] w-[52%] h-[20%]",
  bottom: "top-[49%] left-[27%] w-[46%] h-[28%]",
  shoes: "bottom-[8%] left-[29%] w-[42%] h-[12%]",
}

function OutfitItemCard({
  slot,
  item,
  selected,
  onSelect,
  onSwipe,
}: {
  slot: ClothingSlot
  item: ClothingItem
  selected: boolean
  onSelect: () => void
  onSwipe: (direction: "next" | "previous") => void
}) {
  const pointerStartX = useRef<number | null>(null)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect()
      }}
      onPointerDown={(event) => {
        pointerStartX.current = event.clientX
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return
        const distance = event.clientX - pointerStartX.current
        pointerStartX.current = null
        if (Math.abs(distance) >= 36) onSwipe(distance < 0 ? "next" : "previous")
      }}
      onPointerCancel={() => {
        pointerStartX.current = null
      }}
      className="w-full flex-1 min-h-[72px] min-w-0 flex items-center gap-2 rounded-2xl p-2 text-left transition-all select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882]"
      style={{
        background: selected ? "#F2E4D0" : "#FFFFFF",
        border: selected ? "2px solid #C8A882" : "1px solid #E7E2DC",
        boxShadow: selected ? "0 5px 16px rgba(200,168,130,0.2)" : "0 4px 12px rgba(44,42,40,0.06)",
        touchAction: "pan-y",
      }}
    >
      <button
        type="button"
        aria-label={`Vorig ${SLOT_NAMEN[slot]} item`}
        onClick={(event) => {
          event.stopPropagation()
          onSwipe("previous")
        }}
        className="w-7 h-10 flex-shrink-0 flex items-center justify-center text-base font-bold rounded-lg transition-colors hover:bg-[#EDE8E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882]"
        style={{ color: "#7A6E61" }}
      >
        ←
      </button>
      <span className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center border border-[#E7E2DC]" style={{ background: "#FFFFFF" }}>
        <ClothingPhoto photo={item.photo} category={item.category} label={item.label} className="w-full h-full" />
      </span>
      <span className="min-w-0 flex-1 overflow-hidden">
        <span className="block text-base font-bold leading-tight whitespace-nowrap" style={{ color: "#5A504A" }}>{SLOT_NAMEN[slot]}</span>
        <span className="block text-base font-medium leading-[1.15] mt-0.5 whitespace-normal" style={{ color: "#2C2A28" }}>{item.label}</span>
      </span>
      <button
        type="button"
        aria-label={`Volgend ${SLOT_NAMEN[slot]} item`}
        onClick={(event) => {
          event.stopPropagation()
          onSwipe("next")
        }}
        className="w-7 h-10 flex-shrink-0 flex items-center justify-center text-base font-bold rounded-lg transition-colors hover:bg-[#EDE8E0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882]"
        style={{ color: "#7A6E61" }}
      >
        →
      </button>
    </div>
  )
}

function OutfitScreen({ bodyPhoto, facePhoto }: { bodyPhoto: string | null; facePhoto: string | null }) {
  const [activeStijl, setActiveStijl] = useState<StyleCategory>("casual")
  const [selectedCategory, setSelectedCategory] = useState<ClothingSlot>("top")
  const [activeOutfitItems, setActiveOutfitItems] = useState<Record<ClothingSlot, number>>({
    outer: 1,
    top: 1,
    bottom: 1,
    shoes: 1,
  })
  const layerPointerStartX = useRef<number | null>(null)

  const kiesStijl = (stijl: StyleCategory) => {
    const styleIndex = STIJL_CATEGORIEEN.findIndex((category) => category.id === stijl)
    setActiveStijl(stijl)
    setActiveOutfitItems(Object.fromEntries(SLOT_VOLGORDE.map((slot) => [slot, styleIndex])) as Record<ClothingSlot, number>)
  }

  const swipeSlot = useCallback((slot: ClothingSlot, direction: "next" | "previous") => {
    setActiveOutfitItems((previous) => {
      const items = ITEMS_PER_SLOT[slot]
      const currentIndex = previous[slot] ?? 0
      const nextIndex = direction === "next"
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length
      return { ...previous, [slot]: nextIndex }
    })
  }, [])

  const handleLayerPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    layerPointerStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleLayerPointerUp = (slot: ClothingSlot, event: React.PointerEvent<HTMLButtonElement>) => {
    if (layerPointerStartX.current === null) return
    const distance = event.clientX - layerPointerStartX.current
    layerPointerStartX.current = null
    if (Math.abs(distance) >= 36) swipeSlot(slot, distance < 0 ? "next" : "previous")
  }

  const regenereer = () => {
    const otherStyles = STIJL_CATEGORIEEN.filter((style) => style.id !== activeStijl)
    const nextStyle = otherStyles[Math.floor(Math.random() * otherStyles.length)].id
    kiesStijl(nextStyle)
  }

  const activeItems = SLOT_VOLGORDE.map((slot) => ({
    slot,
    item: ITEMS_PER_SLOT[slot][activeOutfitItems[slot] ?? 0],
  }))

  return (
    <div className="h-[100svh] overflow-hidden flex flex-col" style={{ background: "#F7F5F2" }}>
      <main className="w-full max-w-xl mx-auto flex flex-col items-center flex-1 min-h-0 overflow-hidden px-3 pt-4 pb-24">
        <header className="w-full max-w-[360px] min-w-0 flex justify-between items-center gap-2 overflow-hidden">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold leading-tight whitespace-nowrap" style={{ color: "#2C2A28" }}>Outfit Generator</h1>
            <p className="text-base font-light" style={{ color: "#5A504A" }}>Tik aan &amp; swipe om te wisselen</p>
          </div>
          <button
            onClick={regenereer}
            className="flex items-center gap-1.5 text-base font-medium px-3 py-1.5 rounded-xl active:scale-95 transition-all hover:bg-[#E3DCD2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882]"
            style={{ background: "#EDE8E0", color: "#2C2A28" }}
          >
            <span aria-hidden="true">↻</span> Opnieuw
          </button>
        </header>

        <div className="w-full max-w-[360px] mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5" aria-label="Stijl filteren">
          {STIJL_CATEGORIEEN.map((category) => (
            <button
              key={category.id}
              onClick={() => kiesStijl(category.id)}
              className="w-full h-9 min-w-0 justify-center px-1 rounded-full text-base font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882]"
              style={activeStijl === category.id
                ? { background: "#F2E4D0", color: "#4A3524", border: "1px solid #C8A882" }
                : { background: "#EDE8E0", color: "#5A504A", border: "1px solid transparent" }}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-[360px] flex-1 min-h-0 mt-3 grid min-w-0 grid-cols-[0.95fr_1.05fr] gap-2 items-stretch">
          <section className="min-w-0 min-h-0 rounded-3xl p-2 h-full border border-[#E7E2DC] shadow-sm" style={{ background: "#EDE8E0" }} aria-label="Virtuele pashandpop">
            <div className="relative mx-auto w-full max-w-[220px] h-full rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "#DAD3CA" }}>
              {bodyPhoto ? (
                <img src={bodyPhoto} alt="Jouw ingescande lichaam" className="absolute inset-0 w-full h-full object-cover opacity-75" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center pt-[9%]" style={{ color: "#8E8175" }}>
                  <span className="w-11 h-11 rounded-full" style={{ background: "#B9AEA2" }} />
                  <span className="w-24 h-[48%] rounded-[45%_45%_20%_20%] mt-2" style={{ background: "#B9AEA2" }} />
                  <span className="w-16 h-[22%] rounded-b-[40%]" style={{ background: "#B9AEA2" }} />
                </div>
              )}
              {facePhoto && <img src={facePhoto} alt="Jouw gezicht" className="absolute top-[7%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full object-cover border-2 border-white/80" />}
              {activeItems.map(({ slot, item }) => {
                const selected = selectedCategory === slot
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedCategory(slot)}
                    onPointerDown={handleLayerPointerDown}
                    onPointerUp={(event) => handleLayerPointerUp(slot, event)}
                    onPointerCancel={() => {
                      layerPointerStartX.current = null
                    }}
                    className={`absolute ${LAYER_POSITIONS[slot]} rounded-xl overflow-hidden transition-all ${selected ? "ring-2 ring-[#C8A882] ring-offset-2" : "opacity-90"}`}
                    style={{ background: "#FFFFFF", mixBlendMode: "multiply" }}
                    aria-label={`${SLOT_NAMEN[slot]} selecteren`}
                  >
                    <ClothingPhoto photo={item.photo} category={item.category} label={item.label} className="w-full h-full" />
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 min-h-0 flex flex-col gap-2" aria-label="Outfit onderdelen">
            {activeItems.map(({ slot, item }) => (
              <OutfitItemCard
                key={slot}
                slot={slot}
                item={item}
                selected={selectedCategory === slot}
                onSelect={() => setSelectedCategory(slot)}
                onSwipe={(direction) => swipeSlot(slot, direction)}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

// ── Profiel ───────────────────────────────────────────────────────────────────

type ProfielProps = {
  bodyPhoto: string | null
  facePhoto: string | null
  onEditPaspop: () => void
}

function ProfielScreen({ bodyPhoto, facePhoto, onEditPaspop }: ProfielProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F5F2" }}>
      <div className="px-6 pt-12 pb-6">
        <h1 className="font-display text-3xl" style={{ color: "#2C2A28" }}>
          Mijn Profiel
        </h1>
        <p className="text-sm font-light mt-1" style={{ color: "#9A8E7E" }}>
          Beheer jouw paspop en voorkeuren
        </p>
      </div>

      {/* paspop kaart */}
      <div className="px-6 mb-6">
        <div
          className="rounded-3xl p-6 flex gap-5 items-center"
          style={{ background: "#EDE8E0" }}
        >
          {/* body thumbnail */}
          <div
            className="w-20 h-28 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ background: "#D4CFC8" }}
          >
            {bodyPhoto ? (
              <img src={bodyPhoto} alt="lichaam" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">🧍</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* face circle */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 flex items-center justify-center"
                style={{ borderColor: "#2C2A28", background: "#C8C2BA" }}
              >
                {facePhoto ? (
                  <img src={facePhoto} alt="gezicht" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: "#2C2A28" }}>
                  Jouw paspop
                </p>
                <p className="text-xs" style={{ color: "#9A8E7E" }}>
                  {bodyPhoto && facePhoto ? "Volledig ingesteld" : "Nog niet ingesteld"}
                </p>
              </div>
            </div>

            <button
              onClick={onEditPaspop}
              className="w-full py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-all"
              style={{ background: "#2C2A28", color: "#F7F5F2" }}
            >
              Paspop aanpassen
            </button>
          </div>
        </div>
      </div>

      {/* instellingen lijst */}
      <div className="px-6 flex flex-col gap-3 pb-32">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-1"
          style={{ color: "#9A8E7E" }}
        >
          Voorkeuren
        </p>

        {[
          { icon: "📏", label: "Lichaamsmaten", waarde: "Nog niet ingesteld" },
          { icon: "🎨", label: "Kleurpalet", waarde: "Aards & neutraal" },
          { icon: "👗", label: "Voorkeursstijl", waarde: "Minimaal, Casual" },
          { icon: "🔔", label: "Meldingen", waarde: "Aan" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl px-4 py-4 flex items-center gap-4"
            style={{ background: "#EDE8E0" }}
          >
            <span className="text-xl w-8 text-center">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#2C2A28" }}>
                {item.label}
              </p>
              <p className="text-xs" style={{ color: "#9A8E7E" }}>
                {item.waarde}
              </p>
            </div>
            <span style={{ color: "#C8C2BA" }}>›</span>
          </div>
        ))}

        <div
          className="rounded-2xl px-4 py-4 flex items-center gap-4 mt-2"
          style={{ background: "#EDE8E0" }}
        >
          <span className="text-xl w-8 text-center">🚪</span>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "#C4524A" }}>
              Uitloggen
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { screen: Screen; icon: string; label: string }[] = [
  { screen: "outfit", icon: "✦", label: "Outfit Generator" },
  { screen: "wardrobe", icon: "👗", label: "Garderobe" },
  { screen: "profiel", icon: "👤", label: "Profiel" },
]

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding")
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null)
  const [facePhoto, setFacePhoto] = useState<string | null>(null)
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>(DEMO_ITEMS)

  const showNav = screen !== "onboarding" && screen !== "paspop"

  const handlePaspopDone = (newBody: string | null, newFace: string | null) => {
    if (newBody) setBodyPhoto(newBody)
    if (newFace) setFacePhoto(newFace)
    setScreen("profiel")
  }

  return (
    <div className="max-w-md mx-auto relative" style={{ minHeight: "100svh" }}>
      {screen === "onboarding" && (
        <OnboardingScreen onDone={() => setScreen("outfit")} />
      )}

      {screen === "paspop" && (
        <PaspopScreen
          initialBodyPhoto={bodyPhoto}
          initialFacePhoto={facePhoto}
          onDone={handlePaspopDone}
          isEdit={true}
        />
      )}

      {screen === "wardrobe" && (
        <GarderobeScreen
          items={wardrobeItems}
          onAddItem={(item) => setWardrobeItems((prev) => [...prev, item])}
          onDone={() => setScreen("outfit")}
        />
      )}

      {screen === "outfit" && <OutfitScreen bodyPhoto={bodyPhoto} facePhoto={facePhoto} />}

      {screen === "profiel" && (
        <ProfielScreen
          bodyPhoto={bodyPhoto}
          facePhoto={facePhoto}
          onEditPaspop={() => setScreen("paspop")}
        />
      )}

      {showNav && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-8 pt-3"
          style={{ background: "linear-gradient(to top, #F7F5F2 70%, transparent)" }}
        >
          <div
            className="flex justify-around items-center py-3 px-2 rounded-2xl"
            style={{ background: "#2C2A28" }}
          >
            {NAV_ITEMS.map((nav) => (
              <button
                key={nav.screen}
                onClick={() => setScreen(nav.screen)}
                className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
                style={screen === nav.screen ? { background: "#3A3835" } : {}}
              >
                <span className="text-lg">{nav.icon}</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: screen === nav.screen ? "#C8A882" : "#7A6E61" }}
                >
                  {nav.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
