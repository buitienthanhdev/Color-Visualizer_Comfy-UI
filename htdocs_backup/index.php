<?php
/**
 * index.php — PAINT & MORE: AI Color Visualizer
 * ─────────────────────────────────────────────────────────────────
 * Entry point. Lắp ráp các PHP module từ thư mục includes/.
 *
 * Cấu trúc module:
 *   includes/head.php              <head>: meta, CSS links
 *   includes/header.php            Header bar: logo, brand, status
 *   includes/wizard_panel.php      Left panel: 5-step wizard
 *   includes/result_panel.php      Right panel: OSD viewer, result
 *   includes/modals_datalists.php  History modal + datalists
 *   includes/scripts.php           <script> tags theo thứ tự đúng
 *
 * Yêu cầu:
 *   - PHP 7.4+  (chỉ dùng include, không dùng framework)
 *   - Web server: Apache/Nginx/Laragon trỏ vào thư mục này
 *   - ComfyUI chạy tại localhost:8188, proxy qua /api (proxy_server.py)
 *
 * CSS:  styles.css (giao diện chính) | wizard.css (wizard-specific)
 * JS:   app.js | wizard.js | materials.js | all_colors.js | palette_data.js
 * ─────────────────────────────────────────────────────────────────
 */

$base = __DIR__ . '/includes/';
?>
<!DOCTYPE html>
<html lang="vi">

<?php include $base . 'head.php'; ?>

<body>

<?php include $base . 'header.php'; ?>

<div class="layout">
  <?php include $base . 'wizard_panel.php'; ?>
  <?php include $base . 'result_panel.php'; ?>
</div><!-- /.layout -->

<?php include $base . 'modals_datalists.php'; ?>
<?php include $base . 'scripts.php'; ?>

</body>
</html>
