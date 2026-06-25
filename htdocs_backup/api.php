<?php
/**
 * api.php — PHP Proxy for ComfyUI
 * Chuyển tiếp tất cả /api/* requests tới ComfyUI trên localhost:8188
 */

define('COMFYUI_URL', 'http://localhost:8188');
define('LOG_FILE', __DIR__ . '/api_proxy.log');

function logMsg($msg) {
    file_put_contents(LOG_FILE, '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n", FILE_APPEND);
}

// Lấy path: /api/upload/image → /upload/image
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^/api(?=/|$)#', '', $path);
if (empty($path)) $path = '/';

$method = $_SERVER['REQUEST_METHOD'];
$url    = COMFYUI_URL . $path;

if (!empty($_SERVER['QUERY_STRING'])) {
    $url .= '?' . $_SERVER['QUERY_STRING'];
}

logMsg("Proxying: $method $url");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,            $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT,        300);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST,  $method);

// Forward headers (trừ những cái cURL tự quản lý) — dùng chung cho mọi method
$forwardHeaders = [];
if (function_exists('getallheaders')) {
    $skip = ['host', 'connection', 'content-length', 'accept-encoding', 'transfer-encoding'];
    foreach (getallheaders() as $name => $value) {
        if (!in_array(strtolower($name), $skip)) {
            $forwardHeaders[] = "$name: $value";
        }
    }
}

$contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
$isMultipart = stripos($contentType, 'multipart/form-data') !== false;

if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    if ($isMultipart) {
        // Rebuild multipart: PHP đã parse $_FILES/$_POST, dùng CURLFile để gửi lại
        // Không set Content-Type — cURL tự tạo boundary đúng
        $postFields = [];

        foreach ($_POST as $k => $v) {
            $postFields[$k] = $v;
        }

        foreach ($_FILES as $fieldName => $fileInfo) {
            if (is_array($fileInfo['name'])) {
                foreach ($fileInfo['name'] as $i => $fname) {
                    if ($fileInfo['error'][$i] === UPLOAD_ERR_OK) {
                        $postFields[$fieldName . '[' . $i . ']'] = new CURLFile(
                            $fileInfo['tmp_name'][$i],
                            $fileInfo['type'][$i],
                            $fname
                        );
                    }
                }
            } else {
                if ($fileInfo['error'] === UPLOAD_ERR_OK) {
                    $postFields[$fieldName] = new CURLFile(
                        $fileInfo['tmp_name'],
                        $fileInfo['type'],
                        $fileInfo['name']
                    );
                }
            }
        }

        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
        logMsg("Forwarding multipart: " . count($_FILES) . " file(s), " . count($_POST) . " field(s)");
    } else {
        // JSON hoặc raw body
        $body = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        if (!empty($forwardHeaders)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
        }
        logMsg("Forwarding raw body: " . strlen($body) . " bytes");
    }
} else {
    // GET / DELETE
    if (!empty($forwardHeaders)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
    }
}

$response     = curl_exec($ch);
$http_code    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError    = curl_error($ch);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($curlError) {
    logMsg("cURL error: $curlError");
} elseif ($http_code >= 400) {
    logMsg("Response code: $http_code | " . substr($response, 0, 300));
} else {
    logMsg("Response code: $http_code (OK)");
}

if ($content_type) {
    header("Content-Type: $content_type");
} else {
    header('Content-Type: application/json');
}

http_response_code($http_code ?: 502);

if ($curlError) {
    echo json_encode(['error' => 'Proxy error: ' . $curlError]);
} else {
    echo $response ?: '';
}
