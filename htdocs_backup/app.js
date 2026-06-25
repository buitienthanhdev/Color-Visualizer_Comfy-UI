let uploadedImageBase64 = null;
let uploadedImageName = null;
let resultImageUrl = null;
let resultImageUrlNight = null;
let currentTab = 'result';
let recolorHistory = [];
let dayNightState = 'day';
let compareDayNightState = 'day';



let projectType = 'exterior';

const dayExteriorTemplate = `[TASK: Architectural Color Modification - Daylight]

[CRITICAL FACADE LOCK]: ABSOLUTELY DO NOT generate, invent, add, or draw any new structural elements, borders, panels, lines, frames, or moldings on the walls. Only recolor surfaces that ALREADY exist in the input image. If an element is not present in the original image, do not create it.

[SURFACE TARGETING — READ CAREFULLY]:
- [COLOR SPECIFICATIONS] entries are MANDATORY — they OVERRIDE all defaults below.
- ONLY apply new colors to the EXACT surfaces listed in [COLOR SPECIFICATIONS] below.
- Every surface NOT listed must retain its ORIGINAL color from the input image with zero modification.
- Roofs, glass/glazing, balcony railings: keep ORIGINAL color unless listed in [COLOR SPECIFICATIONS].
- When in doubt about an unlisted surface: DO NOT recolor. Preserve the original.

[COLOR SPECIFICATIONS]

[ENVIRONMENTAL RENDERING]:
- Sky: Clear light blue or transparent blue sky with high overall ambient brightness. Optional thin, wispy clouds allowed.
- Building & Materials: Paint color must be rendered with true real-world accuracy. Preserve the clear visibility of original wall textures, roughness, and material details (stone, brick, aluminum, glass).
- Shadows: Sharp, clean, and high-contrast natural shadows cast strictly according to a distinct sun direction.
- Landscape & Glass: Vegetation must be vibrant fresh green, reflecting natural sunlight. Parked vehicles must have headlights completely OFF. Glass windows must distinctly reflect the blue sky and environment.

[OUTPUT]: Perfect color visualization to evaluate true paint tone, color mixing ratios, and contrast without altering geometry.`;

const dayInteriorTemplate = `[TASK: Architectural Interior Color Modification - Daylight]

[CRITICAL INTERIOR LOCK]: ABSOLUTELY DO NOT alter, remove, or modify any furniture, stairs, railings, decorations, floors, or ceiling shapes. Keep the structural geometry 100% intact.

[SURFACE TARGETING — READ CAREFULLY]:
- [COLOR SPECIFICATIONS] entries are MANDATORY — they OVERRIDE all defaults below.
- ONLY apply new colors to the EXACT surfaces listed in [COLOR SPECIFICATIONS] below.
- Every surface NOT listed must retain its ORIGINAL color from the input image with zero modification.
- Stucco reliefs, ornamental moldings, carved decorations, ceiling roses, cornices: keep ORIGINAL color unless listed in [COLOR SPECIFICATIONS].
- Floors, furniture, curtains, bedding, lighting fixtures: keep ORIGINAL color unless listed in [COLOR SPECIFICATIONS].
- When in doubt about an unlisted surface: DO NOT recolor. Preserve the original.

[COLOR SPECIFICATIONS]

[DAYLIGHT INTERIOR LIGHTING]:
- Ambient Illumination: High overall ambient brightness. Bright natural daylight floods the room through windows and glass openings.
- Light & Shadows: Soft, diffused daylight casting realistic highlights and gentle, natural shadows. Preserve the texture, depth, and three-dimensionality of all interior spaces.
- Building & Materials: Paint color must be rendered with true real-world accuracy. Preserve the clear visibility of original wall textures, wood grain, marble veins, and fabric details.
- Windows & Views: Windows must look out into a bright daytime environment with realistic outdoor view transparency.

[OUTPUT]: Perfect interior color visualization to evaluate true paint tone, color mixing ratios, and contrast without altering geometry.`;

const nightExteriorTemplate = `[TASK: Architectural Color Modification - Nighttime]

[ABSOLUTE GEOMETRY PRESERVATION — HIGHEST PRIORITY]: The building's geometry, silhouette, facade layout, structural elements, window positions, balconies, columns, moldings, and all architectural details MUST remain 100% identical to the input image. Do NOT simplify, merge, add, remove, or distort any architectural feature. Every detail visible in the daytime version must remain present and recognizable under nighttime lighting.

[CRITICAL FACADE LOCK]: ABSOLUTELY DO NOT generate, invent, add, or draw any new structural elements. Only recolor surfaces that ALREADY exist in the input image.

[SURFACE TARGETING — READ CAREFULLY]:
- [COLOR SPECIFICATIONS] entries are MANDATORY — they OVERRIDE all defaults below.
- ONLY apply new colors to the EXACT surfaces listed in [COLOR SPECIFICATIONS] below.
- Every surface NOT listed must retain its ORIGINAL color from the input image with zero modification.
- Roofs, glass/glazing, balcony railings: keep ORIGINAL color unless listed in [COLOR SPECIFICATIONS].
- When in doubt about an unlisted surface: DO NOT recolor. Preserve the original.

[COLOR SPECIFICATIONS]

[DAYLIGHT SUPPRESSION]: Replace daylight sky and ambient sunlight with nighttime atmosphere. Do NOT erase or darken architectural details — only change the light source from sun to artificial.

[NIGHTTIME ENVIRONMENTAL RENDERING]:
- Sky: Deep indigo or dark navy blue sky. Must NOT be pitch black. Subtle lighting gradient near horizon.
- Lighting: Soft, localized artificial light sources illuminate the facade. Architectural details remain clearly visible under artificial light — they must NOT disappear into shadow.
- Active Lighting System: Interior rooms emit warm golden-yellow light (2700K–3200K) through windows. Balconies and entrance have ambient lighting. Ground floor brighter than upper floors.
- Wall Surfaces: All wall textures, material details, and surface relief must remain visible. Use soft fill light and ambient occlusion — do NOT plunge surfaces into total blackness.
- Landscape & Glass: Foliage appears dark but retains shape. Glass windows transparent, showing warm interior.

[OUTPUT STYLE]: Ultra-photorealistic architectural night photography. Every facade detail preserved and visible under artificial lighting. Natural dynamic range, warm cinematic ambience.`;

const nightInteriorTemplate = `[TASK: Architectural Interior Color Modification - Nighttime]

[ABSOLUTE GEOMETRY PRESERVATION — HIGHEST PRIORITY]: ALL furniture, stairs, railings, decorations, floors, ceilings, moldings, and every architectural element MUST remain 100% identical in shape, position, and proportion to the input image. Every interior detail must remain clearly visible and recognizable. Do NOT simplify, hide, or lose any element in shadow.

[CRITICAL INTERIOR LOCK]: ABSOLUTELY DO NOT alter, remove, or modify any furniture, stairs, railings, decorations, floors, or ceiling shapes.

[SURFACE TARGETING — READ CAREFULLY]:
- [COLOR SPECIFICATIONS] entries are MANDATORY — they OVERRIDE all defaults below.
- ONLY apply new colors to the EXACT surfaces listed in [COLOR SPECIFICATIONS] below.
- Every surface NOT listed must retain its ORIGINAL color from the input image with zero modification.
- Stucco reliefs, ornamental moldings, carved decorations, ceiling roses, cornices: keep ORIGINAL color unless listed in [COLOR SPECIFICATIONS].
- Floors, furniture, curtains, bedding, lighting fixtures: keep ORIGINAL color unless listed in [COLOR SPECIFICATIONS].
- When in doubt about an unlisted surface: DO NOT recolor. Preserve the original.

[COLOR SPECIFICATIONS]

[NIGHTTIME INTERIOR LIGHTING]:
- Ambient Illumination: Replace external daylight with warm artificial interior lighting. The room has full ambient brightness from ceiling fixtures, cove lights, chandeliers, and lamps — all interior surfaces remain clearly visible.
- Light Sources: Active lighting fixtures emit soft, warm golden glow (2700K–3000K) with realistic spill onto walls, ceilings, and floors. No area should be in total darkness — all surfaces retain visible detail.
- Ceiling & Cove Lights: Recessed LED strips and ceiling panels are ON, casting soft warm glow downward. All ceiling details, cornices, and cove shapes remain fully visible.
- Wall & Surface Detail: All wall textures, material grain, and painted surfaces must remain clearly distinguishable under artificial light. Do NOT hide details in darkness.
- Windows & Views: Windows look out into dark nighttime environment with realistic interior reflections.

[OUTPUT STYLE]: Ultra-photorealistic interior night photography. Every interior detail preserved and visible. Warm cinematic lighting, luxury atmosphere, full geometric fidelity.`;
let loraEnabled = true;
let colorRows = 3; // next unique row ID (only increments, never decrements)
let workflowTemplate = null;

const promptMap = {
  exterior: 'Recolor the exterior facade of this building. Preserve all architectural geometry, windows, greenery, and surroundings.',
  interior: 'Recolor the interior walls and ceiling of this room. Keep all furniture, fixtures, flooring, and decor unchanged.',
  roof: 'Recolor only the roof tiles or roofing material. Keep all walls, windows, and surroundings unchanged.',
  floor: 'Recolor only the floor and tile surfaces. Keep all walls, furniture, and other elements unchanged.',
  villa: 'Recolor the exterior of this villa. Keep landscaping, gates, and structural details intact.',
  apartment: 'Recolor the exterior facade of this apartment building. Preserve balconies, windows, and all structural elements.',
  office: 'Recolor the exterior cladding of this office building. Keep glass curtain walls and structural frame unchanged.',
  bedroom: 'Recolor the walls and ceiling of this bedroom. Preserve all furniture, bedding, lighting fixtures, and flooring.',
  kitchen: 'Recolor the walls and cabinetry of this kitchen. Preserve countertops, appliances, and all fixtures.',
  bathroom: 'Recolor the walls and tiles of this bathroom. Preserve all fixtures, fittings, mirrors, and accessories.',
};

// Color maps and helpers
const hexToNameMap = {
  '#ff0000': 'red',
  '#8b0000': 'deep red',
  '#b22222': 'deep red',
  '#ffa500': 'orange',
  '#ffff00': 'yellow',
  '#f5d033': 'golden yellow',
  '#00ff00': 'green',
  '#008000': 'dark green',
  '#0000ff': 'blue',
  '#800080': 'purple',
  '#8b5cf6': 'violet',
  '#f47bba': 'pink',
  '#ffffff': 'white',
  '#000000': 'black',
  '#808080': 'gray',
  '#a52a2a': 'brown',
  '#c0c0c0': 'silver',
  '#ffd700': 'golden'
};

