// Run locally: node scripts/download-product-images.mjs
// Downloads every remote `image:` URL in src/data/products.js into public/products/<id>.<ext>
// and rewrites the data file to use the local copies (so the site no longer depends on the brands' servers).
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const file = new URL('../src/data/products.js', import.meta.url)
const outDir = new URL('../public/products/', import.meta.url)
let source = await readFile(file, 'utf8')
await mkdir(outDir, { recursive: true })

const pattern = /id: '([^']+)',\n(\s+brand: '[^']*',\n\s+)image: '(https:\/\/[^']+)'/g
const jobs = [...source.matchAll(pattern)]
let ok = 0
for (const [whole, id, middle, url] of jobs) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('HTTP ' + response.status)
    const ext = (new URL(url).pathname.match(/\.(png|jpe?g|webp)$/i)?.[1] || 'jpg').toLowerCase()
    await writeFile(new URL(`${id}.${ext}`, outDir), Buffer.from(await response.arrayBuffer()))
    source = source.replace(whole, `id: '${id}',\n${middle}image: '/products/${id}.${ext}'`)
    ok++
    console.log('saved', id)
  } catch (error) {
    console.warn('FAILED', id, error.message)
  }
}
await writeFile(file, source)
console.log(`${ok}/${jobs.length} images saved to public/products`)
