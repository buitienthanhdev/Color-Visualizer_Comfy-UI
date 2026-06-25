<?php
/**
 * includes/wizard_panel.php
 * ─────────────────────────────────────────────────────────────────
 * Module: Left panel — 5-step wizard UI
 *
 * Bước 1  Upload ảnh công trình
 * Bước 2  Chọn loại không gian (exterior / interior)
 * Bước 3  Sở thích màu (yêu thích / không thích)
 * Bước 4  Xem & chọn bộ phối màu do AI đề xuất
 * Bước 5  Áp dụng màu vào vùng + chạy phối màu AI
 *
 * Nhúng vào: index.php, bên trong .panel-left
 * Phụ thuộc JS: wizard.js, app.js
 * Phụ thuộc CSS: wizard.css
 * Ghi chú: Các ID ẩn cuối file là compat shim — app.js cần các
 *          input này tồn tại trong DOM dù không hiển thị trong wizard
 * ─────────────────────────────────────────────────────────────────
 */
?>
<div class="panel-left wizard-mode">

  <!-- ── PROGRESS BAR (5 bước) ───────────────────────────────── -->
  <div class="wz-progress" id="wzProgress">
    <div class="wz-step-item" data-step="1">
      <div class="wz-step-bubble">1</div>
      <div class="wz-step-label">Upload</div>
    </div>
    <div class="wz-step-connector"></div>
    <div class="wz-step-item" data-step="2">
      <div class="wz-step-bubble">2</div>
      <div class="wz-step-label">Không gian</div>
    </div>
    <div class="wz-step-connector"></div>
    <div class="wz-step-item" data-step="3">
      <div class="wz-step-bubble">3</div>
      <div class="wz-step-label">Sở thích</div>
    </div>
    <div class="wz-step-connector"></div>
    <div class="wz-step-item" data-step="4">
      <div class="wz-step-bubble">4</div>
      <div class="wz-step-label">Palette</div>
    </div>
    <div class="wz-step-connector"></div>
    <div class="wz-step-item" data-step="5">
      <div class="wz-step-bubble">5</div>
      <div class="wz-step-label">Áp dụng</div>
    </div>
  </div>

  <!-- ── WIZARD BODY ─────────────────────────────────────────── -->
  <div class="wz-body">

    <!-- STEP 1: Upload ảnh -->
    <div class="wz-panel" id="wzPanel1">
      <div class="wz-panel-title">Bước 1 - Tải ảnh công trình</div>
      <input type="file" id="fileInput" accept="image/*" style="display:none">
      <div id="wzUploadZone">
        <span class="wz-upload-icon">&#128193;</span>
        <p><strong>Chon anh</strong> hoặc kéo thả vào đây</p>
        <small>JPG, PNG, WEBP - Tối đa 10MB</small>
      </div>
      <div class="wz-preview-box" id="wzPreviewBox">
        <img id="wzPreviewImg" src="" alt="preview">
        <button class="wz-remove-btn" id="wzRemoveBtn" title="Xoa anh">&#10005;</button>
      </div>
      <div class="wz-upload-hint">Ảnh sẽ được gửi trực tiếp tới AI để phối màu.</div>
      <div class="wz-nav">
        <button class="wz-btn-next" id="wzNext1" disabled onclick="wzCompleteStep(1)">Tiếp theo &#8594;</button>
      </div>
    </div>

    <!-- STEP 2: Loại công trình -->
    <div class="wz-panel" id="wzPanel2">
      <div class="wz-panel-title">Bước 2 - Loại công trình</div>
      <div class="wz-type-cards">
        <div class="wz-type-card" data-type="exterior" onclick="wzSelectProjectType('exterior')">
          <div class="wz-type-icon">&#127968;</div>
          <div class="wz-type-label">Ngoài trời</div>
          <div class="wz-type-desc">Mặt tiền, tường ngoài, công trình, hàng rào</div>
        </div>
        <div class="wz-type-card" data-type="interior" onclick="wzSelectProjectType('interior')">
          <div class="wz-type-icon">&#128715;</div>
          <div class="wz-type-label">Nội thất</div>
          <div class="wz-type-desc">Phòng khách, phòng ngủ, không gian trong nhà</div>
        </div>
      </div>
      <!-- Compat: app.js gọi setProjectType() bằng các button này -->
      <div style="display:none">
        <button id="typeExteriorBtn" onclick="setProjectType('exterior')"></button>
        <button id="typeInteriorBtn" onclick="setProjectType('interior')"></button>
      </div>
      <div class="wz-nav">
        <button class="wz-btn-back" onclick="wzGoTo(1)">&#8592; Quay lai</button>
        <button class="wz-btn-next" id="wzNext2" disabled onclick="wzCompleteStep(2)">Tiếp theo &#8594;</button>
      </div>
    </div>

    <!-- STEP 3: Sở thích màu -->
    <div class="wz-panel" id="wzPanel3">
      <div class="wz-panel-title">Bước 3 - Sở thích màu sắc</div>

      <!-- Màu yêu thích -->
      <div class="wz-pref-section">
        <div class="wz-pref-header">
          <span class="wz-pref-icon">&#9829;</span>
          Màu yêu thích
          <span style="font-size:10px;color:var(--text3);font-weight:400">(tăng ưu tiên trong gợi ý màu)</span>
        </div>
        <div class="wz-presets-label">Chọn nhanh:</div>
        <div class="wz-pref-presets" id="wzFavPresets"></div>
        <div class="wz-pref-input-row">
          <input class="wz-pref-input" id="wzFavInput" type="text" placeholder="Nhap ten mau, vi du: Sage Green...">
          <button class="wz-pref-add-btn" id="wzFavAdd">+ Thêm</button>
        </div>
        <div class="wz-pref-tags" id="wzFavTags"></div>
      </div>

      <!-- Màu không thích -->
      <div class="wz-pref-section">
        <div class="wz-pref-header">
          <span class="wz-pref-icon">&#10005;</span>
          Màu không thích
          <span style="font-size:10px;color:var(--text3);font-weight:400">(loại khỏi toàn bộ gợi ý màu)</span>
        </div>
        <div class="wz-presets-label">Chọn nhanh:</div>
        <div class="wz-pref-presets" id="wzDisPresets"></div>
        <div class="wz-pref-input-row">
          <input class="wz-pref-input" id="wzDisInput" type="text" placeholder="Nhap ten mau, vi du: Orange...">
          <button class="wz-pref-add-btn" id="wzDisAdd">+ Thêm</button>
        </div>
        <div class="wz-pref-tags" id="wzDisTags"></div>
      </div>

      <div class="wz-nav">
        <button class="wz-btn-back" onclick="wzGoTo(2)">&#8592; Quay lai</button>
        <button class="wz-btn-next" onclick="wzCompleteStep(3)">Tạo gợi ý &#8594;</button>
      </div>
    </div>

    <!-- STEP 4: Chọn bộ phối màu -->
    <div class="wz-panel" id="wzPanel4">
      <div class="wz-panel-title">Bước 4 - Chọn bộ phối màu</div>
      <div id="wzPaletteContainer"></div>
      <div class="wz-nav">
        <button class="wz-btn-back" onclick="wzGoTo(3)">&#8592; Quay lai</button>
      </div>
    </div>

    <!-- STEP 5: Áp dụng & Chạy -->
    <div class="wz-panel" id="wzPanel5">
      <div class="wz-panel-title">Bước 5 - Áp dụng &amp; Chạy phối màu</div>

      <!-- Tóm tắt combo đã chọn (swatches + brand + combo#) -->
      <div class="wz-selected-summary" id="wzSelectedSummary"></div>

      <!-- Vùng phối màu (tối đa 3 rows — giới hạn bởi app.js MAX_COLOR_ROWS) -->
      <div class="section" style="padding:0">
        <div class="section-title">Phối màu theo vùng</div>
        <div id="colorTargets">
          <div class="color-row" id="row0">
            <div class="color-dot" id="dot0" style="background:#B22222;border-color:#B22222"></div>
            <input class="color-name" id="area0" value="walls, texture, large-sized material"
              list="areaSuggestions" oninput="generatePrompt()">
            <input class="color-val" id="val0" value="deep red"
              list="colorSuggestions" oninput="syncFromText(0)">
            <button class="color-pick" id="col0" style="background-color:#B22222"
              onclick="openColorPickerDropdown(event, 0)"></button>
            <button class="mat-toggle-btn" id="matToggle0" onclick="toggleMaterialMode(0)"
              title="Chuyen sang che do vat lieu">&#127912;</button>
          </div>
          <div class="color-row" id="row1">
            <div class="color-dot" id="dot1" style="background:#FFFFFF;border-color:#E2E8F0"></div>
            <input class="color-name" id="area1" value="trims/vignette"
              list="areaSuggestions" oninput="generatePrompt()">
            <input class="color-val" id="val1" value="white"
              list="colorSuggestions" oninput="syncFromText(1)">
            <button class="color-pick" id="col1" style="background-color:#FFFFFF"
              onclick="openColorPickerDropdown(event, 1)"></button>
            <button class="mat-toggle-btn" id="matToggle1" onclick="toggleMaterialMode(1)"
              title="Chuyen sang che do vat lieu">&#127912;</button>
          </div>
          <div class="color-row" id="row2">
            <div class="color-dot" id="dot2" style="background:#000000;border-color:#000000"></div>
            <input class="color-name" id="area2" value="doors/windows"
              list="areaSuggestions" oninput="generatePrompt()">
            <input class="color-val" id="val2" value="black"
              list="colorSuggestions" oninput="syncFromText(2)">
            <button class="color-pick" id="col2" style="background-color:#000000"
              onclick="openColorPickerDropdown(event, 2)"></button>
            <button class="mat-toggle-btn" id="matToggle2" onclick="toggleMaterialMode(2)"
              title="Chuyen sang che do vat lieu">&#127912;</button>
          </div>
        </div>
        <button class="btn-add-row" onclick="addColorRow()">+ Thêm Vùng Phối Màu</button>
      </div>

      <!-- Mô tả thiết kế + quick chips -->
      <div class="section" style="padding:0">
        <div class="section-title">Mô tả thiết kế</div>
        <textarea class="prompt-box" id="promptBox"
          placeholder="Mô tả phong cách thiết kế hoặc yêu cầu phối màu thêm vào đây..."></textarea>
        <div class="quick-chips">
          <div class="chip" onclick="setQuick('exterior')">&#127968; Ngoại thất</div>
          <div class="chip" onclick="setQuick('villa')">&#127963; Biệt thự</div>
          <div class="chip" onclick="setQuick('apartment')">&#127970; Chung cư</div>
          <div class="chip" onclick="setQuick('office')">&#127970; Văn phòng</div>
          <div class="chip" onclick="setQuick('roof')">&#127959; Mái nhà</div>
          <div class="chip" onclick="setQuick('interior')">&#128715; Nội thất</div>
          <div class="chip" onclick="setQuick('bedroom')">&#127761; Phòng ngủ</div>
          <div class="chip" onclick="setQuick('kitchen')">&#127859; Nhà bếp</div>
          <div class="chip" onclick="setQuick('bathroom')">&#128716; Phòng tắm</div>
          <div class="chip" onclick="setQuick('floor')">&#129007; Sàn nhà</div>
        </div>
        <button class="btn-gen-prompt" onclick="generatePrompt()">&#10024; Tự Động Tạo Ý Tưởng Phối Màu</button>
      </div>

      <button class="wz-run-btn" id="runBtn" onclick="runWorkflow()">
        <span>&#9654;</span>
        <span id="runLabel">Chạy Phối Màu AI</span>
      </button>

      <div class="wz-nav" style="margin-top:0">
        <button class="wz-btn-back" onclick="wzGoTo(4)">&#8592; Đổi palette</button>
      </div>
    </div>

  </div><!-- /.wz-body -->

  <!-- ── COMPAT SHIM ──────────────────────────────────────────── -->
  <!--
    Các ID dưới đây là bắt buộc để app.js hoạt động nhưng không
    hiển thị trong giao diện wizard. Không xóa block này.
  -->
  <div style="display:none">
    <div class="toggle-row">
      <button class="toggle-switch on" id="loraToggle" onclick="toggleLora()"></button>
    </div>
    <input type="number" id="steps" value="4">
    <input type="number" id="cfg" value="1">
    <input type="number" id="seed1" value="89304584069988">
    <input type="number" id="seed2" value="387225672630853">
    <span id="wfName">Loading...</span>
    <input type="file" id="workflowFileInput" accept="application/json"
      onchange="handleWorkflowFile(this.files)">
    <div id="previewBox">
      <img id="previewImg" src="" alt="">
      <button onclick="removeImage()">x</button>
    </div>
    <div id="uploadZone"></div>
  </div>

</div><!-- /.panel-left -->
