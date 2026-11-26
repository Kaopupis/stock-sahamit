"""Cut the speaker out of a plain light-grey studio background.

Usage: python3 cutout.py <photo.jpg> <out.png>
Flood-fills the near-grey background in from the image edges, so light areas
inside the figure (face, shirt print) are kept.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(int)
r, b = a[..., 0], a[..., 2]
cand = (a.mean(-1) > 150) & (b >= r + 2) & ((a.max(-1) - a.min(-1)) < 45)
H, W = cand.shape
bg = np.zeros_like(cand)
q = deque()
for y in range(H):
    for x in (0, W - 1):
        if cand[y, x]:
            bg[y, x] = 1; q.append((y, x))
for x in range(W):
    if cand[0, x] and not bg[0, x]:
        bg[0, x] = 1; q.append((0, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and cand[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = 1; q.append((ny, nx))
mask = Image.fromarray(((1 - bg) * 255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
out = im.convert('RGBA'); out.putalpha(mask)
out.crop(out.getbbox()).save(dst)
