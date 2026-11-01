"""Generate the seamless SVG tiles for the home hero's stylised beer.

Writes into the given directory (default: src/assets):
  beer-foam-back.svg   darker back foam wave; tiles horizontally
  beer-foam-front.svg  cream front foam wave; tiles horizontally (separate files so each layer sways on its own)
  beer-bubbles.svg flat bubbles (discs and thin rings); tiles in both directions

Usage: python3 scripts/generate-beer-art.py [out_dir] [seed]
"""
import math
import random
import sys
from pathlib import Path


def wave(width: int, base: float, waves: list[tuple[int, float, float]]) -> str:
    """Closed path filled from the top down to a smooth wave. Each wave count divides the tile width,
    so the edge lines up exactly at both ends and the tile repeats seamlessly."""
    def y(x: float) -> float:
        return base + sum(a * math.sin(2 * math.pi * k * x / width + p) for k, a, p in waves)
    points = " ".join(f"L{x} {y(x):.1f}" for x in range(width, -1, -4))
    return f"M0 0H{width}V{y(width):.1f}{points}Z"


def foam(rng: random.Random) -> tuple[str, str]:
    """Back and front foam waves as two same-size tiles, so CSS can move each layer independently."""
    w, h = 1200, 120
    back = wave(w, 74, [(2, 7, rng.uniform(0, 6.28)), (5, 3, rng.uniform(0, 6.28))])
    front = wave(w, 62, [(3, 6, rng.uniform(0, 6.28)), (7, 2, rng.uniform(0, 6.28))])
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}'>"
    return f"{svg}<path d='{back}' fill='#d9823a'/></svg>", f"{svg}<path d='{front}' fill='#fbf4ea'/></svg>"


def bubbles(rng: random.Random) -> str:
    """Flat bubbles in a few fixed sizes: mostly soft discs, some thin rings. Copies across the
    seams keep shapes whole when the tile repeats."""
    w, h = 720, 720
    placed: list[tuple[float, float, float]] = []
    for _ in range(5000):
        if len(placed) >= 68:
            break
        r = rng.choice([2, 2, 3, 3, 4, 6, 8])
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        if all((x - a) ** 2 + (y - b) ** 2 > (r + c + 18) ** 2 for a, b, c in placed):
            placed.append((x, y, r))
    shapes = []
    for x, y, r in placed:
        ring = r >= 4 and rng.random() < 0.45
        for dx in (-w, 0, w):
            for dy in (-h, 0, h):
                cx, cy = x + dx, y + dy
                if -r < cx < w + r and -r < cy < h + r:
                    style = "fill='none' stroke='#fff3e0' stroke-width='1.5' opacity='.6'" if ring else \
                        f"fill='#fff3e0' opacity='{rng.choice(['.22', '.3', '.4'])}'"
                    shapes.append(f"<circle cx='{cx:.0f}' cy='{cy:.0f}' r='{r}' {style}/>")
    return f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}'>{''.join(shapes)}</svg>"


def main() -> None:
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "src/assets")
    seed = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    out.mkdir(parents=True, exist_ok=True)
    back, front = foam(random.Random(seed))
    files = {"beer-foam-back.svg": back, "beer-foam-front.svg": front, "beer-bubbles.svg": bubbles(random.Random(seed))}
    for name, svg in files.items():
        (out / name).write_text(svg)
        print(f"{name}: {len(svg) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
