/* ══════════════════════════════════════════════════════════════════
   WIZARD — Paint & More Color Selection Flow
   Depends on: app.js (handleFile, setProjectType, generatePrompt,
               addColorRow, selectKMColor, openColorPickerDropdown,
               runWorkflow, showToast, KM_COLORS, PALETTE_DATA)
   ══════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────
   STATE
─────────────────────────────────────────────────────────────── */
const WizardState = {
  currentStep: 1,
  completed: { 1: false, 2: false, 3: false, 4: false, 5: false },

  uploadedImage: null,
  uploadedImageName: null,

  projectType: null,

  favoriteColors: [],
  dislikedColors: [],

  recommendedPalettes: [],
  selectedPalette: null,

  colorTargets: { wall: null, trim: null, door: null },
  generatedPrompt: null
};

/* ───────────────────────────────────────────────────────────────
   COLOR UTILITY
─────────────────────────────────────────────────────────────── */
function wzHexToHsl(hex) {
  hex = hex.replace('#', '');
  if (hex.length !== 6) return [0, 0, 0.5];
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0)
        : max === g ? (b - r) / d + 2
        : (r - g) / d + 4;
  return [h / 6, s, l];
}

function wzHueDiff(h1, h2) {
  const d = Math.abs(h1 - h2);
  return Math.min(d, 1 - d);
}

function wzColorNameToHex(name) {
  const n = name.trim().toLowerCase();
  const NAMED = {
    'white': '#F8F8F8', 'off white': '#F5F0E8', 'cream': '#FFF8E7',
    'beige': '#F5F0DC', 'warm beige': '#E8D5B0', 'tan': '#D2B48C',
    'light gray': '#D3D3D3', 'gray': '#808080', 'dark gray': '#404040',
    'black': '#1A1A1A', 'navy': '#0A2342', 'blue': '#3A7CC1',
    'light blue': '#87CEEB', 'teal': '#008B8B', 'green': '#3A7D44',
    'sage': '#8A9E7A', 'olive': '#6B6B3A', 'yellow': '#FFD700',
    'gold': '#C9A84C', 'orange': '#E87722', 'coral': '#FF6B6B',
    'red': '#C0392B', 'burgundy': '#800020', 'pink': '#F4A7B9',
    'lavender': '#B57EDC', 'purple': '#7B2FBE', 'brown': '#8B5E3C',
    'taupe': '#B09A7A', 'charcoal': '#36454F',
  };
  return NAMED[n] || NAMED[n.split(' ').pop()] || '#888888';
}

/* ───────────────────────────────────────────────────────────────
   STEP NAVIGATION
─────────────────────────────────────────────────────────────── */
function wzGoTo(step) {
  // Only allow going to a step if all previous steps are done
  for (let i = 1; i < step; i++) {
    if (!WizardState.completed[i]) return;
  }

  const prev = WizardState.currentStep;
  WizardState.currentStep = step;

  // Update panels
  document.querySelectorAll('.wz-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('wzPanel' + step);
  if (target) target.classList.add('active');

  // Update progress indicators
  document.querySelectorAll('.wz-step-item').forEach((el, idx) => {
    const s = idx + 1;
    el.classList.toggle('active', s === step);
    el.classList.toggle('done', WizardState.completed[s]);
  });

  // Update connectors
  document.querySelectorAll('.wz-step-connector').forEach((el, idx) => {
    el.classList.toggle('done', WizardState.completed[idx + 1]);
  });

  // Step-specific init
  if (step === 4 && prev !== 4) wzInitStep4();
  if (step === 5 && prev !== 5) wzInitStep5();
}

function wzCompleteStep(step) {
  WizardState.completed[step] = true;
  wzGoTo(step + 1);
}

/* ───────────────────────────────────────────────────────────────
   STEP 1 — UPLOAD IMAGE
─────────────────────────────────────────────────────────────── */
function wzInitStep1() {
  const zone      = document.getElementById('wzUploadZone');
  const fileInput = document.getElementById('fileInput');
  const removeBtn = document.getElementById('wzRemoveBtn');

  if (!zone || !fileInput) return;

  // Wizard zone triggers existing fileInput — app.js listener handles handleFile()
  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('dragover',  (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault(); zone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) {
      // app.js drag-drop is on hidden #uploadZone — trigger fileInput directly
      if (typeof handleFile === 'function') handleFile(e.dataTransfer.files[0]);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      WizardState.uploadedImage    = null;
      WizardState.uploadedImageName = null;
      WizardState.completed[1]     = false;
      const pb = document.getElementById('wzPreviewBox');
      if (pb) pb.style.display = 'none';
      zone.style.display = 'block';
      fileInput.value = '';
      // Also clear app.js state
      if (typeof removeImage === 'function') removeImage();
      wzUpdateProgress();
      const btn = document.getElementById('wzNext1');
      if (btn) btn.disabled = true;
    });
  }
}

