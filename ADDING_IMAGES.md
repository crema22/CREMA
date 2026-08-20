# Adding Product Images

The gallery is built and working, but it only shows arrows and thumbnails when a
product has **more than one** image. Right now every product has a single
placeholder, so you'll see one static image until you add real ones.

## How images are stored

Two columns on the `products` table:

| Column | Type | Holds |
|---|---|---|
| `main_image_url` | text | The primary image. Shown on cards and first in the gallery. |
| `gallery_images` | text array | Additional images. Appended after the main one. |

The gallery combines them: `[main_image_url, ...gallery_images]`.

## Step 1 — Create a storage bucket (once)

1. Supabase dashboard → **Storage**
2. **New bucket**, name it `product-images`
3. Tick **Public bucket** — required, or the browser can't load the files
4. **Create**

## Step 2 — Upload

1. Open the `product-images` bucket
2. **Upload file**, select your images
3. Click an uploaded file → **Copy URL**

The URL looks like:
`https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/frother-1.jpg`

## Step 3 — Attach to a product

**Table Editor** → `products` → click the row.

For the main image, paste the URL into `main_image_url`.

For extra images, `gallery_images` needs Postgres array syntax:

```
{"https://…/frother-2.jpg","https://…/frother-3.jpg"}
```

Curly braces, each URL in double quotes, comma separated, no trailing comma.

Or do it in the SQL Editor, which is less fiddly:

```sql
UPDATE products
SET
  main_image_url = 'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/frother-1.jpg',
  gallery_images = ARRAY[
    'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/frother-2.jpg',
    'https://YOUR-PROJECT.supabase.co/storage/v1/object/public/product-images/frother-3.jpg'
  ]
WHERE slug = 'usb-c-milk-frother';
```

Changes appear immediately — no redeploy.

## What the gallery does

- **One image** — plain static image, no controls
- **Two or more** — left/right arrows, clickable thumbnails, position dots
- **Keyboard** — click the image, then arrow keys
- **Mobile** — swipe left/right
- **Screen readers** — announces "Image 2 of 4"

## Practical notes

- Square images work best; the frame is 1:1 and crops with `object-cover`
- Around 1000×1000px is plenty
- Keep files under ~300KB — images aren't optimised yet (that's a P1 item), so large files load slowly
- Order matters: `gallery_images` displays in array order
- Test one product first before doing all ten
