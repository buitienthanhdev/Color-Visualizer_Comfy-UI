<?php
/**
 * includes/scripts.php
 * ─────────────────────────────────────────────────────────────────
 * Module: Script tags — thứ tự load JS quan trọng
 *
 * Thứ tự bắt buộc:
 *   1. materials.js     — dữ liệu vật liệu (window.MATERIALS_DATA)
 *   2. all_colors.js    — 24.369 màu từ 4 brand (window.KM_COLORS)
 *   3. app.js           — logic chính: upload, ComfyUI API, OSD, prompt
 *   4. palette_data.js  — 880 màu curated cho wizard (window.PALETTE_DATA)
 *   5. wizard.js        — 5-step wizard logic (dùng PALETTE_DATA + KM_COLORS)
 *   6. openseadragon    — zoom/pan viewer (load sau cùng, không block render)
 *
 * Nhúng vào: index.php, trước thẻ đóng </body>, sau modals_datalists.php
 * ─────────────────────────────────────────────────────────────────
 */
?>
<script src="materials.js?v=2.3"></script>
<script src="all_colors.js?v=1.0"></script>
<script src="app.js?v=3.5"></script>
<script src="palette_data.js?v=1.0"></script>
<script src="wizard.js?v=1.0"></script>
<script src="lib/openseadragon.min.js"></script>
