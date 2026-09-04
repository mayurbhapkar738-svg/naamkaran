# Naamkaran — deploying

## The eleven files to upload

All eleven go in the same folder, at the root of the site. Nothing is nested.

```
index.html
config.js
places.js
pincode.js
family.js
about.js
nakshatra.js
panchang.js
traditions.js
sky.js
app.js
```

`index.html` loads the ten scripts in a fixed order (`config` first, `app` last).
Don't reorder them: `app.js` reads globals the others define, and `panchang.js`
needs `nakshatra.js` already loaded.

## Do NOT upload

- **`preview.html`** — a single-file build of the same site, made so the whole
  thing renders inside a chat window. It has every script inlined. It is not the
  product and will drift out of date the moment you edit anything.
- **`tools/`** — checks and test suites. They run under Node, not in a browser,
  and serve no purpose on the server.

## Steps for GitHub Pages

1. Copy the eleven files into your repo root, replacing what is there.
2. Open `config.js` and confirm both URLs. `WORKER_URL` has no trailing slash.
   `SITE_URL` must match where the site actually lives, because shared shortlist
   links are built from it.
3. Commit and push. Pages redeploys on its own in a minute or two.
4. Open the site in a private window — a normal window may show your own
   autofilled entries from testing and look like the form is prefilled.

## Before you push

```
node tools/check-html.js index.html
node tools/check-print.js index.html
node tools/check-empty.js index.html
node tools/test-e2e.js
node tools/test-names.js
```

The three `check-*` scripts each exist because of a bug that shipped past every
other test:

- **check-html** — a stray `</div>` closed `.wrap` early, which threw the rest
  of the page outside it. It lost `z-index`, the fixed sky canvas painted over
  it, and the site looked blank. Browsers recover from mismatched tags silently,
  so there was no error to see.
- **check-print** — the sheet sat inside `<form>`, and the print stylesheet hides
  the form to strip the input fields. Printing gave a blank page while the screen
  looked perfect.
- **check-empty** — the preview build prefills a sample birth, and that file is
  easy to deploy by mistake.

## Two things I could not test

**The Worker.** I have no access to it, so nothing here checks what your backend
actually returns — whether the names suit the tradition, whether the meanings are
right, or whether the starting syllable is honoured. The page now survives a
malformed response gracefully, but that is not the same as the response being
good. Worth going through a few results by hand per tradition.

**The Hindi and Marathi copy.** Written carefully, but not by a native speaker,
and much of it concerns religious practice. Have someone read it before families
do. The infrastructure is done, so it is an editing pass over `about.js` and
`traditions.js`, not an engineering job.

## One security note

`config.js` is served to the browser, so everything in it is public. It currently
holds only two URLs, which is fine. Never put an API key in it, or in any file
here — keys belong in the Worker's environment variables. If the Gemini key is
currently anywhere in this repo, rotate it.
