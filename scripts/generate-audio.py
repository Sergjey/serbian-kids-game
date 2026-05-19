#!/usr/bin/env python3
"""Generate Serbian word audio with Microsoft neural TTS (edge-tts)."""
import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
LEVELS = ROOT / "src" / "data" / "levels.json"
OUT_DIR = ROOT / "public" / "audio"
MANIFEST = OUT_DIR / "manifest.json"
VOICE = "sr-RS-SophieNeural"


async def generate_one(text: str, path: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(str(path))


async def main() -> None:
    levels = json.loads(LEVELS.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, str] = {}

    for level in levels:
        for i, word in enumerate(level["words"]):
            sr = word["sr"]
            fname = f"{level['id']}-{i:02d}.mp3"
            path = OUT_DIR / fname
            if not path.exists():
                print(f"Generating {fname}: {sr}")
                await generate_one(sr, path)
            else:
                print(f"Skip (exists) {fname}")
            manifest[sr] = fname

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. {len(manifest)} clips -> {MANIFEST}")


if __name__ == "__main__":
    asyncio.run(main())
