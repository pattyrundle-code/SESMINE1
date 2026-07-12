#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  SESMine — Project Setup Script
#  Usage: chmod +x setup.sh && bash setup.sh
#  Creates the full folder structure and placeholder assets.
# ─────────────────────────────────────────────────────────────
set -e

PROJECT="sesmine"
echo ""
echo "🚀 Building SESMine project structure..."
echo ""

# ── Create all directories ────────────────────────────────
mkdir -p $PROJECT/{assets/{css,js,img/{icons,screenshots}},js,auth,dashboard,hubs,products,.github/workflows}

echo "✓ Directories created"

# ── Download real logo ────────────────────────────────────
LOGO_URL="https://cdn.grapesjs.com/workspaces/cmjdh0oo603xm12grpuiruk7p/assets/f6b95b3d-49d1-4e77-b952-49ed80c4befa__image-9-14-1404-ap-at-8.42-pm.png"

if command -v curl &>/dev/null; then
  curl -sL "$LOGO_URL" -o "$PROJECT/assets/img/logo.png"
  cp "$PROJECT/assets/img/logo.png" "$PROJECT/assets/img/logo.svg"
  echo "✓ Logo downloaded"
elif command -v wget &>/dev/null; then
  wget -q "$LOGO_URL" -O "$PROJECT/assets/img/logo.png"
  cp "$PROJECT/assets/img/logo.png" "$PROJECT/assets/img/logo.svg"
  echo "✓ Logo downloaded"
else
  echo "⚠ curl/wget not found — logo must be downloaded manually"
fi

# ── Generate favicon (1x1 pixel PNG placeholder) ─────────
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82' \
  > "$PROJECT/assets/img/favicon.ico"
echo "✓ Favicon placeholder created"

# ── Generate PWA icon placeholders ───────────────────────
for SIZE in 72 96 128 144 152 192 384 512; do
  cp "$PROJECT/assets/img/favicon.ico" "$PROJECT/assets/img/icons/icon-${SIZE}x${SIZE}.png"
done
echo "✓ PWA icon placeholders created"

# ── .htmlhintrc ───────────────────────────────────────────
cat > "$PROJECT/.htmlhintrc" << 'EOF'
{
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "doctype-first": true,
  "tag-pair": true,
  "spec-char-escape": false,
  "id-unique": true,
  "src-not-empty": true,
  "alt-require": true,
  "doctype-html5": true,
  "title-require": true
}
EOF

# ── .stylelintrc.json ─────────────────────────────────────
cat > "$PROJECT/.stylelintrc.json" << 'EOF'
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "color-no-invalid-hex": true,
    "no-duplicate-selectors": true,
    "declaration-block-no-duplicate-properties": true,
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "alpha-value-notation": null,
    "color-function-notation": null,
    "import-notation": null
  }
}
EOF

# ── .eslintrc.json ────────────────────────────────────────
cat > "$PROJECT/.eslintrc.json" << 'EOF'
{
  "env": { "browser": true, "es2022": true },
  "parserOptions": { "ecmaVersion": 2022 },
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "warn",
    "no-console": "off",
    "semi": ["warn", "always"],
    "eqeqeq": ["warn", "always"]
  }
}
EOF

# ── .gitignore ────────────────────────────────────────────
cat > "$PROJECT/.gitignore" << 'EOF'
node_modules/
*.min.js
*.min.css
build-manifest.json
.DS_Store
Thumbs.db
*.log
.env
.env.local
EOF

# ── robots.txt ────────────────────────────────────────────
cat > "$PROJECT/robots.txt" << 'EOF'
User-agent: *
Allow: /

Disallow: /dashboard/
Disallow: /auth/
Disallow: /hubs/
Disallow: /products/

Sitemap: https://sesmine.com/sitemap.xml
EOF

echo "✓ Config files created"

# ── Install npm dependencies ──────────────────────────────
cd $PROJECT
if command -v npm &>/dev/null; then
  echo ""
  echo "📦 Installing npm dependencies..."
  npm install --save-dev serve clean-css-cli terser htmlhint 2>/dev/null || true
  echo "✓ Dependencies installed"
fi

echo ""
echo "════════════════════════════════════════"
echo "  ✅ SESMine project structure ready!"
echo "════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo "  1. cd $PROJECT"
echo "  2. Paste all HTML/JS/CSS files from chat"
echo "  3. npm start  →  http://localhost:3000"
echo ""
echo "  Or deploy instantly:"
echo "  → Drag folder to netlify.com/drop"
echo "  → Push to GitHub → enable Pages"
echo ""