const nameToHexMap = {};
for (const [hex, name] of Object.entries(hexToNameMap)) {
  if (!nameToHexMap[name]) nameToHexMap[name] = hex;
}

function parseToHex(str) {
  str = str.trim().toLowerCase();
  if (nameToHexMap[str]) return nameToHexMap[str];
  if (str.startsWith('#')) {
    if (str.length === 4) {
      return '#' + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
    }
    return str;
  }
  if (str.startsWith('rgb')) {
    const parts = str.match(/\d+/g);
    if (parts && parts.length >= 3) {
      const r = parseInt(parts[0]).toString(16).padStart(2, '0');
      const g = parseInt(parts[1]).toString(16).padStart(2, '0');
      const b = parseInt(parts[2]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
  }
  if (window.KM_COLORS) {
    let cleanStr = str;
    const match = str.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      cleanStr = match[1].trim();
    }
    const found = window.KM_COLORS.find(c =>
      c.name.toLowerCase() === cleanStr.toLowerCase() ||
      c.code.toLowerCase() === cleanStr.toLowerCase()
    );
    if (found) return found.hex;
  }
  return null;
}

function formatColorForPrompt(val) {
  val = val.trim();
  let searchStr = val.toLowerCase();

  // Dọn dẹp định dạng "Tên màu (Mã)", vd: "Swiss Coffee (23)"
  const match = val.match(/(.*?)\s*\((.*?)\)/);
  if (match) {
    searchStr = match[1].trim().toLowerCase();
  }

  // Tìm trong bảng màu KM và trả về chuỗi siêu chi tiết cho AI
  if (window.KM_COLORS) {
    const found = window.KM_COLORS.find(c =>
      c.name.toLowerCase() === searchStr ||
      c.code.toLowerCase() === searchStr
    );
    if (found) return `${found.name} — Hex ${found.hex} (RGB: ${found.rgb})`;
  }

  if (nameToHexMap[searchStr]) {
    return `${searchStr} — Hex ${nameToHexMap[searchStr]}`;
  }

  if (val.startsWith('#')) {
    const name = hexToNameMap[val.toLowerCase()];
    return name ? `${name} — Hex ${val}` : `Hex ${val}`;
  }
  return val;
}

function getServerUrl() {
  const el = document.getElementById('serverUrl');
  return (el ? el.value : '/api').replace(/\/$/, '');
}

function syncFromPicker(i) {
  const picker = document.getElementById('col' + i);
  const textInput = document.getElementById('val' + i);
  const dot = document.getElementById('dot' + i);
  if (!picker || !textInput || !dot) return;
  const hex = picker.value.toLowerCase();
  const name = hexToNameMap[hex] || hex;
  textInput.value = name;
  dot.style.background = hex;
  dot.style.borderColor = hex;
  generatePrompt();
}

function syncFromText(i) {
  const textInput = document.getElementById('val' + i);
  const picker = document.getElementById('col' + i);
  const dot = document.getElementById('dot' + i);
  if (!textInput || !picker || !dot) return;
  const val = textInput.value.trim();

  let hex = parseToHex(val);
  if (hex) {
    dot.style.background = hex;
    dot.style.borderColor = hex;
    if (picker.tagName === 'INPUT') picker.value = hex;
    picker.style.backgroundColor = hex;
  } else {
    dot.style.background = val;
    dot.style.borderColor = val;
  }
  generatePrompt();
}

const MAX_COLOR_ROWS = 3;

function addColorRow() {
  const currentCount = document.querySelectorAll('.color-row').length;
  if (currentCount >= MAX_COLOR_ROWS) {
    if (typeof showToast === 'function') showToast(`Giới hạn ${MAX_COLOR_ROWS} vùng màu để đảm bảo chất lượng ảnh AI tốt nhất.`, '⚠️');
    return;
  }

  const defaults = ['#E74C3C', '#27AE60', '#3498DB', '#9B59B6', '#F1C40F', '#1ABC9C', '#34495E'];
  const names = ['roof', 'floor', 'fence', 'pillars', 'balcony', 'gates', 'details'];
  const colorNames = ['red', 'green', 'blue', 'purple', 'yellow', 'teal', 'navy'];
  const c = document.getElementById('colorTargets');
  const i = colorRows;
  const dIdx = (i - 3) >= 0 ? (i - 3) % defaults.length : 0;
  const row = document.createElement('div');
  row.className = 'color-row'; row.id = 'row' + i;
  row.innerHTML = `<div class="color-dot" id="dot${i}" style="background:${defaults[dIdx]};border-color:${defaults[dIdx]}"></div>
    <input class="color-name" id="area${i}" value="${names[dIdx]}" list="areaSuggestions" oninput="generatePrompt()">
    <input class="color-val" id="val${i}" value="${colorNames[dIdx]}" list="colorSuggestions" oninput="syncFromText(${i})">
    <button class="color-pick" id="col${i}" style="background-color:${defaults[dIdx]}" onclick="openColorPickerDropdown(event, ${i})"></button>
    <button class="mat-toggle-btn" id="matToggle${i}" onclick="toggleMaterialMode(${i})" title="Chuyển sang chế độ vật liệu">🎨</button>
    <button class="btn-remove-row" onclick="removeRow(${i})">✕</button>`;
  c.appendChild(row);
  colorRows++;
  updateAddRowBtn();
  generatePrompt();
}

function removeRow(i) {
  const el = document.getElementById('row' + i);
  if (el) el.remove();
  updateAddRowBtn();
  generatePrompt();
}

function updateAddRowBtn() {
  const btn = document.querySelector('.btn-add-row');
  if (!btn) return;
  const count = document.querySelectorAll('.color-row').length;
  btn.style.display = count >= MAX_COLOR_ROWS ? 'none' : '';
}

function toggleLora() {
  loraEnabled = !loraEnabled;
  const t = document.getElementById('loraToggle');
  const b = document.getElementById('loraBadge');
  const s = document.getElementById('steps');
  const c = document.getElementById('cfg');
  if (loraEnabled) { t.classList.add('on'); b.classList.add('active'); b.textContent = '⚡ Lightning'; s.value = 4; c.value = 1 }
  else { t.classList.remove('on'); b.classList.remove('active'); b.textContent = 'Standard'; s.value = 20; c.value = 4 }
}

function setQuick(type) {
  document.getElementById('promptBox').value = promptMap[type] || '';
  const exteriorTypes = ['exterior', 'roof', 'villa', 'apartment', 'office'];
  const interiorTypes = ['interior', 'floor', 'bedroom', 'kitchen', 'bathroom'];
  if (exteriorTypes.includes(type)) {
    setProjectType('exterior');
  } else if (interiorTypes.includes(type)) {
    setProjectType('interior');
  }
}

function setProjectType(type) {
  projectType = type;
  const extBtn = document.getElementById('typeExteriorBtn');
  const intBtn = document.getElementById('typeInteriorBtn');
  if (extBtn && intBtn) {
    extBtn.classList.toggle('active', type === 'exterior');
    intBtn.classList.toggle('active', type === 'interior');
  }
  generatePrompt();
}

function getActiveRowIndices() {
  return Array.from(document.querySelectorAll('#colorTargets .color-row'))
    .map(row => parseInt(row.id.replace('row', '')))
    .filter(i => !isNaN(i));
}

function generatePrompt() {
  let colorLinesDay = [];
  for (const i of getActiveRowIndices()) {
    const a = document.getElementById('area' + i);
    const v = document.getElementById('val' + i);
    if (!a || !v) continue;
    const name = a.value.trim();
    let colorValue = v.value.trim();

    if (name && colorValue) {
      if (isRowMaterialMode(i) && materialModeState[i] && materialModeState[i].materialData) {
        const mat = materialModeState[i].materialData;
        colorLinesDay.push(`- Existing ${name}: Replace with ${mat.promptDesc}`);
      } else {
        const colorDesc = formatColorForPrompt(colorValue);
        colorLinesDay.push(`- [MUST RECOLOR] ${name}: ${colorDesc}`);
      }
    }
  }
  const colorSpecDayText = `[COLOR SPECIFICATIONS]:\n${colorLinesDay.join('\n')}`;

  const template = (projectType === 'interior') ? dayInteriorTemplate : dayExteriorTemplate;
  const dayPrompt = template.replace('[COLOR SPECIFICATIONS]', colorSpecDayText);
  document.getElementById('promptBox').value = dayPrompt;
}

function randSeed(n) { document.getElementById('seed' + n).value = Math.floor(Math.random() * 999999999999999) }

function switchTab(tab) {
  currentTab = tab;
  ['result', 'compare', 'json'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.toggle('active', t === tab);
  });
  const hasImages = resultImageUrl || resultImageUrlNight;
  const splitView = document.getElementById('splitView');
  const placeholder = document.getElementById('placeholder');
  const jb = document.getElementById('jsonBox');
  if (splitView) splitView.style.display = 'none';
  if (placeholder) placeholder.style.display = 'none';
  if (jb) jb.style.display = 'none';

  if (tab === 'result' || tab === 'compare') {
    if (hasImages && splitView) splitView.style.display = 'flex';
    else if (placeholder) placeholder.style.display = 'block';
  } else if (tab === 'json') {
    if (jb) { jb.style.display = 'block'; updateJsonPreview(); }
  }
}