function wzMarkUploadDone() {
  WizardState.completed[1] = true;
  wzUpdateProgress();
  const btn = document.getElementById('wzNext1');
  if (btn) btn.disabled = false;
}

/* ───────────────────────────────────────────────────────────────
   STEP 2 — PROJECT TYPE
─────────────────────────────────────────────────────────────── */
function wzSelectProjectType(type) {
  WizardState.projectType = type;
  WizardState.completed[2] = true;

  // Sync with app.js
  if (typeof setProjectType === 'function') setProjectType(type);

  // Update card UI
  document.querySelectorAll('.wz-type-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.type === type);
  });

  wzUpdateProgress();
  const btn = document.getElementById('wzNext2');
  if (btn) btn.disabled = false;
}

/* ───────────────────────────────────────────────────────────────
   STEP 3 — COLOR PREFERENCES
─────────────────────────────────────────────────────────────── */
const WZ_PRESETS_FAV = [
  { name: 'White', hex: '#F8F8F8' },
  { name: 'Cream', hex: '#FFF8E7' },
  { name: 'Warm Beige', hex: '#E8D5B0' },
  { name: 'Light Gray', hex: '#D3D3D3' },
  { name: 'Sage Green', hex: '#8A9E7A' },
  { name: 'Navy Blue', hex: '#0A2342' },
  { name: 'Soft Blue', hex: '#87CEEB' },
  { name: 'Taupe', hex: '#B09A7A' },
];

const WZ_PRESETS_DIS = [
  { name: 'Orange', hex: '#E87722' },
  { name: 'Purple', hex: '#7B2FBE' },
  { name: 'Bright Yellow', hex: '#FFD700' },
  { name: 'Hot Pink', hex: '#FF69B4' },
  { name: 'Dark Green', hex: '#1B5E20' },
  { name: 'Brown', hex: '#8B5E3C' },
];

function wzRenderPresets() {
  const favContainer = document.getElementById('wzFavPresets');
  const disContainer = document.getElementById('wzDisPresets');

  if (favContainer) {
    favContainer.innerHTML = WZ_PRESETS_FAV.map(p => `
      <div class="wz-preset-chip" onclick="wzAddFavorite('${p.name}','${p.hex}')">
        <div class="wz-preset-dot" style="background:${p.hex}"></div>
        ${p.name}
      </div>
    `).join('');
  }

  if (disContainer) {
    disContainer.innerHTML = WZ_PRESETS_DIS.map(p => `
      <div class="wz-preset-chip" onclick="wzAddDisliked('${p.name}','${p.hex}')">
        <div class="wz-preset-dot" style="background:${p.hex}"></div>
        ${p.name}
      </div>
    `).join('');
  }
}

