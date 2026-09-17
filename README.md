# Digital Closet

Een eenvoudige Gradio-app om kledingstukken te fotograferen of uploaden. Het model `wargoninnovation/wargon-clothing-classifier` herkent het kledingtype en registreert de foto in een lokale digitale collectie.

## Starten

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Open daarna de lokale URL die Gradio toont. De eerste scan downloadt het model van Hugging Face; daarna wordt het lokaal gecachet.

Foto's worden opgeslagen in `data/images/` en de registratie in `data/items.json`.