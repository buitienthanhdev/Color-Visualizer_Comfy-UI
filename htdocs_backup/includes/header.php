<?php
/**
 * includes/header.php
 * ─────────────────────────────────────────────────────────────────
 * Module: Header bar — logo, brand name, server status pill
 * Nhúng vào: index.php, bên trong <body> trước .layout
 * Ghi chú: #serverUrl value="/api" trỏ tới proxy_server.py
 *          qua Nginx/Apache reverse-proxy hoặc localhost:8188
 * ─────────────────────────────────────────────────────────────────
 */
?>
<div class="header">
  <div class="brand-wrap">
    <img src="image/logo-painmore.png" alt="PAINT &amp; MORE Logo" class="brand-logo-img">
    <div class="brand-text">
      <h1 class="brand-title">PAINT &amp; MORE</h1>
      <span class="brand-subtitle">AI Color Visualizer</span>
    </div>
  </div>
  <span class="header-tag">Kelly-Moore Paints</span>
  <div class="header-right">
    <div class="server-url-wrap" style="display:none">
      <label for="serverUrl" class="server-url-label">ComfyUI URL</label>
      <input type="text" id="serverUrl" class="server-url-input"
             placeholder="https://comfy.kellymoore-usa.com"
             value="https://comfy.kellymoore-usa.com">
    </div>
    <div class="status-pill" id="statusPill">
      <div class="status-dot" id="statusDot"></div>
      <span id="statusText">Sẵn sàng </span>
    </div>
  </div>
</div>
