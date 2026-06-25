<?php
/**
 * includes/result_panel.php
 * ─────────────────────────────────────────────────────────────────
 * Module: Right panel — khu vực hiển thị ảnh kết quả
 *
 * Gồm:
 *   - Progress bar (ComfyUI queue progress)
 *   - Placeholder (hiện khi chưa có kết quả)
 *   - Split-view: OSD viewer gốc (trái) vs kết quả ngày/đêm (phải)
 *   - Day/Night toggle switch (overlay trên result-viewer-stack)
 *   - Download button
 *   - History modal (popup lịch sử phối màu)
 *
 * Nhúng vào: index.php, sau wizard_panel.php, bên trong .layout
 * Phụ thuộc JS: app.js (osdInit, toggleCompareDayNight, downloadResult...)
 * Phụ thuộc lib: openseadragon.min.js
 * ─────────────────────────────────────────────────────────────────
 */
?>
<div class="panel-right">

  <!-- ── TOPBAR: tiêu đề + badge trạng thái ảnh ─────────────── -->
  <div class="right-top">
    <div style="display:flex;align-items:center;gap:10px">
      <h2>Không Gian Phối Màu</h2>
      <button class="btn-history" id="historyBtn" onclick="toggleHistoryModal()"
        title="Lịch sử phối màu">
        <img src="image/history.png" alt="Lịch sử phối màu" class="history-icon-img">
      </button>
    </div>

    <!-- Badge trạng thái: spinner khi đang xử lý, check khi xong -->
    <div class="img-status-badge state-uploaded" id="imgStatusBadge">
      <span class="isb-icon">
        <svg class="isb-spinner" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.15)" stroke-width="2.5" />
          <path d="M12 3 A9 9 0 0 1 21 12" stroke="url(#isb-grad)" stroke-width="2.5" stroke-linecap="round" />
          <defs>
            <linearGradient id="isb-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#FCD34D" stop-opacity="0" />
              <stop offset="100%" stop-color="#FCD34D" />
            </linearGradient>
          </defs>
        </svg>
        <svg class="isb-check" viewBox="0 0 12 12">
          <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
        </svg>
      </span>
      <span class="isb-label">Ảnh đã tải lên</span>
      <span class="isb-particles" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </span>
    </div>
    <div class="badges"></div>
  </div>

  <!-- ── PROGRESS BAR ComfyUI ────────────────────────────────── -->
  <div style="display:flex;align-items:center;gap:10px">
    <div class="progress-bar-wrap">
      <div class="progress-bar" id="progressBar"></div>
    </div>
    <span id="progressLabel"
      style="font-size:11px;font-weight:600;color:var(--text2);min-width:32px;text-align:right">0%</span>
  </div>

  <!-- ── RESULT AREA ──────────────────────────────────────────── -->
  <div class="result-area">
    <div class="result-body" id="resultBody">

      <!-- Placeholder hiện trước khi có kết quả -->
      <div class="result-placeholder" id="placeholder">
        <div class="big-icon">&#127963;</div>
        <p>Hoàn thành 5 bước bên trái để phối màu công trình với <strong>AI</strong>.</p>
      </div>

      <!-- LightGallery anchors (ẩn, dùng để mở fullscreen gallery) -->
      <div id="lgGallery" style="display:none">
        <a href="" id="lgOrigLink" data-sub-html="<h4>Bản vẽ gốc</h4>"></a>
        <a href="" id="lgResultLink" data-sub-html="<h4>Ảnh phối màu - Ban ngày</h4>"></a>
        <a href="" id="lgNightLink" data-sub-html="<h4>Ảnh phối màu - Ban đêm</h4>"></a>
      </div>

      <!-- Split-view: Bản gốc | Kết quả (ẩn cho đến khi có result) -->
      <div class="split-view" id="splitView" style="display:none">

        <!-- Trái: ảnh gốc qua OpenSeadragon -->
        <div class="split-pane">
          <div class="osd-viewer-wrap" id="osdOrigWrap">
            <div class="osd-container" id="osdOrig"></div>
          </div>
          <img id="compareOrig" src="" alt="" style="display:none">
          <div class="split-label">Bản vẽ gốc</div>
        </div>

        <div class="split-divider"></div>

        <!-- Phải: kết quả ngày (base) + đêm (overlay) + switch toggle -->
        <div class="split-pane result-pane">
          <div class="result-viewer-stack">

            <!-- Day viewer (z-index thấp hơn, luôn hiện) -->
            <div class="osd-viewer-wrap" id="osdDayWrap">
              <div class="osd-container" id="osdDay"></div>
            </div>

            <!-- Night viewer (overlay, ẩn mặc định, hiện khi bật switch) -->
            <div class="osd-viewer-wrap osd-night-overlay" id="osdNightWrap">
              <div class="osd-container" id="osdNight"></div>
            </div>

            <!-- Day/Night toggle switch (góc trên trái của stack) -->
            <div class="swdc-switch-container">
              <div class="swdc-switch" id="compareDayNightSwitch"
                onclick="toggleCompareDayNight()" title="Chuyen che do ngay/dem">
                <div class="swdc-switch__knob"></div>
                <!-- Icon mặt trời -->
                <div class="swdc-switch__icon swdc-switch__icon--left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                    viewBox="0 0 256 256">
                    <path d="M120 40V16a8 8 0 1 1 16 0v24a8 8 0 1 1-16 0zm72 88c0 35.346-28.654 64-64 64-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64 35.33.039 63.961 28.67 64 64zm-16 0c0-26.51-21.49-48-48-48s-48 21.49-48 48 21.49 48 48 48c26.498-.028 47.972-21.502 48-48zM42.34 53.66a8.004 8.004 0 0 1 11.32-11.32l16 16a8.004 8.004 0 0 1-11.32 11.32zm27.32 132.68a8.004 8.004 0 0 1 0 11.32l-16 16a8.004 8.004 0 0 1-11.32-11.32l16-16a8.004 8.004 0 0 1 11.32 0zM184.603 67.062a8 8 0 0 1 1.737-8.722l16-16a8.004 8.004 0 0 1 11.32 11.32l-16 16a8 8 0 0 1-7.397 4.938zM213.66 202.34a8.004 8.004 0 0 1-11.32 11.32l-16-16a8.004 8.004 0 0 1 11.32-11.32zM40 136H16a8 8 0 1 1 0-16h24a8 8 0 1 1 0 16zm96 80v24a8 8 0 1 1-16 0v-24a8 8 0 1 1 16 0zm112-88a8 8 0 0 1-8 8h-24a8 8 0 1 1 0-16h24a8 8 0 0 1 8 8z"></path>
                  </svg>
                </div>
                <!-- Icon mặt trăng -->
                <div class="swdc-switch__icon swdc-switch__icon--right">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                    viewBox="0 0 256 256">
                    <path d="M235.52 150.21a104.84 104.84 0 0 1-37 52.91A103.09 103.09 0 0 1 136 224c-39.448.037-75.522-22.248-93.144-57.541C25.234 131.166 29.096 88.94 52.83 57.43a104.84 104.84 0 0 1 52.91-37 8 8 0 0 1 10 10 88.08 88.08 0 0 0 109.8 109.8 8 8 0 0 1 8 2 8 8 0 0 1 1.98 7.98zm-20.6 8.73A106 106 0 0 1 200 160c-57.412-.06-103.94-46.588-104-104a106 106 0 0 1 1.06-14.89 89 89 0 0 0-31.4 26c-26.385 35.036-22.942 84.153 8.073 115.166 31.015 31.013 80.133 34.452 115.167 8.064a89 89 0 0 0 26.02-31.4z"></path>
                  </svg>
                </div>
              </div>
            </div>

          </div><!-- /.result-viewer-stack -->

          <!-- Ảnh ẩn dùng làm tham chiếu export / history -->
          <img id="compareResultDay" src="" alt="" style="display:none">
          <img id="compareResultNight" src="" alt="" style="display:none">
          <div class="split-label">Ảnh phối màu</div>
        </div>

      </div><!-- /#splitView -->
    </div><!-- /#resultBody -->

    <!-- Download button -->
    <div class="result-footer">
      <button class="btn-action" id="downloadBtn" onclick="downloadResult()" disabled>
        &#8595; Tải ảnh phối màu
      </button>
    </div>
  </div><!-- /.result-area -->

</div><!-- /.panel-right -->