function buildWorkflow(imageFilename, prompt, seed1, seed2, steps, cfg, loraOn) {
  let colorLinesNight = [];
  for (const i of getActiveRowIndices()) {
    const a = document.getElementById('area' + i);
    const v = document.getElementById('val' + i);
    if (!a || !v) continue;
    const name = a.value.trim();
    let colorValue = v.value.trim();

    if (name && colorValue) {
      if (isRowMaterialMode(i) && materialModeState[i] && materialModeState[i].materialData) {
        const mat = materialModeState[i].materialData;
        colorLinesNight.push(`  * ${name}: ${mat.promptDesc}`);
      } else {
        const colorDesc = formatColorForPrompt(colorValue);
        colorLinesNight.push(`  * ${name}: ${colorDesc}`);
      }
    }
  }
  const colorSpecNightText = `[COLOR SPECIFICATIONS]:\n- Maintain identical physical paint colors from the daytime version:\n${colorLinesNight.join('\n')}\nOnly lighting conditions change.`;
  const template = (projectType === 'interior') ? nightInteriorTemplate : nightExteriorTemplate;
  const nightPrompt = template.replace('[COLOR SPECIFICATIONS]', colorSpecNightText);

  if (workflowTemplate) {
    const wf = JSON.parse(JSON.stringify(workflowTemplate));
    if (wf['78'] && wf['78'].inputs) wf['78'].inputs.image = imageFilename;
    if (wf['435'] && wf['435'].inputs) wf['435'].inputs.value = prompt;
    if (wf['711'] && wf['711'].inputs) wf['711'].inputs.value = nightPrompt;

    // Day KSampler
    if (wf['433:3'] && wf['433:3'].inputs) wf['433:3'].inputs.seed = seed1;
    if (wf['433:436'] && wf['433:436'].inputs) wf['433:436'].inputs.value = 4;
    if (wf['433:438'] && wf['433:438'].inputs) wf['433:438'].inputs.value = steps;
    if (wf['433:437'] && wf['433:437'].inputs) wf['433:437'].inputs.value = 1;
    if (wf['433:439'] && wf['433:439'].inputs) wf['433:439'].inputs.value = cfg;
    if (wf['433:443'] && wf['433:443'].inputs) wf['433:443'].inputs.value = loraOn;

    // Night KSampler
    if (wf['734:724'] && wf['734:724'].inputs) wf['734:724'].inputs.seed = seed2;
    if (wf['734:725'] && wf['734:725'].inputs) wf['734:725'].inputs.value = 4;
    if (wf['734:727'] && wf['734:727'].inputs) wf['734:727'].inputs.value = steps;
    if (wf['734:726'] && wf['734:726'].inputs) wf['734:726'].inputs.value = 1;
    if (wf['734:733'] && wf['734:733'].inputs) wf['734:733'].inputs.value = cfg;
    if (wf['734:731'] && wf['734:731'].inputs) wf['734:731'].inputs.value = loraOn;
    return wf;
  }
  return buildFallbackWorkflow(imageFilename, prompt, seed1, seed2, steps, cfg, loraOn);
}

function buildFallbackWorkflow(imageFilename, prompt, seed1, seed2, steps, cfg, loraOn) {
  return {
    "60": { "inputs": { "filename_prefix": "ComfyUI", "images": ["710:65", 0] }, "class_type": "SaveImage", "_meta": { "title": "Save Image" } },
    "78": { "inputs": { "image": imageFilename }, "class_type": "LoadImage", "_meta": { "title": "Load Image" } },
    "435": { "inputs": { "value": prompt }, "class_type": "PrimitiveStringMultiline", "_meta": { "title": "Prompt" } },
    "433:75": { "inputs": { "strength": 1, "pre_cfg": false, "model": ["433:66", 0] }, "class_type": "CFGNorm", "_meta": { "title": "CFGNorm" } },
    "433:39": { "inputs": { "vae_name": "qwen_image_vae.safetensors" }, "class_type": "VAELoader", "_meta": { "title": "Load VAE" } },
    "433:38": { "inputs": { "clip_name": "qwen_2.5_vl_7b_fp8_scaled.safetensors", "type": "qwen_image", "device": "default" }, "class_type": "CLIPLoader", "_meta": { "title": "Load CLIP" } },
    "433:37": { "inputs": { "unet_name": "Qwen-Image-Edit-2511-FP8_e4m3fn.safetensors", "weight_dtype": "default" }, "class_type": "UNETLoader", "_meta": { "title": "Load Diffusion Model" } },
    "433:110": { "inputs": { "prompt": "", "clip": ["433:38", 0], "vae": ["433:39", 0], "image1": ["433:117", 0] }, "class_type": "TextEncodeQwenImageEditPlus", "_meta": { "title": "TextEncodeQwenImageEditPlus" } },
    "433:66": { "inputs": { "shift": 3, "model": ["433:440", 0] }, "class_type": "ModelSamplingAuraFlow", "_meta": { "title": "ModelSamplingAuraFlow" } },
    "433:111": { "inputs": { "prompt": ["435", 0], "clip": ["433:38", 0], "vae": ["433:39", 0], "image1": ["433:117", 0] }, "class_type": "TextEncodeQwenImageEditPlus", "_meta": { "title": "TextEncodeQwenImageEditPlus" } },
    "433:88": { "inputs": { "pixels": ["433:117", 0], "vae": ["433:39", 0] }, "class_type": "VAEEncode", "_meta": { "title": "VAE Encode" } },
    "433:8": { "inputs": { "samples": ["433:3", 0], "vae": ["433:39", 0] }, "class_type": "VAEDecode", "_meta": { "title": "VAE Decode" } },
    "433:89": { "inputs": { "lora_name": "Qwen-Image-Edit-2511-Lightning-4steps-V1.0-fp32.safetensors", "strength_model": 1, "model": ["433:37", 0] }, "class_type": "LoraLoaderModelOnly", "_meta": { "title": "Load LoRA" } },
    "433:117": { "inputs": { "image": ["78", 0] }, "class_type": "FluxKontextImageScale", "_meta": { "title": "FluxKontextImageScale" } },
    "433:3": { "inputs": { "seed": seed1, "steps": ["433:441", 0], "cfg": ["433:442", 0], "sampler_name": "euler", "scheduler": "simple", "denoise": 1, "model": ["433:75", 0], "positive": ["433:111", 0], "negative": ["433:110", 0], "latent_image": ["433:88", 0] }, "class_type": "KSampler", "_meta": { "title": "KSampler" } },
    "433:436": { "inputs": { "value": 4 }, "class_type": "PrimitiveInt", "_meta": { "title": "Stpes" } },
    "433:437": { "inputs": { "value": 1 }, "class_type": "PrimitiveFloat", "_meta": { "title": "CFG" } },
    "433:438": { "inputs": { "value": steps }, "class_type": "PrimitiveInt", "_meta": { "title": "Steps" } },
    "433:439": { "inputs": { "value": cfg }, "class_type": "PrimitiveFloat", "_meta": { "title": "CFG" } },
    "433:440": { "inputs": { "switch": ["433:443", 0], "on_false": ["433:37", 0], "on_true": ["433:89", 0] }, "class_type": "ComfySwitchNode", "_meta": { "title": "Switch (Model)" } },
    "433:441": { "inputs": { "switch": ["433:443", 0], "on_false": ["433:438", 0], "on_true": ["433:436", 0] }, "class_type": "ComfySwitchNode", "_meta": { "title": "Switch (Steps)" } },
    "433:442": { "inputs": { "switch": ["433:443", 0], "on_false": ["433:439", 0], "on_true": ["433:437", 0] }, "class_type": "ComfySwitchNode", "_meta": { "title": "Switch (CFG)" } },
    "433:443": { "inputs": { "value": loraOn }, "class_type": "PrimitiveBoolean", "_meta": { "title": "Enable Lightning LoRA" } },
    "710:79": { "inputs": { "upscale_model": ["710:76", 0], "image": ["710:709", 0] }, "class_type": "ImageUpscaleWithModel", "_meta": { "title": "Upscale Image (using Model)" } },
    "710:80": { "inputs": { "pixels": ["710:81", 0], "vae": ["710:63", 0] }, "class_type": "VAEEncode", "_meta": { "title": "VAE Encode" } },
    "710:63": { "inputs": { "vae_name": "qwen_image_vae.safetensors" }, "class_type": "VAELoader", "_meta": { "title": "Load VAE" } },
    "710:70": { "inputs": { "shift": 3, "model": ["710:708", 0] }, "class_type": "ModelSamplingAuraFlow", "_meta": { "title": "ModelSamplingAuraFlow" } },
    "710:65": { "inputs": { "samples": ["710:69", 0], "vae": ["710:63", 0] }, "class_type": "VAEDecode", "_meta": { "title": "VAE Decode" } },
    "710:76": { "inputs": { "model_name": "4xUltrasharp_4xUltrasharpV10.pt" }, "class_type": "UpscaleModelLoader", "_meta": { "title": "Load Upscale Model" } },
    "710:67": { "inputs": { "text": "masterpiece, 8K ultra high-end photo restoration and super-resolution. Enhance to ultra-sharp 8K quality with maximum realistic detail recovery. Preserve 100% original composition.", "clip": ["710:62", 0] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Positive Prompt)" } },
    "710:71": { "inputs": { "text": "painting, illustration, cartoon, anime, CGI, 3D render, blurry, artifacts, watermark", "clip": ["710:62", 0] }, "class_type": "CLIPTextEncode", "_meta": { "title": "CLIP Text Encode (Negative Prompt)" } },
    "710:62": { "inputs": { "clip_name": "qwen_3_8b_fp8mixed.safetensors", "type": "flux2", "device": "default" }, "class_type": "CLIPLoader", "_meta": { "title": "Load CLIP" } },
    "710:708": { "inputs": { "unet_name": "z_image_turbo_bf16.safetensors", "weight_dtype": "default" }, "class_type": "UNETLoader", "_meta": { "title": "Load Diffusion Model" } },
    "710:709": { "inputs": { "upscale_method": "lanczos", "megapixels": 1, "resolution_steps": 1, "image": ["433:8", 0] }, "class_type": "ImageScaleToTotalPixels", "_meta": { "title": "Scale Image to Total Pixels" } },
    "710:81": { "inputs": { "upscale_method": "lanczos", "scale_by": 0.5, "image": ["710:79", 0] }, "class_type": "ImageScaleBy", "_meta": { "title": "Upscale Image By" } },
    "710:69": { "inputs": { "seed": seed2, "steps": 3, "cfg": 1, "sampler_name": "dpmpp_3m_sde_gpu", "scheduler": "karras", "denoise": 0, "model": ["710:70", 0], "positive": ["710:67", 0], "negative": ["710:71", 0], "latent_image": ["710:80", 0] }, "class_type": "KSampler", "_meta": { "title": "KSampler" } }
  };
}

function updateJsonPreview() {
  if (!uploadedImageName) { document.getElementById('jsonContent').textContent = '// Upload ảnh trước để xem payload'; return }
  const p = document.getElementById('promptBox').value || 'no prompt';
  const s1 = parseInt(document.getElementById('seed1').value);
  const s2 = parseInt(document.getElementById('seed2').value);
  const st = parseInt(document.getElementById('steps').value);
  const cf = parseFloat(document.getElementById('cfg').value);
  const wf = buildWorkflow(uploadedImageName, p, s1, s2, st, cf, loraEnabled);
  document.getElementById('jsonContent').textContent = JSON.stringify({ prompt: wf }, null, 2);
}

async function uploadImageToComfyUI(base64, filename, serverUrl) {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++)ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: 'image/jpeg' });
  const fd = new FormData();
  fd.append('image', blob, filename);
  fd.append('overwrite', 'true');
  const res = await fetch(`${serverUrl}/upload/image`, { method: 'POST', body: fd });
  if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error(`Upload failed: ${res.status}${t ? ' - ' + t : ''}`); }
  return await res.json();
}

