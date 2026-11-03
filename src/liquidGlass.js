// Liquid-glass edge refraction (Chromium only: backdrop-filter with an SVG url() is ignored elsewhere, so the plain blur stays).
//
// For every glass element we draw a displacement map sized to it: inside a "bezel" band along the rounded-rect edge each pixel
// points inward, strongest at the rim and easing to zero, so the backdrop at the edge is pulled from deeper inside the glass
// (a thick convex lens). The map feeds an <feDisplacementMap>, and the element gets it through `--lg` (see styles.css).

const SVGNS = 'http://www.w3.org/2000/svg'
const TARGETS = '.nav-pill, .btn:not(.ghost), .icon-btn, .sidebar, .topbar, .dropdown, .modal'
const BIG = '.sidebar, .topbar, .dropdown, .modal'

const tracked = new Map() // element -> { id, filter, image, displace, raf }
let defs
let counter = 0

function radiusOf(el, w, h) {
  const raw = getComputedStyle(el).borderTopLeftRadius
  const v = parseFloat(raw) || 0
  const r = raw.endsWith('%') ? (v / 100) * Math.min(w, h) : v
  return Math.min(r, Math.min(w, h) / 2)
}

function makeMap(w, h, r, bezel) {
  const k = w * h > 250000 ? 0.5 : 1 // big surfaces: render the map at half size, the browser scales it up
  const cw = Math.max(1, Math.round(w * k))
  const ch = Math.max(1, Math.round(h * k))
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(cw, ch)
  const d = img.data
  const hx = w / 2 - r
  const hy = h / 2 - r
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const cx = (x + 0.5) / k - w / 2
      const cy = (y + 0.5) / k - h / 2
      const qx = Math.abs(cx) - hx
      const qy = Math.abs(cy) - hy
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const len = Math.hypot(ox, oy)
      const depth = r - (len + Math.min(Math.max(qx, qy), 0)) // distance inside the edge
      let vx = 0
      let vy = 0
      if (depth > 0 && depth < bezel) {
        const m = Math.pow(1 - depth / bezel, 2.2)
        let nx
        let ny // outward normal
        if (len > 0) { nx = (ox / len) * Math.sign(cx); ny = (oy / len) * Math.sign(cy) }
        else if (qx > qy) { nx = Math.sign(cx); ny = 0 }
        else { nx = 0; ny = Math.sign(cy) }
        vx = -nx * m // sample from inside
        vy = -ny * m
      }
      const i = (y * cw + x) * 4
      d[i] = 128 + vx * 127
      d[i + 1] = 128 + vy * 127
      d[i + 2] = 128
      d[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

function update(el) {
  const entry = tracked.get(el)
  if (!entry) return
  const w = Math.round(el.offsetWidth)
  const h = Math.round(el.offsetHeight)
  if (w < 8 || h < 8) return
  const r = radiusOf(el, w, h)
  const big = el.matches(BIG)
  const bezel = Math.max(4, Math.min(r, big ? 30 : 14))
  const maxShift = bezel * (big ? 0.7 : 0.9)
  entry.image.setAttribute('width', w)
  entry.image.setAttribute('height', h)
  entry.image.setAttribute('href', makeMap(w, h, r, bezel))
  entry.displace.setAttribute('scale', String(maxShift * 2))
  el.style.setProperty('--lg', `url(#${entry.id})`)
}

function track(el, ro) {
  if (tracked.has(el)) return
  const id = `lg-${++counter}`
  const filter = document.createElementNS(SVGNS, 'filter')
  filter.setAttribute('id', id)
  filter.setAttribute('x', '0'); filter.setAttribute('y', '0')
  filter.setAttribute('width', '100%'); filter.setAttribute('height', '100%')
  filter.setAttribute('color-interpolation-filters', 'sRGB') // keeps the neutral 128 grey neutral
  const image = document.createElementNS(SVGNS, 'feImage')
  image.setAttribute('x', '0'); image.setAttribute('y', '0')
  image.setAttribute('preserveAspectRatio', 'none')
  image.setAttribute('result', 'map')
  const displace = document.createElementNS(SVGNS, 'feDisplacementMap')
  displace.setAttribute('in', 'SourceGraphic')
  displace.setAttribute('in2', 'map')
  displace.setAttribute('xChannelSelector', 'R')
  displace.setAttribute('yChannelSelector', 'G')
  filter.append(image, displace)
  defs.append(filter)
  tracked.set(el, { id, filter, image, displace, raf: 0 })
  ro.observe(el)
}

export function initLiquidGlass() {
  if (!/Chrome\//.test(navigator.userAgent) || /Firefox/.test(navigator.userAgent)) return

  const svg = document.createElementNS(SVGNS, 'svg')
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.position = 'absolute'
  defs = document.createElementNS(SVGNS, 'defs')
  svg.append(defs)
  document.body.append(svg)

  const ro = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const entry = tracked.get(target)
      if (!entry) continue
      cancelAnimationFrame(entry.raf)
      entry.raf = requestAnimationFrame(() => update(target))
    }
  })

  const scan = (root) => {
    if (root.nodeType !== 1) return
    if (root.matches(TARGETS)) track(root, ro)
    root.querySelectorAll?.(TARGETS).forEach((el) => track(el, ro))
  }
  const sweep = () => {
    for (const [el, entry] of tracked) {
      if (el.isConnected) continue
      ro.unobserve(el)
      cancelAnimationFrame(entry.raf)
      entry.filter.remove()
      tracked.delete(el)
    }
  }

  scan(document.body)
  new MutationObserver((muts) => {
    let removed = false
    for (const m of muts) {
      m.addedNodes.forEach(scan)
      if (m.removedNodes.length) removed = true
    }
    if (removed) sweep()
  }).observe(document.body, { childList: true, subtree: true })
}