function wzAddFavorite(name, hex) {
  name = name.trim();
  if (!name) return;
  if (!hex) hex = wzColorNameToHex(name);
  if (WizardState.favoriteColors.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
  WizardState.favoriteColors.push({ name, hex });
  wzRenderColorTags();
}

function wzRemoveFavorite(name) {
  WizardState.favoriteColors = WizardState.favoriteColors.filter(c => c.name !== name);
  wzRenderColorTags();
}

function wzAddDisliked(name, hex) {
  name = name.trim();
  if (!name) return;
  if (!hex) hex = wzColorNameToHex(name);
  if (WizardState.dislikedColors.find(c => c.name.toLowerCase() === name.toLowerCase())) return;
  WizardState.dislikedColors.push({ name, hex });
  wzRenderColorTags();
}

function wzRemoveDisliked(name) {
  WizardState.dislikedColors = WizardState.dislikedColors.filter(c => c.name !== name);
  wzRenderColorTags();
}

function wzRenderColorTags() {
  const favEl = document.getElementById('wzFavTags');
  const disEl = document.getElementById('wzDisTags');

  if (favEl) {
    favEl.innerHTML = WizardState.favoriteColors.map(c => `
      <div class="wz-color-tag">
        <div class="wz-tag-dot" style="background:${c.hex}"></div>
        <span>${c.name}</span>
        <button class="wz-tag-remove" onclick="wzRemoveFavorite('${c.name.replace(/'/g, "\\'")}')" title="Xóa">✕</button>
      </div>
    `).join('');
  }

  if (disEl) {
    disEl.innerHTML = WizardState.dislikedColors.map(c => `
      <div class="wz-color-tag">
        <div class="wz-tag-dot" style="background:${c.hex}"></div>
        <span>${c.name}</span>
        <button class="wz-tag-remove" onclick="wzRemoveDisliked('${c.name.replace(/'/g, "\\'")}')" title="Xóa">✕</button>
      </div>
    `).join('');
  }
}

function wzInitStep3() {
  wzRenderPresets();

  const favInput = document.getElementById('wzFavInput');
  const favBtn = document.getElementById('wzFavAdd');
  const disInput = document.getElementById('wzDisInput');
  const disBtn = document.getElementById('wzDisAdd');

  function addFav() {
    const val = favInput ? favInput.value.trim() : '';
    if (val) { wzAddFavorite(val, null); if (favInput) favInput.value = ''; }
  }
  function addDis() {
    const val = disInput ? disInput.value.trim() : '';
    if (val) { wzAddDisliked(val, null); if (disInput) disInput.value = ''; }
  }

  if (favBtn) favBtn.addEventListener('click', addFav);
  if (favInput) favInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addFav(); } });
  if (disBtn) disBtn.addEventListener('click', addDis);
  if (disInput) disInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addDis(); } });
}

/* ───────────────────────────────────────────────────────────────
   STEP 4 — PALETTE GENERATION
─────────────────────────────────────────────────────────────── */
function wzInitStep4() {
  const container = document.getElementById('wzPaletteContainer');
  if (!container) return;

  if (!window.PALETTE_DATA) {
    container.innerHTML = '<div class="wz-palette-loading">Đang tải dữ liệu màu...</div>';
    return;
  }

  container.innerHTML = '<div class="wz-palette-loading">Đang tạo bảng màu gợi ý...</div>';

  // Generate asynchronously so UI doesn't block
  setTimeout(() => {
    try {
      const palettes = wzGeneratePalettes();
      WizardState.recommendedPalettes = palettes;
      wzRenderPalettes(container, palettes);
    } catch (e) {
      container.innerHTML = '<div class="wz-palette-loading">Không thể tạo bảng màu. Vui lòng thử lại.</div>';
      console.error('[Wizard] Palette generation failed:', e);
    }
  }, 80);
}

