// Bakes the blurred logo silhouette into a bitmap once, so the wallpaper is two static compositor layers
// (no blur filter re-running per frame; the sweep only animates a transform).
const W = 1600 // logo width inside the bitmap; blur radius is relative to this
const PAD = 60 // room for the blur to fade out

export function initWallpaper() {
  const wall = document.querySelector('.wall')
  if (!wall) return
  const img = new Image()
  img.onload = () => {
    const lh = Math.round((W * img.naturalHeight) / img.naturalWidth)
    const canvas = document.createElement('canvas')
    canvas.width = W + PAD * 2
    canvas.height = lh + PAD * 2
    const ctx = canvas.getContext('2d')
    const native = 'filter' in ctx // Safari lacks canvas blur: fall back to a CSS blur on the layers
    if (native) ctx.filter = 'blur(10px)'
    ctx.drawImage(img, PAD, PAD, W, lh)
    wall.style.setProperty('--logo-mask', `url(${canvas.toDataURL('image/png')})`)
    wall.style.setProperty('--logo-ratio', `${canvas.width} / ${canvas.height}`)
    if (!native) wall.classList.add('needs-blur')
    requestAnimationFrame(() => wall.classList.add('ready'))
  }
  img.src = `${import.meta.env.BASE_URL}logo-tight.png`
}
