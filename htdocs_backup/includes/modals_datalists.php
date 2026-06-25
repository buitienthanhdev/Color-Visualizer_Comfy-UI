<?php
/**
 * includes/modals_datalists.php
 * ─────────────────────────────────────────────────────────────────
 * Module: Modals & Datalists — các thành phần toàn cục ngoài layout
 *
 * Gồm:
 *   1. History modal  — popup lịch sử phối màu (toggle bằng JS)
 *   2. #areaSuggestions  — datalist gợi ý tên vùng (ngoại/nội thất)
 *   3. #colorSuggestionsDisabled — datalist màu (disabled, tránh 24K DOM nodes)
 *   4. #materialSuggestions — datalist tên vật liệu cho material mode
 *
 * Nhúng vào: index.php, trước thẻ đóng </body>
 * Phụ thuộc JS: app.js (toggleHistoryModal, closeHistoryModal)
 * ─────────────────────────────────────────────────────────────────
 */
?>

<!-- ── HISTORY MODAL ─────────────────────────────────────────── -->
<div class="modal-overlay" id="historyModal" style="display:none"
  onclick="closeHistoryModal(event)">
  <div class="modal-content" onclick="event.stopPropagation()">
    <div class="modal-header">
      <h3>Lịch Sử Phối Màu</h3>
      <button class="modal-close" onclick="toggleHistoryModal()">&#10005;</button>
    </div>
    <div class="history-list" id="historyList">
      <div class="history-empty">Chưa có lịch sử phối màu nào</div>
    </div>
  </div>
</div>

<!-- ── DATALISTS ─────────────────────────────────────────────── -->

<!--
  areaSuggestions: gợi ý tên vùng màu khi gõ vào input .color-name
  Chia 2 nhóm: ngoại thất và nội thất
-->
<datalist id="areaSuggestions">
  <!-- Ngoại thất -->
  <option value="walls, texture, large-sized material"></option>
  <option value="trims/vignette"></option>
  <option value="doors/windows"></option>
  <option value="roof tiles"></option>
  <option value="exterior walls"></option>
  <option value="facade cladding"></option>
  <option value="balcony railings"></option>
  <option value="fence/boundary wall"></option>
  <option value="entrance gate"></option>
  <option value="pillars/columns"></option>
  <option value="window frames"></option>
  <option value="shutters"></option>
  <!-- Nội thất -->
  <option value="interior walls"></option>
  <option value="ceiling"></option>
  <option value="floor tiles"></option>
  <option value="wood floor"></option>
  <option value="kitchen cabinets"></option>
  <option value="kitchen island"></option>
  <option value="bathroom tiles"></option>
  <option value="bathroom vanity"></option>
  <option value="accent wall"></option>
  <option value="built-in shelves"></option>
</datalist>

<!--
  colorSuggestionsDisabled: ID đổi thành disabled để app.js tìm không ra,
  tránh inject 24.369 option từ all_colors.js vào DOM khi load.
-->
<datalist id="colorSuggestionsDisabled"></datalist>

<!--
  materialSuggestions: dùng bởi material mode toggle trong color rows
-->
<datalist id="materialSuggestions">
  <option value="Da granite tu nhien"></option>
  <option value="Da cam thach trang Carrara"></option>
  <option value="Gach do truyen thong"></option>
  <option value="Inox xuoc mo"></option>
  <option value="Go soi tu nhien"></option>
  <option value="Gach bong hoa van"></option>
  <option value="Da slate xam den"></option>
  <option value="Kinh cuong luc phan quang"></option>
</datalist>