function wzGeneratePalettes() {
  const data = window.PALETTE_DATA;
  const isInterior = WizardState.projectType === 'interior';
  const favHsls = WizardState.favoriteColors.map(c => wzHexToHsl(c.hex));
  const disHsls = WizardState.dislikedColors.map(c => wzHexToHsl(c.hex));

  const all = [];
  for (const [brand, colors] of Object.entries(data)) {
    const combos = wzBuildCombos(brand, colors, isInterior, favHsls, disHsls, 8);
    all.push(...combos);
  }
  return all;
}

function wzScoreColor(hsl, favHsls, disHsls) {
  const [h, s, l] = hsl;

  // Disliked: hard reject if hue is close (18% = ~65°), even at low saturation
  for (const [dh, ds] of disHsls) {
    if (wzHueDiff(h, dh) < 0.18) return -1;
  }

  // Base score starts at 0 — must earn points via fav proximity
  let score = favHsls.length === 0 ? 50 : 0;

  for (const [fh, fs, fl] of favHsls) {
    const hd = wzHueDiff(h, fh);
    // Strong hue match: up to 80 points within 20% of circle (~72°)
    if (hd < 0.20) score += (1 - hd / 0.20) * 80;
    // Complementary/analogous bonus: 15% to 35% away = harmonious range
    else if (hd >= 0.15 && hd <= 0.35) score += 15;
    // Same lightness zone bonus
    const ld = Math.abs(l - fl);
    if (ld < 0.25) score += (1 - ld / 0.25) * 15;
  }

  return score;
}

function wzBuildCombos(brand, rawColors, isInterior, favHsls, disHsls, count) {
  // Precompute HSL + scores
  // Min score: 0 if no favorites (open palette), 10 if favorites set (must have some affinity)
  const minScore = favHsls.length > 0 ? 10 : 0;

  const scored = rawColors
    .map(c => {
      const hsl = wzHexToHsl(c.hex);
      const score = wzScoreColor(hsl, favHsls, disHsls);
      return { ...c, hsl, score };
    })
    .filter(c => {
      if (c.score < 0) return false; // hard disliked
      if (c.hsl[2] <= 0.06 || c.hsl[2] >= 0.97) return false;
      // Neutrals (low saturation) always pass — they work as secondary/trim in any palette
      if (c.hsl[1] < 0.12) return true;
      return c.score >= minScore;
    });

  // Bucket by role based on lightness
  const lights  = scored.filter(c => c.hsl[2] > 0.72).sort((a, b) => b.score - a.score);
  const mids    = scored.filter(c => c.hsl[2] >= 0.28 && c.hsl[2] <= 0.72).sort((a, b) => b.score - a.score);
  const darks   = scored.filter(c => c.hsl[2] < 0.28 && c.hsl[1] > 0.05).sort((a, b) => b.score - a.score);

  // For exterior: prefer muted, earthy primaries; interior: allow more variety
  const primaryPool = isInterior
    ? mids
    : mids.filter(c => c.hsl[1] < 0.55); // muted tones for exteriors

  const combos = [];
  const usedHueBuckets = new Set();

  for (const primary of primaryPool) {
    if (combos.length >= count) break;

    const phBucket = Math.round(primary.hsl[0] * 12);
    if (usedHueBuckets.has(phBucket)) continue;
    usedHueBuckets.add(phBucket);

    // Secondary: neutral/light, hue close to primary or low saturation
    // Must not be a disliked hue
    const secondary =
      lights.find(c =>
        c.hsl[1] < 0.15 ||
        wzHueDiff(c.hsl[0], primary.hsl[0]) < 0.12
      ) || lights[0];

    if (!secondary) continue;

    // Accent: harmonious contrast — prefer analogous (15-35%) or complementary (45-55%)
    // Never use disliked hues (score === -1 means already filtered out of scored pool)
    const accentPool = [...darks, ...mids].filter(c => {
      const hd = wzHueDiff(c.hsl[0], primary.hsl[0]);
      return c !== primary && (hd > 0.12 && hd < 0.55);
    });
    const accent = accentPool.sort((a, b) => b.score - a.score)[0] ||
      darks[0] || mids[mids.length - 1];

    if (!accent) continue;

    combos.push({
      id: `${brand}-${combos.length + 1}`,
      brand,
      comboNum: combos.length + 1,
      primary,
      secondary,
      accent
    });
  }

  // Pad to count with alternate picks if needed
  if (combos.length < Math.min(count, 4)) {
    for (let i = combos.length; i < Math.min(count, mids.length) && combos.length < count; i++) {
      const primary = mids[i * 2] || mids[i];
      if (!primary || combos.find(c => c.primary === primary)) continue;
      const secondary = lights[i % lights.length] || lights[0];
      const accent = darks[i % Math.max(darks.length, 1)] || mids[mids.length - 1 - i];
      if (!secondary || !accent) continue;
      combos.push({ id: `${brand}-alt${i}`, brand, comboNum: combos.length + 1, primary, secondary, accent });
    }
  }

  return combos;
}

