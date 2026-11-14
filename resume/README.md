# Resume source and verification

The current resume is authored from the verified November 13, 2026 profile in `Harshit_Teotia_Resume.tex`. The compiled copy is `Harshit_Teotia_Resume.pdf`; the identical production asset remains at `public/resume/Harshit_Teotia_Resume.pdf`.

The source uses the standard article class, Latin Modern fonts, geometry, enumitem, titlesec, and hyperref. It is PDFLaTeX-compatible, single-column A4 with a 10pt body and 0.35-inch vertical / 0.5-inch horizontal margins. No photo, icon font, raster screenshot, or chart is embedded.

## Build

On Windows, run `npm run resume:build`. The script prefers an installed PDFLaTeX executable, or accepts a Tectonic compiler:

```powershell
powershell -NoProfile -File scripts/build-resume.ps1 -Compiler 'C:\path\to\tectonic.exe'
```

On other platforms, compile the same source directly, then copy the PDF to the production asset path:

```sh
mkdir -p resume/build
pdflatex -interaction=nonstopmode -halt-on-error -output-directory=resume/build resume/Harshit_Teotia_Resume.tex
cp resume/build/Harshit_Teotia_Resume.pdf resume/Harshit_Teotia_Resume.pdf
cp resume/build/Harshit_Teotia_Resume.pdf public/resume/Harshit_Teotia_Resume.pdf
```

Phase 3 used the official portable Tectonic 0.17.0 compiler (XeTeX-based) because PDFLaTeX was not installed. Actual execution with PDFLaTeX was not performed; no XeTeX-only fontspec or system-font dependency is used. Tectonic caches required TeX packages locally. Its Fontconfig warning did not prevent embedded Latin Modern fonts, correct extraction, or visual verification.

## Inspect

The optional inspection tools are isolated from the app dependencies:

```sh
npm install --prefix .tools/pdf --no-save --package-lock=false --ignore-scripts pdfjs-dist @napi-rs/canvas
npm run resume:verify
```

The verifier checks one A4 page, required facts, absence of stale employment/title claims, four clickable links, safe text bounds, absence of raster image operators, and identical source/public PDFs. It writes extraction, a rendered PNG, and verification JSON under `docs/qa/phase-3/`. Inspect the PNG and compiler log after any content/layout change. Compilation rejects overfull layout boxes before replacing the public asset.

These checks establish text extraction and a conventional ATS-friendly structure; no commercial ATS ranking or parsing score is claimed.