async function pollResult(serverUrl, promptId, onProgress) {
  const MAX_TRIES = 120; // 120 × 2s = 4 phút tối đa
  return new Promise((resolve, reject) => {
    let tries = 0;
    const interval = setInterval(async () => {
      tries++;
      const pct = Math.min(90, tries * 5);
      onProgress(pct, `Đang xử lý... (${tries * 2}s)`);

      if (tries > MAX_TRIES) {
        clearInterval(interval);
        reject(new Error('Hết thời gian chờ (4 phút). ComfyUI chưa trả về kết quả.'));
        return;
      }

      try {
        // Fetch /history/{promptId}
        const res = await fetch(`${serverUrl}/history/${promptId}`);
        if (!res.ok) return;
        const hist = await res.json();

        let pData = hist[promptId] || null;
        if (!pData) return; // chưa vào history, chờ tiếp

        // outputs có thể là {} hoặc [] tuỳ version ComfyUI
        const outputsHasData = (o) => {
          if (!o) return false;
          if (Array.isArray(o)) return o.length > 0;
          return Object.keys(o).length > 0;
        };

        // Fallback: nếu outputs rỗng thử gọi /history tổng
        if (!outputsHasData(pData.outputs)) {
          const res2 = await fetch(`${serverUrl}/history`);
          if (res2.ok) {
            const hist2 = await res2.json();
            if (hist2[promptId] && outputsHasData(hist2[promptId].outputs)) {
              pData = hist2[promptId];
            }
          }
        }

        const statusStr = pData.status && pData.status.status_str;
        const hasOutputs = outputsHasData(pData.outputs);

        console.log(`[Poll #${tries}] status_str="${statusStr}" hasOutputs=${hasOutputs}`);
        if (tries === 1) console.log('[Poll Debug] full pData:', JSON.stringify(pData).slice(0, 3000));

        if (!hasOutputs) return; // chờ tiếp

        clearInterval(interval);
        console.log("ComfyUI History Data:", pData);

        if (pData.error) {
          const errType = pData.error.exception_type || 'Lỗi';
          const errMsg = pData.error.exception_message || 'Chi tiết không rõ.';
          const nodeErr = pData.error.node_id ? ` (Tại node: ${pData.error.node_id})` : '';
          return reject(new Error(`ComfyUI ${errType}${nodeErr}: ${errMsg}`));
        }

        if (statusStr === 'error') {
          return reject(new Error('Backend ComfyUI gặp lỗi khi xử lý (Kiểm tra console của ComfyUI).'));
        }

        // Normalize outputs: array → object (dùng index làm key), hoặc giữ nguyên nếu đã là object
        const rawOutputs = pData.outputs || {};
        const outputs = Array.isArray(rawOutputs)
          ? Object.fromEntries(rawOutputs.map((v, i) => [i, v]))
          : rawOutputs;
        const result = {};
        for (const nid of Object.keys(outputs)) {
          if (outputs[nid].images && outputs[nid].images.length > 0) {
            const img = outputs[nid].images[0];
            result[nid] = `${serverUrl}/view?filename=${img.filename}&subfolder=${img.subfolder || ''}&type=${img.type || 'output'}`;
          }
        }

        let day = null;
        let night = null;
        if (result["60"]) day = result["60"];
        if (result["712"]) night = result["712"];

        if (!day) {
          const keys = Object.keys(result);
          if (keys.length > 0) day = result[keys[0]];
          if (keys.length > 1) night = result[keys[1]];
        }
        resolve({ day, night });
      } catch (e) {
        if (tries > MAX_TRIES) { clearInterval(interval); reject(e); }
      }
    }, 2000);
  });
}

async function runWorkflow() {
  if (!uploadedImageBase64) { alert('Vui lòng upload ảnh trước!'); return }
  const serverUrl = getServerUrl();
  const prompt = document.getElementById('promptBox').value;
  if (!prompt.trim()) generatePrompt();

  const btn = document.getElementById('runBtn');
  btn.disabled = true;
  document.getElementById('runLabel').textContent = 'Đang chạy...';

  const statusPill = document.querySelector('.status-pill');
  if (statusPill) statusPill.style.display = 'flex';

  const setStatus = (type, text, pct) => {
    const dot = document.getElementById('statusDot');
    if (dot) dot.className = 'status-dot' + (type ? ' ' + type : '');
    const statusText = document.getElementById('statusText');
    if (statusText) statusText.textContent = text;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = pct + '%';
    const progressLabel = document.getElementById('progressLabel');
    if (progressLabel) progressLabel.textContent = pct + '%';
  };

  try {
    setStatus('running', 'Đang upload ảnh...', 5);
    await uploadImageToComfyUI(uploadedImageBase64, uploadedImageName, serverUrl);

    setStatus('running', 'Đang gửi workflow...', 15);
    const s1 = parseInt(document.getElementById('seed1').value);
    const s2 = parseInt(document.getElementById('seed2').value);
    const steps = parseInt(document.getElementById('steps').value);
    const cfg = parseFloat(document.getElementById('cfg').value);
    const finalPrompt = document.getElementById('promptBox').value;
    const wf = buildWorkflow(uploadedImageName, finalPrompt, s1, s2, steps, cfg, loraEnabled);

    console.log('[Submit] Workflow keys:', Object.keys(wf), '| node 78:', wf['78']?.inputs, '| node 435:', wf['435']?.inputs?.value?.slice?.(0, 80));
    const res = await fetch(`${serverUrl}/prompt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: wf }) });
    if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error(`Prompt failed: ${res.status}${t ? ' - ' + t : ''}`); }
    const data = await res.json();
    if (!data.prompt_id) throw new Error('Không có prompt_id');

    setStatus('running', `Workflow đang chạy (${data.prompt_id.slice(0, 8)}...)`, 20);
    const resultData = await pollResult(serverUrl, data.prompt_id, (pct, msg) => setStatus('running', msg, pct));

    const dayUrl = resultData.day;
    const nightUrl = resultData.night;

    if (!dayUrl && !nightUrl) {
      throw new Error('ComfyUI chạy xong nhưng không sinh ra ảnh. Vui lòng kiểm tra lại file day_night.json có chứa Node SaveImage không, hoặc xem log console F12.');
    }

    resultImageUrl = dayUrl;
    resultImageUrlNight = nightUrl;
    setStatus('done', 'Hoàn tất!', 100);

    // Show split view, hide placeholder
    const placeholder = document.getElementById('placeholder');
    if (placeholder) placeholder.style.display = 'none';
    const splitView = document.getElementById('splitView');
    if (splitView) splitView.style.display = 'flex';

    // Set original image (hidden img for export reference)
    const origEl = document.getElementById('compareOrig');
    if (origEl) origEl.src = uploadedImageBase64;
    osdSetImage('orig', 'osdOrig', uploadedImageBase64);

    // Set result images in split view
    const compResultDay = document.getElementById('compareResultDay');
    const compResultNight = document.getElementById('compareResultNight');
    const compareDayImageBox = document.getElementById('compareDayImageBox');
    const compareNightImageBox = document.getElementById('compareNightImageBox');

    if (dayUrl && compResultDay) {
      compResultDay.src = dayUrl;
      osdSetImage('day', 'osdDay', dayUrl);
    }
    if (nightUrl && compResultNight) {
      compResultNight.src = nightUrl;
      osdSetImage('night', 'osdNight', nightUrl);
    }

    // Show/hide night image box based on availability
    if (compareNightImageBox) {
      compareNightImageBox.style.display = nightUrl ? '' : 'none';
    }

    // Reset day/night switch to day
    resetCompareDayNight();

    // Enable download
    const dl = document.getElementById('downloadBtn');
    if (dl) dl.disabled = false;

    if (uploadedImageName && (dayUrl || nightUrl)) {
      saveToHistory(uploadedImageName, dayUrl, nightUrl);
    }

    // Tự động lưu kết quả vào thư mục output ComfyUI
    autoSaveToOutput(dayUrl, nightUrl, serverUrl);

    setImageBadge('done', 'Phối màu hoàn tất', 5000);
  } catch (err) {
    setStatus('error', 'Lỗi: ' + err.message, 0);
    console.error(err);
    showToast('Lỗi: ' + err.message, '❌');
  } finally {
    btn.disabled = false;
    document.getElementById('runLabel').textContent = 'Chạy Phối Màu';
  }
}

// Lấy danh sách màu hiện tại từ các row
function getActiveColorList() {
  const rows = [];
  for (const i of getActiveRowIndices()) {
    const a = document.getElementById('area' + i);
    const v = document.getElementById('val' + i);
    if (!a || !v) continue;
    const name = a.value.trim();
    const color = v.value.trim();
    if (name && color) rows.push({ name, color });
  }
  return rows;
}

// Vẽ footer: logo + mã màu + disclaimer lên canvas
// Trả về chiều cao của footer đã vẽ
async function drawExportFooter(ctx, canvasWidth, imgAreaHeight) {
  const FOOTER_BG = '#ffffff';
  const PADDING = 40;
  const LOGO_H = 60;
  const COLOR_CHIP_R = 18;
  const COLOR_CHIP_GAP = 14;
  const ROW_H = 44;
  const DISCLAIMER_FONT = 22;
  const DISCLAIMER_TEXT = 'Hình ảnh mang tính chất tham khảo, màu sắc có thể không chính xác so với màu thật.';
  const DISCLAIMER_TEXT2 = 'Quý khách vui lòng đến showroom gần nhất để được tư vấn chi tiết!';

  const colors = getActiveColorList();

  // Tính chiều cao footer
  const colorSectionH = colors.length > 0 ? (Math.ceil(colors.length / 3) * ROW_H + 20) : 0;
  const footerH = PADDING + LOGO_H + 24 + colorSectionH + (DISCLAIMER_FONT * 2 + 16) + PADDING;

  const y0 = imgAreaHeight;
  ctx.fillStyle = FOOTER_BG;
  ctx.fillRect(0, y0, canvasWidth, footerH);

  // Separator line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PADDING, y0);
  ctx.lineTo(canvasWidth - PADDING, y0);
  ctx.stroke();

  // --- LOGO ---
  let logoY = y0 + PADDING;
  try {
    const logo = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = '/image/logo-painmore.png';
    });
    const logoW = logo.naturalWidth * (LOGO_H / logo.naturalHeight);
    ctx.drawImage(logo, PADDING, logoY, logoW, LOGO_H);
  } catch (_) {
    // Logo không load được — bỏ qua, vẫn tiếp tục
    ctx.font = 'bold 28px Montserrat, "Segoe UI", sans-serif';
    ctx.fillStyle = '#1a5e20';
    ctx.textBaseline = 'top';
    ctx.fillText('PAINT & MORE', PADDING, logoY);
  }

  // --- MÃ MÀU ---
  if (colors.length > 0) {
    let cx = PADDING;
    let cy = logoY + LOGO_H + 24;
    const colsPerRow = Math.min(3, colors.length);
    const colW = Math.floor((canvasWidth - PADDING * 2) / colsPerRow);

    colors.forEach((item, idx) => {
      const col = idx % colsPerRow;
      const row = Math.floor(idx / colsPerRow);
      const x = PADDING + col * colW;
      const y = cy + row * ROW_H;

      // Color chip
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + COLOR_CHIP_R, y + COLOR_CHIP_R, COLOR_CHIP_R, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Label
      ctx.font = '500 22px Montserrat, "Segoe UI", sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.name}  ${item.color.toUpperCase()}`, x + COLOR_CHIP_R * 2 + COLOR_CHIP_GAP, y + COLOR_CHIP_R);
    });

    cy += Math.ceil(colors.length / colsPerRow) * ROW_H + 16;
  }

  // --- DISCLAIMER ---
  const disclaimerY = y0 + footerH - PADDING - DISCLAIMER_FONT * 2 - 10;
  ctx.font = `italic ${DISCLAIMER_FONT}px Montserrat, "Segoe UI", sans-serif`;
  ctx.fillStyle = '#64748b';
  ctx.textBaseline = 'top';
  ctx.fillText(DISCLAIMER_TEXT, PADDING, disclaimerY);
  ctx.fillText(DISCLAIMER_TEXT2, PADDING, disclaimerY + DISCLAIMER_FONT + 8);

  return footerH;
}

