# argus-website

Marketing site for Argus, self-hosted observability for Kubernetes.

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly also works.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Page content and the product mockups (built in HTML/SVG, not screenshots) |
| `styles.css` | Design tokens, layout, and every scroll-driven effect |
| `main.js` | Writes scroll progress for pinned sections, reveals content, copy buttons |
| `assets/argus-mark.svg` | Logo mark / favicon |

## How the scroll effects work

Pinned sections are `.stage` elements several screens tall with a `position: sticky`
viewport inside. `main.js` writes the scroll progress through each stage to the CSS
variable `--p` (0 → 1) and, for stages with `data-steps`, the current step to
`data-active`. All motion is derived from those two values in `styles.css`, so tuning an
effect never needs JavaScript changes.

- **Reduced motion:** with `prefers-reduced-motion: reduce`, nothing is pinned or animated;
  every section renders in its final state.
- **Small screens:** the step sections (pipeline, alerts) are unpinned and shown in their
  final state, because they are taller than a phone screen.
- **No JavaScript:** content is fully visible; only the motion is lost.

## Deploy

Any static host works: GitHub Pages (serve from the repository root), Netlify, Cloudflare
Pages, or an S3 bucket.
