from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from threading import Lock
from uuid import uuid4

import gradio as gr
from PIL import Image
from transformers import pipeline


APP_DIR = Path(__file__).parent
DATA_DIR = APP_DIR / "data"
IMAGE_DIR = DATA_DIR / "images"
ITEMS_FILE = DATA_DIR / "items.json"
MODEL_NAME = "wargoninnovation/wargon-clothing-classifier"
CLOTHING_LABELS = [
    "Blazer", "Blouse", "Cardigan", "Dress", "Hoodie", "Jacket", "Jeans",
    "Nightgown", "Outerwear", "Pajamas", "Rain jacket", "Rain trousers",
    "Robe", "Shirt", "Shorts", "Skirt", "Sweater", "T-shirt", "Tank top",
    "Tights", "Top", "Training top", "Trousers", "Tunic", "Vest",
    "Winter jacket", "Winter trousers",
]

DATA_DIR.mkdir(exist_ok=True)
IMAGE_DIR.mkdir(exist_ok=True)
STORE_LOCK = Lock()
CLASSIFIER = None


def load_items() -> list[dict]:
    if not ITEMS_FILE.exists():
        return []
    try:
        return json.loads(ITEMS_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def save_items(items: list[dict]) -> None:
    ITEMS_FILE.write_text(
        json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def get_classifier():
    global CLASSIFIER
    if CLASSIFIER is None:
        CLASSIFIER = pipeline("image-classification", model=MODEL_NAME)
    return CLASSIFIER


def format_label(label: str) -> str:
    match = re.search(r"(\d+)$", label)
    if match:
        label_id = int(match.group(1))
        if label_id < len(CLOTHING_LABELS):
            return CLOTHING_LABELS[label_id]
    return label.replace("_", " ").replace("-", " ").strip().title()


def classify_image(image: Image.Image) -> list[dict]:
    predictions = get_classifier()(image, top_k=3)
    return [
        {"label": format_label(item["label"]), "score": float(item["score"])}
        for item in predictions
    ]


def gallery_data(items: list[dict] | None = None) -> list[tuple[str, str]]:
    items = load_items() if items is None else items
    return [(item["image_path"], item["label"]) for item in items]


def register_item(image: Image.Image):
    if image is None:
        return None, "Maak eerst een foto of upload een afbeelding.", gallery_data()

    predictions = classify_image(image)
    best = predictions[0]
    item_id = uuid4().hex[:10]
    image_path = IMAGE_DIR / f"{item_id}.jpg"
    image.convert("RGB").save(image_path, "JPEG", quality=92)

    item = {
        "id": item_id,
        "image_path": str(image_path),
        "label": best["label"],
        "confidence": best["score"],
        "alternatives": predictions[1:],
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    with STORE_LOCK:
        items = load_items()
        items.insert(0, item)
        save_items(items)

    alternatives = ", ".join(
        f"{prediction['label']} ({prediction['score']:.0%})"
        for prediction in predictions[1:]
    )
    details = (
        f"**Geregistreerd als {best['label']}**  "
        f"· {best['score']:.0%} zekerheid"
    )
    if alternatives:
        details += f"\n\nAndere herkenning: {alternatives}"
    return None, details, gallery_data(items)


def clear_collection():
    with STORE_LOCK:
        items = load_items()
        for item in items:
            Path(item["image_path"]).unlink(missing_ok=True)
        save_items([])
    return gallery_data([]), "Collectie geleegd."


def remove_uploaded_copy(image_path: str) -> None:
    source = Path(image_path)
    if source.exists() and source.parent == IMAGE_DIR:
        source.unlink()


with gr.Blocks(title="Kledingkast scanner", theme=gr.themes.Base()) as demo:
    gr.HTML(
        """
                <style>
                    :root { --ink: #202522; --paper: #f5f2ec; --accent: #c85d3a; --line: #d9d4cb; }
                    body, .gradio-container { background: var(--paper) !important; color: var(--ink); }
                    .gradio-container { max-width: 1180px !important; }
                    .hero { padding: 38px 0 28px; border-bottom: 1px solid var(--line); margin-bottom: 28px; }
                    .eyebrow { color: var(--accent); font: 700 11px/1.2 monospace; letter-spacing: 2px; }
                    .hero h1 { font: 600 clamp(42px, 6vw, 76px)/.95 Georgia, serif; letter-spacing: 0; margin: 14px 0; }
                    .hero h1 em { color: var(--accent); font-weight: 400; }
                    .hero p { max-width: 480px; font-size: 16px; line-height: 1.5; margin: 0; color: #5c625e; }
                    .scanner-panel, .collection-panel { background: #fffdf9; border: 1px solid var(--line); padding: 22px; }
                    .scanner-panel h3, .collection-panel h3 { margin-top: 0; font-family: Georgia, serif; font-size: 25px; }
                    .collection-heading { align-items: center; justify-content: space-between; }
                    .collection-heading .secondary { border: 1px solid var(--line); color: var(--ink); }
                    .primary { background: var(--accent) !important; border: 0 !important; }
                    .result { min-height: 75px; color: #5c625e; }
                    @media (max-width: 700px) { .hero { padding-top: 18px; } .scanner-panel, .collection-panel { padding: 16px; } }
                </style>
        <header class='hero'>
          <div class='eyebrow'>DIGITAL CLOSET · AI SCANNER</div>
          <h1>Geef elk kledingstuk<br><em>een plek.</em></h1>
          <p>Maak een foto, laat AI het item herkennen en bouw rustig je digitale garderobe op.</p>
        </header>
        """
    )
    with gr.Row(equal_height=False):
        with gr.Column(scale=5, elem_classes="scanner-panel"):
            gr.Markdown("### Nieuw kledingstuk")
            photo = gr.Image(
                type="pil",
                sources=["upload", "webcam"],
                label="",
                height=360,
                show_label=False,
            )
            scan_button = gr.Button("Scan & registreer", variant="primary")
            result = gr.Markdown("Upload een foto om te beginnen.", elem_classes="result")
        with gr.Column(scale=7, elem_classes="collection-panel"):
            with gr.Row(elem_classes="collection-heading"):
                gr.Markdown("### Jouw collectie")
                clear_button = gr.Button("Leegmaken", size="sm", variant="secondary")
            collection = gr.Gallery(
                value=gallery_data(),
                columns=[3],
                rows=[2],
                object_fit="cover",
                height=500,
                show_label=False,
                allow_preview=True,
            )
            clear_result = gr.Markdown(visible=False)

    scan_button.click(register_item, inputs=photo, outputs=[photo, result, collection])
    clear_button.click(clear_collection, outputs=[collection, clear_result]).then(
        lambda: gr.update(visible=True), outputs=clear_result
    )


if __name__ == "__main__":
    demo.launch()