async function buildExportCanvas(images) {
  // images: [{ img: HTMLImageElement, label: string, labelColor: string }]
  const TARGET_H = 1200;

  const scaled = images.map(item => ({
    ...item,
    scale: TARGET_H / item.img.naturalHeight,
    w: item.img.naturalWidth * (TARGET_H / item.img.naturalHeight),
  }));

  const totalImgW = scaled.reduce((s, i) => s + i.w, 0);

  // Tạo canvas tạm để đo footer
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = totalImgW;
  tmpCanvas.height = TARGET_H + 400;
  const tmpCtx = tmpCanvas.getContext('2d');
  const footerH = await drawExportFooter(tmpCtx, totalImgW, TARGET_H);

  // Canvas thật
  const canvas = document.createElement('canvas');
  canvas.width = totalImgW;
  canvas.height = TARGET_H + footerH;
  const ctx = canvas.getContext('2d');

  // Vẽ ảnh
  let xOff = 0;
  scaled.forEach((item, idx) => {
    ctx.drawImage(item.img, xOff, 0, item.w, TARGET_H);
    if (idx < scaled.length - 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(xOff + item.w, 0);
      ctx.lineTo(xOff + item.w, TARGET_H);
      ctx.stroke();
    }
    drawLabelOnCanvas(ctx, item.label, xOff + 30, 30, item.labelColor);
    xOff += item.w;
  });

  // Vẽ footer
  await drawExportFooter(ctx, totalImgW, TARGET_H);

  return canvas;
}