function wzRenderPalettes(container, palettes) {
  if (!palettes.length) {
    container.innerHTML = '<div class="wz-palette-loading">Không có bảng màu phù hợp. Hãy thử thay đổi sở thích màu.</div>';
    return;
  }

  // Group by brand
  const byBrand = {};
  for (const p of palettes) {
    if (!byBrand[p.brand]) byBrand[p.brand] = [];
    byBrand[p.brand].push(p);
  }

  const brandOrder = ['Kelly Moore', 'Behr', 'Benjamin Moore', 'Sherwin-Williams'];

  container.innerHTML = '';
  for (const brand of brandOrder) {
    const combos = byBrand[brand];
    if (!combos || combos.length === 0) continue;

    const section = document.createElement('div');
    section.className = 'wz-palette-brand-section';

    const label = document.createElement('div');
    label.className = 'wz-brand-label';
    label.textContent = brand;
    section.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'wz-palette-grid';

    for (const combo of combos) {
      const card = wzCreatePaletteCard(combo);
      grid.appendChild(card);
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

function wzCreatePaletteCard(combo) {
  const card = document.createElement('div');
  card.className = 'palette-card';
  card.dataset.id = combo.id;

  const shortName = (name) => name.length > 18 ? name.slice(0, 17) + '…' : name;

  card.innerHTML = `
    <div class="palette-swatches">
      <div class="palette-swatch primary" style="background:${combo.primary.hex}" title="Tường: ${combo.primary.name}"></div>
      <div class="palette-swatch" style="background:${combo.secondary.hex}" title="Viền: ${combo.secondary.name}"></div>
      <div class="palette-swatch" style="background:${combo.accent.hex}" title="Cửa: ${combo.accent.name}"></div>
    </div>
    <div class="palette-card-info">
      <div class="palette-card-num">Combo #${combo.comboNum}</div>
      <div class="palette-card-colors">
        <div class="palette-card-color-row">
          <div class="palette-card-color-dot" style="background:${combo.primary.hex}"></div>
          <span class="palette-card-color-role">Tường</span>
          <span class="palette-card-color-name">${shortName(combo.primary.name)}</span>
        </div>
        <div class="palette-card-color-row">
          <div class="palette-card-color-dot" style="background:${combo.secondary.hex}"></div>
          <span class="palette-card-color-role">Viền</span>
          <span class="palette-card-color-name">${shortName(combo.secondary.name)}</span>
        </div>
        <div class="palette-card-color-row">
          <div class="palette-card-color-dot" style="background:${combo.accent.hex}"></div>
          <span class="palette-card-color-role">Cửa</span>
          <span class="palette-card-color-name">${shortName(combo.accent.name)}</span>
        </div>
      </div>
    </div>
  `;

  card.addEventListener('click', () => wzSelectPaletteCard(combo));
  return card;
}

function wzSelectPaletteCard(combo) {
  WizardState.selectedPalette = combo;
  WizardState.completed[4] = true;

  // Update card selection UI
  document.querySelectorAll('.palette-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === combo.id);
  });

  wzUpdateProgress();

  // Auto-advance after short delay for feedback
  setTimeout(() => wzGoTo(5), 300);
}

/* ───────────────────────────────────────────────────────────────
   STEP 5 — APPLY & RUN
─────────────────────────────────────────────────────────────── */
function wzInitStep5() {
  const palette = WizardState.selectedPalette;
  if (!palette) return;

  // Update summary swatches
  wzRenderStep5Summary(palette);

  // Apply palette to app.js colorTargets
  wzApplyPaletteToColorTargets(palette);

  // Regenerate prompt
  if (typeof generatePrompt === 'function') generatePrompt();
  if (typeof updateAddRowBtn === 'function') updateAddRowBtn();
  WizardState.completed[5] = true;
  wzUpdateProgress();
}

function wzRenderStep5Summary(palette) {
  const el = document.getElementById('wzSelectedSummary');
  if (!el) return;

  el.innerHTML = `
    <div class="wz-summary-swatches">
      <div class="wz-summary-swatch" style="background:${palette.primary.hex}" title="Primary"></div>
      <div class="wz-summary-swatch" style="background:${palette.secondary.hex}" title="Secondary"></div>
      <div class="wz-summary-swatch" style="background:${palette.accent.hex}" title="Accent"></div>
    </div>
    <div class="wz-summary-info">
      <div class="wz-summary-brand">${palette.brand}</div>
      <div class="wz-summary-combo">Combo #${palette.comboNum}</div>
      <div class="wz-summary-change" onclick="wzGoTo(4)">← Đổi combo</div>
    </div>
  `;
}

function wzApplyPaletteToColorTargets(palette) {
  // Map: row 0 = walls (primary), row 1 = trim (secondary), row 2 = doors (accent)
  const assignments = [
    { idx: 0, area: 'walls, texture, large-sized material', colorObj: palette.primary },
    { idx: 1, area: 'trims/vignette', colorObj: palette.secondary },
    { idx: 2, area: 'doors/windows', colorObj: palette.accent },
  ];

  for (const { idx, area, colorObj } of assignments) {
    const areaEl  = document.getElementById('area' + idx);
    const valEl   = document.getElementById('val' + idx);
    const dotEl   = document.getElementById('dot' + idx);
    const pickEl  = document.getElementById('col' + idx);

    if (areaEl) areaEl.value = area;
    if (valEl)  valEl.value = colorObj.name;
    if (dotEl) {
      dotEl.style.background   = colorObj.hex;
      dotEl.style.borderColor  = colorObj.hex;
    }
    if (pickEl) {
      pickEl.style.backgroundColor = colorObj.hex;
    }
  }

  // Store in WizardState
  WizardState.colorTargets = {
    wall: palette.primary,
    trim: palette.secondary,
    door: palette.accent
  };

  // Sync prompt
  if (typeof generatePrompt === 'function') generatePrompt();
}

/* ───────────────────────────────────────────────────────────────
   PROGRESS INDICATOR UPDATE
─────────────────────────────────────────────────────────────── */
function wzUpdateProgress() {
  document.querySelectorAll('.wz-step-item').forEach((el, idx) => {
    const s = idx + 1;
    el.classList.toggle('active', s === WizardState.currentStep);
    el.classList.toggle('done', WizardState.completed[s] && s !== WizardState.currentStep);
  });

  document.querySelectorAll('.wz-step-connector').forEach((el, idx) => {
    el.classList.toggle('done', WizardState.completed[idx + 1]);
  });

  // Update bubble icons
  document.querySelectorAll('.wz-step-item').forEach((el, idx) => {
    const s = idx + 1;
    const bubble = el.querySelector('.wz-step-bubble');
    if (!bubble) return;
    if (WizardState.completed[s]) {
      bubble.textContent = '✓';
    } else {
      bubble.textContent = s;
    }
  });
}

/* ───────────────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Init step 1 UI handlers
  wzInitStep1();

  // Patch app.js handleFile to update wizard preview when upload completes
  const _origHandleFile = window.handleFile;
  if (typeof _origHandleFile === 'function') {
    window.handleFile = function(file) {
      _origHandleFile(file);
      // handleFile uses FileReader (async) — poll uploadedImageBase64 set by app.js
      const zone = document.getElementById('wzUploadZone');
      const previewBox = document.getElementById('wzPreviewBox');
      const previewImg = document.getElementById('wzPreviewImg');
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (typeof uploadedImageBase64 !== 'undefined' && uploadedImageBase64) {
          clearInterval(poll);
          WizardState.uploadedImage     = uploadedImageBase64;
          WizardState.uploadedImageName = uploadedImageName;
          if (previewImg)  previewImg.src     = WizardState.uploadedImage;
          if (previewBox)  previewBox.style.display = 'block';
          if (zone)        zone.style.display = 'none';
          wzMarkUploadDone();
        } else if (attempts > 100) {
          clearInterval(poll);
        }
      }, 30);
    };
  }

  // Patch removeImage to reset wizard step 1
  const _origRemoveImage = window.removeImage;
  if (typeof _origRemoveImage === 'function') {
    window.removeImage = function() {
      _origRemoveImage();
      WizardState.uploadedImage     = null;
      WizardState.uploadedImageName = null;
      WizardState.completed[1]      = false;
      const wzPB = document.getElementById('wzPreviewBox');
      const wzUZ = document.getElementById('wzUploadZone');
      if (wzPB) wzPB.style.display = 'none';
      if (wzUZ) wzUZ.style.display = 'block';
      const btn = document.getElementById('wzNext1');
      if (btn) btn.disabled = true;
      wzUpdateProgress();
    };
  }

  // Patch loadHistoryItem to update wizard preview
  const _origLoadHistoryItem = window.loadHistoryItem;
  if (typeof _origLoadHistoryItem === 'function') {
    window.loadHistoryItem = function(id) {
      _origLoadHistoryItem(id);
      setTimeout(() => {
        if (typeof uploadedImageBase64 !== 'undefined' && uploadedImageBase64) {
          WizardState.uploadedImage     = uploadedImageBase64;
          WizardState.uploadedImageName = uploadedImageName;
          const wzPrevImg = document.getElementById('wzPreviewImg');
          const wzPrevBox = document.getElementById('wzPreviewBox');
          const wzUZ      = document.getElementById('wzUploadZone');
          if (wzPrevImg) wzPrevImg.src     = WizardState.uploadedImage;
          if (wzPrevBox) wzPrevBox.style.display = 'block';
          if (wzUZ)      wzUZ.style.display      = 'none';
          WizardState.completed[1] = true;
          WizardState.completed[2] = !!(typeof projectType !== 'undefined' && projectType);
          WizardState.projectType  = (typeof projectType !== 'undefined' && projectType) || 'exterior';
          wzMarkUploadDone();
          wzUpdateProgress();
        }
      }, 80);
    };
  }

  // Patch app.js setProjectType to sync wizard state
  const _origSetProjectType = window.setProjectType;
  if (typeof _origSetProjectType === 'function') {
    window.setProjectType = function(type) {
      _origSetProjectType(type);
      WizardState.projectType = type;
    };
  }

  // Init step 3 family grid
  wzInitStep3();

  // Start on step 1
  wzGoTo(1);

  // Progress step items are clickable (only backward or already-done steps)
  document.querySelectorAll('.wz-step-item').forEach((el, idx) => {
    el.addEventListener('click', () => {
      const s = idx + 1;
      if (WizardState.completed[s] || s <= WizardState.currentStep) wzGoTo(s);
    });
    el.style.cursor = 'pointer';
  });
});