function downloadResult() {
  if (!resultImageUrl && !resultImageUrlNight) {
    showToast('Chưa có ảnh kết quả để tải về!', '⚠️');
    return;
  }

  showToast('Đang tạo ảnh xuất...', '⏳');

  const urlsToLoad = [];
  if (resultImageUrl) urlsToLoad.push({ url: resultImageUrl, label: 'BAN NGÀY', labelColor: '#fbbf24' });
  if (resultImageUrlNight) urlsToLoad.push({ url: resultImageUrlNight, label: 'BAN ĐÊM', labelColor: '#38bdf8' });

  const loadImg = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  Promise.all(urlsToLoad.map(item => loadImg(item.url).then(img => ({ ...item, img }))))
    .then(async (images) => {
      try {
        const canvas = await buildExportCanvas(images);
        canvas.toBlob((blob) => {
          if (!blob) { showToast('Lỗi tạo ảnh, thử lại!', '⚠️'); return; }
          const objectUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = objectUrl;
          const suffix = images.length === 2 ? 'day-night' : (resultImageUrl ? 'daytime' : 'nighttime');
          a.download = `recolor-${suffix}-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
          showToast('Tải ảnh thành công!', '✓');
        }, 'image/jpeg', 0.92);
      } catch (err) {
        console.error('Export canvas error:', err);
        showToast('Lỗi tạo ảnh ghép, đang tải ảnh rời...', '⚠️');
        fallbackDownload();
      }
    })
    .catch((err) => {
      console.error('Load image error:', err);
      showToast('Đang tải ảnh riêng lẻ...', '⏳');
      fallbackDownload();
    });
}

// Tải ảnh an toàn bằng cách fetch thành Blob rồi tạo URL
async function downloadImageSafe(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    // Đảm bảo đúng đuôi file tương ứng với loại ảnh
    let finalName = filename;
    if (blob.type === 'image/webp') finalName = finalName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    else if (blob.type === 'image/png') finalName = finalName.replace(/\.(jpg|jpeg|webp)$/i, '.png');

    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (err) {
    console.error('Safe download failed, falling back to direct link:', err);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

async function autoSaveToOutput(dayUrl, nightUrl, serverUrl) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const baseName = (uploadedImageName || 'recolor').replace(/\.[^.]+$/, '');

  try {
    const toBase64 = (url) => fetch(url)
      .then(r => r.blob())
      .then(blob => new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      }));

    if (dayUrl && nightUrl) {
      // Tạo ảnh ghép ngày+đêm
      const [b64Day, b64Night] = await Promise.all([toBase64(dayUrl), toBase64(nightUrl)]);
      await new Promise((resolve) => {
        const imgDay = new Image();
        const imgNight = new Image();
        let loaded = 0;
        const onLoad = () => {
          if (++loaded < 2) return;
          const h = 1200;
          const wDay = imgDay.naturalWidth * (h / imgDay.naturalHeight);
          const wNight = imgNight.naturalWidth * (h / imgNight.naturalHeight);
          const canvas = document.createElement('canvas');
          canvas.width = wDay + wNight;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgDay, 0, 0, wDay, h);
          ctx.drawImage(imgNight, wDay, 0, wNight, h);
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(wDay, 0); ctx.lineTo(wDay, h); ctx.stroke();
          drawLabelOnCanvas(ctx, 'BAN NGÀY', 20, 20, '#fbbf24');
          drawLabelOnCanvas(ctx, 'BAN ĐÊM', wDay + 20, 20, '#38bdf8');
          canvas.toBlob(async (blob) => {
            const reader = new FileReader();
            reader.onload = async () => {
              try {
                await fetch('/api/save_composite', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ filename: `${baseName}_${ts}_composite.jpg`, image_base64: reader.result })
                });
                showToast('Đã lưu ảnh ghép vào thư mục output!', '💾');
              } catch (e) { console.warn('autoSave composite failed:', e); }
              resolve();
            };
            reader.readAsDataURL(blob);
          }, 'image/jpeg', 0.92);
        };
        imgDay.onload = imgNight.onload = onLoad;
        imgDay.onerror = imgNight.onerror = resolve;
        imgDay.src = b64Day;
        imgNight.src = b64Night;
      });
    } else {
      // Chỉ có 1 ảnh — lưu trực tiếp
      const url = dayUrl || nightUrl;
      const suffix = dayUrl ? 'day' : 'night';
      const b64 = await toBase64(url);
      await fetch('/api/save_composite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `${baseName}_${ts}_${suffix}.jpg`, image_base64: b64 })
      });
      showToast('Đã lưu ảnh vào thư mục output!', '💾');
    }
  } catch (e) {
    console.warn('autoSaveToOutput failed:', e);
  }
}

function fallbackDownload() {
  if (resultImageUrl) {
    downloadImageSafe(resultImageUrl, `recolor-daytime-${Date.now()}.jpg`);
  }
  if (resultImageUrlNight) {
    setTimeout(() => {
      downloadImageSafe(resultImageUrlNight, `recolor-nighttime-${Date.now()}.jpg`);
    }, 500);
  }
}

function drawLabelOnCanvas(ctx, text, x, y, color) {
  ctx.save();
  ctx.font = 'bold 28px Montserrat, "Segoe UI", sans-serif';
  const textWidth = ctx.measureText(text).width;
  const paddingX = 20;
  const rectHeight = 52;
  const rectWidth = textWidth + paddingX * 2 + 18;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, rectWidth, rectHeight, 12);
  } else {
    ctx.rect(x, y, rectWidth, rectHeight);
  }
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + paddingX + 8, y + rectHeight / 2, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX + 26, y + rectHeight / 2);
  ctx.restore();
}


/* COLOR HISTORY LOGIC */
async function persistHistory() {
  // Lưu vào file qua proxy (thư mục output ComfyUI)
  try {
    await fetch('/api/history_save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: recolorHistory })
    });
  } catch (e) {
    // Fallback localStorage nếu proxy không chạy
    try { localStorage.setItem('recolor_history', JSON.stringify(recolorHistory)); } catch (_) { }
  }
}

async function loadHistory() {
  try {
    const res = await fetch('/api/history_load');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.history) && data.history.length > 0) {
        recolorHistory = data.history;
        return;
      }
    }
  } catch (e) { /* proxy chưa chạy */ }
  // Fallback localStorage
  try { recolorHistory = JSON.parse(localStorage.getItem('recolor_history') || '[]'); } catch (_) { recolorHistory = []; }
}

function saveToHistory(inputImgName, dayImg, nightImg) {
  const colors = [];
  for (const i of getActiveRowIndices()) {
    const areaEl = document.getElementById('area' + i);
    const valEl = document.getElementById('val' + i);
    const colEl = document.getElementById('col' + i);
    if (areaEl && valEl && colEl) {
      colors.push({
        area: areaEl.value,
        val: valEl.value,
        color: colEl.style.backgroundColor
      });
    }
  }

  const historyItem = {
    id: Date.now(),
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    inputImgName: inputImgName,
    inputBase64: typeof uploadedImageBase64 === 'string' && uploadedImageBase64.startsWith('data:') ? uploadedImageBase64 : null,
    dayImg: dayImg,
    nightImg: nightImg,
    colors: colors,
    prompt: document.getElementById('promptBox').value
  };

  recolorHistory.unshift(historyItem);
  if (recolorHistory.length > 30) recolorHistory.pop();
  persistHistory();
}

function loadHistoryItem(id) {
  const item = recolorHistory.find(h => h.id === id);
  if (!item) return;

  const serverUrl = getServerUrl();

  // Restore input image — prefer saved base64, fall back to server URL
  uploadedImageName = item.inputImgName;
  const inputDisplayUrl = item.inputBase64 || `${serverUrl}/view?filename=${uploadedImageName}&type=input`;
  uploadedImageBase64 = item.inputBase64 || inputDisplayUrl;

  const pb = document.getElementById('previewBox');
  document.getElementById('previewImg').src = inputDisplayUrl;
  pb.style.display = 'flex';
  document.getElementById('uploadZone').style.display = 'none';
  document.getElementById('compareOrig').src = inputDisplayUrl;
  osdSetImage('orig', 'osdOrig', inputDisplayUrl);

  // Restore color targets/rows
  const container = document.getElementById('colorTargets');
  container.innerHTML = '';
  colorRows = 0;

  item.colors.forEach((col, idx) => {
    addColorRow();
    const areaInput = document.getElementById('area' + idx);
    const valInput = document.getElementById('val' + idx);
    if (areaInput) areaInput.value = col.area;
    if (valInput) valInput.value = col.val;

    const picker = document.getElementById('col' + idx);
    const dot = document.getElementById('dot' + idx);
    if (picker && dot) {
      picker.style.backgroundColor = col.color;
      dot.style.backgroundColor = col.color;
      dot.style.borderColor = col.color === '#ffffff' || col.color === 'rgb(255, 255, 255)' ? '#E2E8F0' : col.color;

      const hex = parseToHex(col.val) || col.color;
      picker.value = hex;
    }
  });

  // Restore prompt
  document.getElementById('promptBox').value = item.prompt;

  // Restore results
  resultImageUrl = item.dayImg;
  resultImageUrlNight = item.nightImg;

  const compResultDay = document.getElementById('compareResultDay');
  const compResultNight = document.getElementById('compareResultNight');
  const compareNightImageBox = document.getElementById('compareNightImageBox');

  if (resultImageUrl && compResultDay) {
    compResultDay.src = resultImageUrl;
    osdSetImage('day', 'osdDay', resultImageUrl);
  }
  if (resultImageUrlNight && compResultNight) {
    compResultNight.src = resultImageUrlNight;
    osdSetImage('night', 'osdNight', resultImageUrlNight);
  }
  if (compareNightImageBox) {
    compareNightImageBox.style.display = resultImageUrlNight ? '' : 'none';
  }

  // Show split view
  const placeholder = document.getElementById('placeholder');
  const splitView = document.getElementById('splitView');
  if (placeholder) placeholder.style.display = 'none';
  if (splitView) splitView.style.display = 'flex';

  resetCompareDayNight();

  // Enable download button
  document.getElementById('downloadBtn').disabled = false;

  // Close modal
  toggleHistoryModal();
  showToast('Đã khôi phục lịch sử phối màu!', '🕒');
}

function renderHistory() {
  const listEl = document.getElementById('historyList');
  if (!listEl) return;

  if (recolorHistory.length === 0) {
    listEl.innerHTML = '<div class="history-empty">Chưa có lịch sử phối màu nào</div>';
    return;
  }

  const serverUrl = getServerUrl();

  listEl.innerHTML = recolorHistory.map(item => {
    const inputUrl = `${serverUrl}/view?filename=${item.inputImgName}&type=input`;
    const dayUrl = item.dayImg || inputUrl;

    const colorTags = item.colors.slice(0, 3).map(c => `
      <span class="history-tag" style="border-left: 2px solid ${c.color}; padding-left: 4px;">
        ${c.val}
      </span>
    `).join('');

    return `
      <div class="history-item" onclick="loadHistoryItem(${item.id})">
        <div class="history-thumbs">
          <img class="history-thumb" src="${inputUrl}" alt="Original" onerror="this.style.display='none'">
          <img class="history-thumb" src="${dayUrl}" alt="Result" onerror="this.style.display='none'">
        </div>
        <div class="history-info">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="history-time">${item.time}</span>
              <button class="btn-delete-history" onclick="deleteHistoryItem(event, ${item.id})" title="Xóa">✕</button>
            </div>
            <div class="history-desc">${item.prompt ? item.prompt.split('\n')[0] : 'Phối màu'}</div>
            <div class="history-tags">${colorTags}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function deleteHistoryItem(event, id) {
  event.stopPropagation();
  recolorHistory = recolorHistory.filter(item => item.id !== id);
  persistHistory();
  renderHistory();
  showToast('Đã xóa mục lịch sử!', '🗑️');
}

function toggleHistoryModal() {
  const modal = document.getElementById('historyModal');
  if (!modal) return;
  if (modal.style.display === 'none' || !modal.style.display) {
    renderHistory();
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }
}

function closeHistoryModal(event) {
  const modal = document.getElementById('historyModal');
  if (modal && event.target === modal) {
    modal.style.display = 'none';
  }
}

/* DAY-NIGHT TOGGLE VIEW FUNCTIONALITY */
function toggleDayNightView() {
  toggleCompareDayNight();
}

function toggleCompareDayNight() {
  const switchEl = document.getElementById('compareDayNightSwitch');
  const nightWrap = document.getElementById('osdNightWrap');
  if (!switchEl) return;

  if (compareDayNightState === 'day') {
    compareDayNightState = 'night';
    switchEl.classList.add('night-active');
    if (nightWrap) { nightWrap.style.opacity = '1'; nightWrap.style.pointerEvents = 'auto'; }
  } else {
    compareDayNightState = 'day';
    switchEl.classList.remove('night-active');
    if (nightWrap) { nightWrap.style.opacity = '0'; nightWrap.style.pointerEvents = 'none'; }
  }
}

function resetDayNightView() { resetCompareDayNight(); }

function resetCompareDayNight() {
  compareDayNightState = 'day';
  const switchEl = document.getElementById('compareDayNightSwitch');
  const nightWrap = document.getElementById('osdNightWrap');
  if (switchEl) switchEl.classList.remove('night-active');
  if (nightWrap) { nightWrap.style.opacity = '0'; nightWrap.style.pointerEvents = 'none'; }
}

let imgStatusBadgeTimer = null;
function setImageBadge(state, label, autohideMs) {
  const badge = document.getElementById('imgStatusBadge');
  if (!badge) return;
  // Force re-trigger animations bằng cách tạm xoá rồi thêm lại class
  badge.classList.remove('visible');
  badge.className = 'img-status-badge state-' + state;
  const labelEl = badge.querySelector('.isb-label');
  if (labelEl) labelEl.textContent = label;
  // reflow để animation chạy lại
  void badge.offsetWidth;
  badge.classList.add('visible');
  clearTimeout(imgStatusBadgeTimer);
  if (autohideMs) {
    imgStatusBadgeTimer = setTimeout(() => {
      badge.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      badge.classList.remove('visible');
      setTimeout(() => badge.style.transition = '', 650);
    }, autohideMs);
  }
}

function exportJSON() {
  if (!uploadedImageName) { alert('Upload ảnh trước!'); return }
  const p = document.getElementById('promptBox').value || 'no prompt';
  const s1 = parseInt(document.getElementById('seed1').value);
  const s2 = parseInt(document.getElementById('seed2').value);
  const st = parseInt(document.getElementById('steps').value);
  const cf = parseFloat(document.getElementById('cfg').value);
  const wf = buildWorkflow(uploadedImageName, p, s1, s2, st, cf, loraEnabled);
  const blob = new Blob([JSON.stringify({ prompt: wf }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'recolor-workflow.json'; a.click();
}

function copyPrompt() {
  const p = document.getElementById('promptBox').value;
  if (!p) { showToast('Chưa có prompt để copy', '⚠️'); return }
  navigator.clipboard.writeText(p).then(() => {
    showToast('Đã copy prompt vào clipboard!', '📋');
  });
}


function handleFile(file) {
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    showToast(`Ảnh vượt quá ${MAX_SIZE_MB}MB. Vui lòng chọn ảnh nhỏ hơn.`, '⚠️');
    return;
  }
  uploadedImageName = file.name;
  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedImageBase64 = ev.target.result;
    const pb = document.getElementById('previewBox');
    document.getElementById('previewImg').src = uploadedImageBase64;
    pb.style.display = 'flex';
    document.getElementById('uploadZone').style.display = 'none';
    osdDestroyAll();
    const origEl = document.getElementById('compareOrig');
    if (origEl) origEl.src = uploadedImageBase64;
    osdSetImage('orig', 'osdOrig', uploadedImageBase64);
    setImageBadge('uploaded', 'Ảnh đã tải lên', 2500);
    generatePrompt();
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  uploadedImageBase64 = null; uploadedImageName = null;
  document.getElementById('previewBox').style.display = 'none';
  document.getElementById('uploadZone').style.display = 'block';
  document.getElementById('fileInput').value = '';
}

function triggerWorkflowFile() { document.getElementById('workflowFileInput').click() }

function handleWorkflowFile(files) {
  if (!files || files.length === 0) return;
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      workflowTemplate = JSON.parse(e.target.result);
      document.getElementById('wfName').textContent = file.name;
    } catch (err) { alert('JSON không hợp lệ: ' + err.message) }
  };
  reader.readAsText(file);
}

let activeRowIndexForColor = null;
let kmSearchQuery = '';

function openColorPickerDropdown(event, index) {
  event.stopPropagation();
  activeRowIndexForColor = index;

  // Close any existing dropdown first
  hideColorPickerDropdown();

  // Create dropdown element
  const dropdown = document.createElement('div');
  dropdown.id = 'kmColorDropdown';
  dropdown.className = 'km-color-dropdown';

  // Create search bar
  const searchWrap = document.createElement('div');
  searchWrap.className = 'km-search-wrap';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'km-search-input';
  searchInput.placeholder = 'Tìm mã màu, tên hoặc hex...';
  searchInput.value = kmSearchQuery;
  searchWrap.appendChild(searchInput);
  dropdown.appendChild(searchWrap);

  // Create color list container
  const listContainer = document.createElement('div');
  listContainer.className = 'km-color-list';
  dropdown.appendChild(listContainer);

  document.body.appendChild(dropdown);

  // Position dropdown near the clicked button
  const rect = event.target.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;

  // Ensure the dropdown is positioned within viewport width
  let leftPos = rect.left + window.scrollX;
  if (leftPos + 320 > window.innerWidth) {
    leftPos = window.innerWidth - 340;
  }
  dropdown.style.left = `${leftPos}px`;

  // Focus search input
  searchInput.focus();

  let renderedCount = 100;

  // Render function with infinite scroll support
  function renderList(query, append = false) {
    if (!append) {
      listContainer.innerHTML = '';
      renderedCount = 100;
      listContainer.scrollTop = 0;
    }

    const filtered = (window.KM_COLORS || []).filter(c => {
      const q = query.toLowerCase().trim();
      return !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.hex.toLowerCase().includes(q);
    });

    const toRender = filtered.slice(append ? renderedCount : 0, append ? renderedCount + 100 : 100);

    if (!append && toRender.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.padding = '12px';
      emptyMsg.style.fontSize = '11px';
      emptyMsg.style.color = 'var(--text3)';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.textContent = 'Không tìm thấy màu phù hợp';
      listContainer.appendChild(emptyMsg);
      return;
    }

    toRender.forEach(c => {
      const item = document.createElement('div');
      item.className = 'km-color-item';
      item.innerHTML = `
        <div class="km-color-swatch" style="background-color: ${c.hex}"></div>
        <div class="km-color-details">
          <div class="km-color-name-code">${c.code} - ${c.name}</div>
          <div class="km-color-hex">${c.hex} | RGB: ${c.rgb}</div>
        </div>
      `;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectKMColor(activeRowIndexForColor, c);
      });
      listContainer.appendChild(item);
    });

    if (append) {
      renderedCount += toRender.length;
    }
  }

  // Initial render
  renderList(kmSearchQuery);

  // Input listener
  searchInput.addEventListener('input', (e) => {
    kmSearchQuery = e.target.value;
    renderList(kmSearchQuery);
  });

  // Scroll listener to load more colors dynamically
  listContainer.addEventListener('scroll', () => {
    if (listContainer.scrollTop + listContainer.clientHeight >= listContainer.scrollHeight - 20) {
      renderList(kmSearchQuery, true);
    }
  });
}

function selectKMColor(index, colorObj) {
  const textInput = document.getElementById('val' + index);
  const dot = document.getElementById('dot' + index);
  const picker = document.getElementById('col' + index);

  if (textInput) {
    // Format user-facing text to be clean: Name (Code)
    textInput.value = `${colorObj.name} (${colorObj.code})`;
  }
  if (dot) {
    dot.style.background = colorObj.hex;
    dot.style.borderColor = colorObj.hex;
  }
  if (picker) {
    picker.style.backgroundColor = colorObj.hex;
  }

  generatePrompt();
  hideColorPickerDropdown();
}

function hideColorPickerDropdown() {
  const dropdown = document.getElementById('kmColorDropdown');
  if (dropdown) {
    dropdown.remove();
  }
}

// Global click handler to close color picker dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('kmColorDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const isTrigger = e.target.classList.contains('color-pick') || e.target.closest('.color-pick');
    if (!isTrigger) {
      hideColorPickerDropdown();
    }
  }
});

// Toast helper
function showToast(message, icon = '✓') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* ═══════════════════════════════════════════════════════════════
   MATERIAL REPLACEMENT SYSTEM
   ═══════════════════════════════════════════════════════════════ */

// Track which rows are in material mode: { rowIndex: { enabled: true, materialId: '...', materialData: {...} } }
let materialModeState = {};

function isRowMaterialMode(i) {
  return materialModeState[i] && materialModeState[i].enabled;
}

function toggleMaterialMode(i) {
  if (!materialModeState[i]) {
    materialModeState[i] = { enabled: false, materialId: null, materialData: null };
  }

  const wasEnabled = materialModeState[i].enabled;
  materialModeState[i].enabled = !wasEnabled;

  const toggleBtn = document.getElementById('matToggle' + i);
  const valInput = document.getElementById('val' + i);
  const dot = document.getElementById('dot' + i);
  const colorPickBtn = document.getElementById('col' + i);
  const row = toggleBtn ? toggleBtn.closest('.color-row') : null;

  if (materialModeState[i].enabled) {
    // Switch to MATERIAL mode
    if (toggleBtn) {
      toggleBtn.textContent = '🧱';
      toggleBtn.title = 'Chuyển sang chế độ màu sơn';
      toggleBtn.classList.add('active');
    }
    if (row) row.classList.add('material-mode');
    if (valInput) {
      valInput.value = '';
      valInput.placeholder = 'Chọn vật liệu →';
      valInput.setAttribute('list', 'materialSuggestions');
    }
    if (colorPickBtn) {
      colorPickBtn.style.background = 'linear-gradient(135deg, #8B7355 25%, #A0522D 25%, #A0522D 50%, #6B8E8E 50%, #6B8E8E 75%, #C0C0C0 75%)';
    }
    showToast('Đã bật chế độ vật liệu cho vùng này', '🧱');
  } else {
    // Switch back to COLOR mode
    if (toggleBtn) {
      toggleBtn.textContent = '🎨';
      toggleBtn.title = 'Chuyển sang chế độ vật liệu';
      toggleBtn.classList.remove('active');
    }
    if (row) row.classList.remove('material-mode');
    if (valInput) {
      valInput.value = '';
      valInput.placeholder = '';
      valInput.setAttribute('list', 'colorSuggestions');
    }
    if (dot) {
      dot.style.background = '#CCCCCC';
      dot.style.borderColor = '#CCCCCC';
    }
    if (colorPickBtn) {
      colorPickBtn.style.background = '#CCCCCC';
    }
    materialModeState[i].materialId = null;
    materialModeState[i].materialData = null;
    showToast('Đã chuyển về chế độ màu sơn', '🎨');
  }
  generatePrompt();
}

function openMaterialPickerDropdown(event, index) {
  event.stopPropagation();
  activeRowIndexForColor = index;
  hideColorPickerDropdown();
  hideMaterialPickerDropdown();

  const dropdown = document.createElement('div');
  dropdown.id = 'materialPickerDropdown';
  dropdown.className = 'mat-picker-dropdown';

  // Header
  const header = document.createElement('div');
  header.className = 'mat-picker-header';
  header.innerHTML = '<span class="mat-picker-title">🧱 Thư Viện Vật Liệu</span>';
  dropdown.appendChild(header);

  // Search bar
  const searchWrap = document.createElement('div');
  searchWrap.className = 'mat-search-wrap';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'mat-search-input';
  searchInput.placeholder = 'Tìm vật liệu: đá, gạch, inox, gỗ...';
  searchWrap.appendChild(searchInput);
  dropdown.appendChild(searchWrap);

  // Category tabs
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'mat-category-tabs';
  const allTab = document.createElement('button');
  allTab.className = 'mat-cat-tab active';
  allTab.textContent = 'Tất cả';
  allTab.dataset.cat = 'all';
  tabsWrap.appendChild(allTab);

  (window.MATERIAL_CATEGORIES || []).forEach(cat => {
    const tab = document.createElement('button');
    tab.className = 'mat-cat-tab';
    tab.textContent = `${cat.icon} ${cat.name}`;
    tab.dataset.cat = cat.id;
    tabsWrap.appendChild(tab);
  });
  dropdown.appendChild(tabsWrap);

  // Material list
  const listContainer = document.createElement('div');
  listContainer.className = 'mat-list';
  dropdown.appendChild(listContainer);

  document.body.appendChild(dropdown);

  // Position
  const rect = event.target.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + window.scrollY + 5}px`;
  let leftPos = rect.left + window.scrollX - 150;
  if (leftPos + 380 > window.innerWidth) leftPos = window.innerWidth - 400;
  if (leftPos < 10) leftPos = 10;
  dropdown.style.left = `${leftPos}px`;

  searchInput.focus();

  let activeCategory = 'all';

  function renderMaterials(query) {
    listContainer.innerHTML = '';
    const catalog = window.MATERIAL_CATALOG || [];
    const filtered = catalog.filter(m => {
      const matchCat = activeCategory === 'all' || m.category === activeCategory;
      if (!matchCat) return false;
      if (!query) return true;
      const q = query.toLowerCase().trim();
      return m.name.toLowerCase().includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.promptDesc.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'mat-empty';
      emptyMsg.textContent = 'Không tìm thấy vật liệu phù hợp';
      listContainer.appendChild(emptyMsg);
      return;
    }

    // Group by category if showing all
    if (activeCategory === 'all' && !query) {
      (window.MATERIAL_CATEGORIES || []).forEach(cat => {
        const catMats = filtered.filter(m => m.category === cat.id);
        if (catMats.length === 0) return;
        const catHeader = document.createElement('div');
        catHeader.className = 'mat-cat-header';
        catHeader.textContent = `${cat.icon} ${cat.name}`;
        listContainer.appendChild(catHeader);
        catMats.forEach(m => listContainer.appendChild(createMaterialItem(m, index)));
      });
    } else {
      filtered.forEach(m => listContainer.appendChild(createMaterialItem(m, index)));
    }
  }

  function createMaterialItem(m, idx) {
    const item = document.createElement('div');
    item.className = 'mat-item';
    const isSelected = materialModeState[idx] && materialModeState[idx].materialId === m.id;
    if (isSelected) item.classList.add('selected');

    item.innerHTML = `
      <div class="mat-swatch" style="background-color: ${m.hex}">
        <span class="mat-swatch-icon">${m.icon}</span>
      </div>
      <div class="mat-info">
        <div class="mat-name">${m.name}</div>
        <div class="mat-name-en">${m.nameEn}</div>
      </div>
      <div class="mat-hex-badge">${m.hex}</div>
    `;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectMaterial(idx, m);
    });
    return item;
  }

  renderMaterials('');

  // Tab click handler
  tabsWrap.addEventListener('click', (e) => {
    const tab = e.target.closest('.mat-cat-tab');
    if (!tab) return;
    tabsWrap.querySelectorAll('.mat-cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.cat;
    renderMaterials(searchInput.value);
  });

  // Search handler
  searchInput.addEventListener('input', (e) => {
    renderMaterials(e.target.value);
  });
}

function selectMaterial(index, materialObj) {
  if (!materialModeState[index]) {
    materialModeState[index] = { enabled: true, materialId: null, materialData: null };
  }
  materialModeState[index].materialId = materialObj.id;
  materialModeState[index].materialData = materialObj;

  const valInput = document.getElementById('val' + index);
  const dot = document.getElementById('dot' + index);
  const colorPickBtn = document.getElementById('col' + index);

  if (valInput) valInput.value = materialObj.name;
  if (dot) {
    dot.style.background = materialObj.hex;
    dot.style.borderColor = materialObj.hex;
  }
  if (colorPickBtn) {
    colorPickBtn.style.background = materialObj.hex;
  }

  generatePrompt();
  hideMaterialPickerDropdown();
  showToast(`Đã chọn: ${materialObj.name}`, materialObj.icon);
}

function hideMaterialPickerDropdown() {
  const dd = document.getElementById('materialPickerDropdown');
  if (dd) dd.remove();
}

// Route color picker button to material picker when row is in material mode
const __origOpenColorPickerDropdown = openColorPickerDropdown;
openColorPickerDropdown = function (event, index) {
  if (isRowMaterialMode(index)) {
    openMaterialPickerDropdown(event, index);
    return;
  }
  __origOpenColorPickerDropdown(event, index);
};

// Close material picker on outside click
document.addEventListener('click', (e) => {
  const dd = document.getElementById('materialPickerDropdown');
  if (dd && !dd.contains(e.target)) {
    const isTrigger = e.target.classList.contains('color-pick') || e.target.closest('.color-pick') ||
      e.target.classList.contains('mat-toggle-btn') || e.target.closest('.mat-toggle-btn');
    if (!isTrigger) {
      hideMaterialPickerDropdown();
    }
  }
});

/* ═══════════════════════════════════════════════════════════════
   MODIFIED: formatColorForPrompt — supports material descriptions
   ═══════════════════════════════════════════════════════════════ */
function formatForPromptWithMaterial(index, val) {
  // If this row is in material mode and has a selected material
  if (isRowMaterialMode(index) && materialModeState[index].materialData) {
    const mat = materialModeState[index].materialData;
    return `material: ${mat.promptDesc}`;
  }
  // Otherwise use existing color format logic
  return formatColorForPrompt(val);
}

/* ══════════════════════════════════════════
   OPENSEADRAGON VIEWER MANAGER
══════════════════════════════════════════ */
const osdViewers = {}; // key -> OpenSeadragon.Viewer instance

function getOsdDefaults(containerId) {
  return {
    id: containerId,
    prefixUrl: '/lib/osd-images/',
    showNavigationControl: false, // custom toolbar, không dùng built-in
    gestureSettingsMouse: { clickToZoom: true, dblClickToZoom: false, scrollToZoom: true },
    gestureSettingsTouch: { pinchToZoom: true, clickToZoom: false },
    animationTime: 0.4,
    blendTime: 0.1,
    constrainDuringPan: true,
    maxZoomPixelRatio: 4,
    minZoomImageRatio: 0.8,
    visibilityRatio: 0.5,
    showNavigator: false,
    backgroundOpacity: 0,
  };
}

function osdCreateToolbar(viewer, wrapEl, isResultStack) {
  // Xóa toolbar cũ nếu có (dùng data-osd-toolbar để phân biệt với toolbar orig)
  const selector = isResultStack ? '.osd-toolbar[data-stack="result"]' : '.osd-toolbar:not([data-stack])';
  const old = wrapEl.querySelector(selector);
  if (old) old.remove();

  const bar = document.createElement('div');
  bar.className = 'osd-toolbar';
  if (isResultStack) bar.dataset.stack = 'result';
  bar.innerHTML = `
    <button class="osd-btn" data-action="zoomin"  title="Zoom in">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><line x1="15.5" y1="15.5" x2="21" y2="21"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
    </button>
    <button class="osd-btn" data-action="zoomout" title="Zoom out">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><line x1="15.5" y1="15.5" x2="21" y2="21"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
    </button>
    <button class="osd-btn" data-action="home"    title="Fit toàn ảnh">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12L12 4l9 8"/><path d="M9 21V12h6v9"/></svg>
    </button>
    <button class="osd-btn" data-action="full"    title="Toàn màn hình">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
    </button>`;

  bar.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    // Nếu toolbar nằm trong result-viewer-stack, điều khiển viewer đang hiển thị
    const activeViewer = isResultStack
      ? (osdViewers[compareDayNightState] || viewer)
      : viewer;
    if (!activeViewer || !activeViewer.isOpen() || !activeViewer.viewport) {
      console.warn('[OSD toolbar] viewer not ready', { isOpen: activeViewer?.isOpen(), hasVP: !!activeViewer?.viewport });
      return;
    }
    switch (btn.dataset.action) {
      case 'zoomin': activeViewer.viewport.zoomBy(1.5, activeViewer.viewport.getCenter()); activeViewer.viewport.applyConstraints(); break;
      case 'zoomout': activeViewer.viewport.zoomBy(1 / 1.5, activeViewer.viewport.getCenter()); activeViewer.viewport.applyConstraints(); break;
      case 'home': activeViewer.viewport.goHome(true); break;
      case 'full': activeViewer.setFullScreen(!activeViewer.isFullPage()); break;
    }
  });

  wrapEl.appendChild(bar);
}

function osdInit(key, containerId, imageUrl) {
  if (!window.OpenSeadragon) return;
  osdDestroy(key);
  const viewer = OpenSeadragon({
    ...getOsdDefaults(containerId),
    tileSources: {
      type: 'image',
      url: imageUrl,
      buildPyramid: false,
    },
  });
  osdViewers[key] = viewer;

  // Gắn toolbar vào result-viewer-stack (grandparent) cho day/night để tránh bị night overlay che
  const container = document.getElementById(containerId);
  const wrap = container?.parentElement;
  const isResultStack = key === 'day' || key === 'night';
  const toolbarHost = isResultStack ? wrap?.parentElement : wrap;
  if (toolbarHost) osdCreateToolbar(viewer, toolbarHost, isResultStack);
}

function osdDestroy(key) {
  if (osdViewers[key]) {
    try { osdViewers[key].destroy(); } catch (_) { }
    delete osdViewers[key];
  }
}

function osdSetImage(key, containerId, imageUrl) {
  if (!window.OpenSeadragon || !imageUrl) return;
  if (osdViewers[key]) {
    osdViewers[key].open({ type: 'image', url: imageUrl, buildPyramid: false });
    // Đảm bảo toolbar tồn tại
    const container = document.getElementById(containerId);
    const wrap = container?.parentElement;
    const isResultStack = key === 'day' || key === 'night';
    const toolbarHost = isResultStack ? wrap?.parentElement : wrap;
    const stackSel = isResultStack ? '.osd-toolbar[data-stack="result"]' : '.osd-toolbar:not([data-stack])';
    if (toolbarHost && !toolbarHost.querySelector(stackSel)) osdCreateToolbar(osdViewers[key], toolbarHost, isResultStack);
  } else {
    osdInit(key, containerId, imageUrl);
  }
}

function osdDestroyAll() {
  ['orig', 'day', 'night'].forEach(k => osdDestroy(k));
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  updateAddRowBtn();

  const fi = document.getElementById('fileInput');
  const uz = document.getElementById('uploadZone');
  const pb = document.getElementById('previewBox');

  // Input change
  fi.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]) });

  // Drag and drop on upload zone
  uz.addEventListener('dragover', (e) => { e.preventDefault(); uz.classList.add('drag-over') });
  uz.addEventListener('dragleave', () => uz.classList.remove('drag-over'));
  uz.addEventListener('drop', (e) => { e.preventDefault(); uz.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) });

  // Drag and drop on preview box (allows automatic replacement)
  pb.addEventListener('dragover', (e) => { e.preventDefault(); pb.classList.add('drag-over') });
  pb.addEventListener('dragleave', () => pb.classList.remove('drag-over'));
  pb.addEventListener('drop', (e) => { e.preventDefault(); pb.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]) });

  // Click on preview box (excluding remove button) triggers file selector for replacement
  pb.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) return;
    fi.click();
  });

  // Clipboard Paste (Ctrl+V)
  document.addEventListener('paste', (e) => {
    const active = document.activeElement;
    if (active && (
      (active.tagName === 'INPUT' && active.type !== 'file') ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    )) {
      return; // Let standard text paste happen
    }

    const files = (e.clipboardData || window.clipboardData).files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleFile(file);
        showToast('Đã dán ảnh từ clipboard!', '📷');
      }
    } else {
      const items = (e.clipboardData || window.clipboardData).items;
      for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            showToast('Đã dán ảnh từ clipboard!', '📷');
            break;
          }
        }
      }
    }
  });

  // Clipboard Copy (Ctrl+C)
  document.addEventListener('keydown', async (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      const active = document.activeElement;
      if (active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.isContentEditable
      )) {
        return; // Let standard text copy happen
      }

      if (uploadedImageBase64) {
        e.preventDefault();
        try {
          const res = await fetch(uploadedImageBase64);
          const blob = await res.blob();
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ]);
          showToast('Đã copy ảnh đầu vào vào clipboard!', '📋');
        } catch (err) {
          console.error(err);
          showToast('Không thể copy ảnh: ' + err.message, '❌');
        }
      }
    }
  });

  // Load history từ file (proxy) hoặc localStorage fallback
  await loadHistory();

  // Check CORS policy when loading from file:// protocol
  if (window.location.protocol === 'file:') {
    showCORSWarningOverlay();
  }

  // Load default workflow
  fetch('day_night.json').then(r => r.json()).then(j => { workflowTemplate = j; document.getElementById('wfName').textContent = 'day_night.json' }).catch(() => { });
  // Populate color suggestions datalist dynamically
  const colorSuggestions = document.getElementById('colorSuggestions');
  if (colorSuggestions && window.KM_COLORS) {
    window.KM_COLORS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = `${c.name} (${c.code})`;
      colorSuggestions.appendChild(opt);
    });
  }

  resetDayNightView();
  generatePrompt();
});

function showCORSWarningOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'cors-warning-overlay';
  overlay.innerHTML = `
    <div class="cors-warning-box">
      <div class="cors-warning-icon">⚠️</div>
      <h3>Lỗi Bảo Mật CORS (Giao thức File://)</h3>
      <p>Bạn đang mở trực tiếp file HTML từ thư mục. Trình duyệt chặn các yêu cầu gửi ảnh và tải cấu hình do chính sách bảo mật CORS của giao thức file://.</p>
      <div class="cors-warning-steps">
        <p><strong>Để ứng dụng chạy chính xác, vui lòng thực hiện:</strong></p>
        <ol>
          <li>Kích đúp vào file <code>run_all.bat</code> trong thư mục dự án để tự động chạy Server và ComfyUI.</li>
          <li>Hoặc chạy lệnh sau trong thư mục bằng terminal: <code>python proxy_server.py</code></li>
          <li>Mở trình duyệt và truy cập vào đường dẫn: <a href="http://127.0.0.1:8189/recolor.html">http://127.0.0.1:8189/recolor.html</a></li>
        </ol>
      </div>
      <button class="run-btn" onclick="window.location.href='http://127.0.0.1:8189/recolor.html'">Chuyển Sang Localhost (Cổng 8189)</button>
    </div>
  `;
  document.body.appendChild(overlay);
}
