<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// Wczytaj konfigurację (opcjonalnie – jeśli plik istnieje)
$configPath = __DIR__ . '/config.php';
$config = file_exists($configPath) ? require $configPath : [];

function json_response(string $status, string $message, array $extra = []): void {
    echo json_encode(array_merge([
        'status' => $status,
        'message' => $message
    ], $extra));
    exit;
}

function processUploadedFiles(): array {
    $uploadedFiles = [];
    $uploadDir = __DIR__ . '/uploads/';
    
    // Utwórz katalog uploads jeśli nie istnieje
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    if (!empty($_FILES)) {
        foreach ($_FILES as $inputName => $file) {
            if ($file['error'] === UPLOAD_ERR_OK) {
                // Sprawdź rozmiar pliku (8MB max)
                if ($file['size'] > 8 * 1024 * 1024) {
                    continue; // Pomiń zbyt duże pliki
                }
                
                // Sprawdź typ pliku
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!in_array($file['type'], $allowedTypes)) {
                    continue; // Pomiń nieprawidłowe typy plików
                }
                
                // Wygeneruj bezpieczną nazwę pliku
                $fileInfo = pathinfo($file['name']);
                $extension = strtolower($fileInfo['extension'] ?? 'jpg');
                $fileName = uniqid('photo_' . $inputName . '_', true) . '.' . $extension;
                $filePath = $uploadDir . $fileName;
                
                if (move_uploaded_file($file['tmp_name'], $filePath)) {
                    $uploadedFiles[$inputName] = [
                        'original_name' => $file['name'],
                        'saved_name' => $fileName,
                        'path' => $filePath,
                        'size' => $file['size']
                    ];
                }
            }
        }
    }
    
    return $uploadedFiles;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_response('error', 'Tylko POST');
}

// Przetwórz przesłane pliki
$uploadedFiles = processUploadedFiles();

// Minimalna walidacja
$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
if ($name === '' || $email === '') {
    json_response('error', 'Brak imienia lub emaila');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response('error', 'Nieprawidłowy email');
}

if (!function_exists('mail')) {
    json_response('error', 'Funkcja mail() niedostępna');
}

$phone = trim($_POST['phone'] ?? '');
$phone = $phone !== '' ? $phone : 'Nie podano';

// Mapowanie zabiegów jeśli dostępna konfiguracja
$rawProcedures = isset($_POST['procedures']) && is_array($_POST['procedures']) ? $_POST['procedures'] : [];
$mappedProcedures = [];
if (!empty($rawProcedures)) {
    foreach ($rawProcedures as $p) {
        $pClean = htmlspecialchars(trim((string)$p), ENT_QUOTES, 'UTF-8');
        if (!empty($config['procedures'][$pClean])) {
            $mappedProcedures[] = $config['procedures'][$pClean];
        } else {
            $mappedProcedures[] = $pClean; // fallback – surowa wartość
        }
    }
}

// Mapowanie lekarza
$doctorRaw = trim($_POST['doctor'] ?? '');
$doctorLabel = $doctorRaw !== '' && !empty($config['doctors'][$doctorRaw])
    ? $config['doctors'][$doctorRaw]
    : ($doctorRaw !== '' ? htmlspecialchars($doctorRaw, ENT_QUOTES, 'UTF-8') : 'Nie wybrano');

$safeName  = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');

$to = $config['email']['to'] ?? 'klinika@artisanclinic.pl';
$subjectPrefix = $config['email']['subject_prefix'] ?? 'Konsultacja online - ';
$subject = $subjectPrefix . $safeName;

$age = trim($_POST['age'] ?? '');
$expectations = trim($_POST['expectations'] ?? '');
$previous_procedures = trim($_POST['previous_procedures'] ?? '');
$previous_procedures_details = trim($_POST['previous_procedures_details'] ?? '');
$chronic_diseases = trim($_POST['chronic_diseases'] ?? '');
$medications = trim($_POST['medications'] ?? '');
$medications_details = trim($_POST['medications_details'] ?? '');
$additional_comments = trim($_POST['additional_comments'] ?? '');
$other_procedure = trim($_POST['other_procedure'] ?? '');

$messageLines = [];
$messageLines[] = 'Nowe zgłoszenie konsultacji online';
$messageLines[] = '';
$messageLines[] = 'DANE OSOBOWE:';
$messageLines[] = 'Imię: ' . $safeName;
$messageLines[] = 'Email: ' . $safeEmail;
$messageLines[] = 'Telefon: ' . $safePhone;
$messageLines[] = 'Wiek: ' . ($age !== '' ? htmlspecialchars($age, ENT_QUOTES, 'UTF-8') : 'Nie podano');
$messageLines[] = 'Data: ' . date('Y-m-d H:i:s');
$messageLines[] = 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '');

if ($mappedProcedures) {
    $messageLines[] = '';
    $messageLines[] = 'WYBRANE ZABIEGI:';
    foreach ($mappedProcedures as $mp) {
        $messageLines[] = '- ' . $mp;
    }
}

if ($other_procedure !== '') {
    $messageLines[] = '';
    $messageLines[] = 'OPIS INNEGO ZABIEGU:';
    $messageLines[] = htmlspecialchars($other_procedure, ENT_QUOTES, 'UTF-8');
}

if ($doctorLabel) {
    $messageLines[] = '';
    $messageLines[] = 'WYBRANY LEKARZ: ' . $doctorLabel;
}

if ($expectations !== '') {
    $messageLines[] = '';
    $messageLines[] = 'OCZEKIWANIA PO ZABIEGU:';
    $messageLines[] = htmlspecialchars($expectations, ENT_QUOTES, 'UTF-8');
}

$messageLines[] = '';
$messageLines[] = 'HISTORIA MEDYCZNA:';
$messageLines[] = 'Poprzednie zabiegi: ' . ($previous_procedures !== '' ? htmlspecialchars($previous_procedures, ENT_QUOTES, 'UTF-8') : 'Nie podano');
if ($previous_procedures_details !== '') {
    $messageLines[] = 'Szczegóły poprzednich zabiegów: ' . htmlspecialchars($previous_procedures_details, ENT_QUOTES, 'UTF-8');
}
$messageLines[] = 'Choroby przewlekłe: ' . ($chronic_diseases !== '' ? htmlspecialchars($chronic_diseases, ENT_QUOTES, 'UTF-8') : 'Nie podano');
$messageLines[] = 'Przyjmowane leki: ' . ($medications !== '' ? htmlspecialchars($medications, ENT_QUOTES, 'UTF-8') : 'Nie podano');
if ($medications_details !== '') {
    $messageLines[] = 'Szczegóły leków: ' . htmlspecialchars($medications_details, ENT_QUOTES, 'UTF-8');
}

if ($additional_comments !== '') {
    $messageLines[] = '';
    $messageLines[] = 'DODATKOWE UWAGI:';
    $messageLines[] = htmlspecialchars($additional_comments, ENT_QUOTES, 'UTF-8');
}

if (!empty($uploadedFiles)) {
    $messageLines[] = '';
    $messageLines[] = 'PRZESŁANE ZDJĘCIA:';
    foreach ($uploadedFiles as $inputName => $fileInfo) {
        $messageLines[] = '- ' . $fileInfo['original_name'] . ' (' . round($fileInfo['size'] / 1024, 2) . ' KB)';
        $messageLines[] = '  Zapisano jako: ' . $fileInfo['saved_name'];
    }
    $messageLines[] = '';
    $messageLines[] = 'Zdjęcia znajdują się w katalogu: ' . realpath(__DIR__ . '/uploads/');
}

$message = implode("\n", $messageLines) . "\n";

$fromEmail = $config['email']['from'] ?? 'noreply@artisanclinic.pl';
$fromName  = $config['email']['from_name'] ?? 'Artisan Clinic - Formularz Konsultacji';

// Jeśli są załączniki, wysyłamy email z załącznikami i wersją HTML
if (!empty($uploadedFiles)) {
    $success = sendEmailWithAttachments($to, $subject, $message, $fromEmail, $fromName, $safeEmail, $uploadedFiles, $messageLines);
} else {
    // Standardowy email bez załączników
    $headers = [];
    $headers[] = 'From: ' . sprintf('%s <%s>', $fromName, $fromEmail);
    $headers[] = 'Reply-To: ' . $safeEmail;
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'X-Mailer: PHP/' . PHP_VERSION;
    $headersStr = implode("\r\n", $headers);
    
    $success = @mail($to, $subject, $message, $headersStr);
}

// Funkcje do obsługi emaili z załącznikami
function sendEmailWithAttachments($to, $subject, $message, $fromEmail, $fromName, $replyTo, $attachments, $messageLines) {
    $boundary = uniqid('boundary_', true);
    $boundaryAlt = uniqid('boundary_alt_', true);
    
    // Nagłówki
    $headers = [];
    $headers[] = 'From: ' . sprintf('%s <%s>', $fromName, $fromEmail);
    $headers[] = 'Reply-To: ' . $replyTo;
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
    $headers[] = 'X-Mailer: PHP/' . PHP_VERSION;
    $headersStr = implode("\r\n", $headers);
    
    // Treść emaila
    $body = '';
    
    // Główna część wiadomości (multipart/alternative dla HTML i tekst)
    $body .= '--' . $boundary . "\r\n";
    $body .= 'Content-Type: multipart/alternative; boundary="' . $boundaryAlt . '"' . "\r\n\r\n";
    
    // Wersja tekstowa
    $body .= '--' . $boundaryAlt . "\r\n";
    $body .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
    $body .= 'Content-Transfer-Encoding: 8bit' . "\r\n\r\n";
    $body .= $message . "\r\n\r\n";
    
    // Wersja HTML z osadzonymi obrazami
    $body .= '--' . $boundaryAlt . "\r\n";
    $body .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
    $body .= 'Content-Transfer-Encoding: 8bit' . "\r\n\r\n";
    $body .= createHtmlMessage($messageLines, $attachments) . "\r\n\r\n";
    
    // Zamknij alternative boundary
    $body .= '--' . $boundaryAlt . '--' . "\r\n\r\n";
    
    // Załączniki
    foreach ($attachments as $inputName => $fileInfo) {
        if (file_exists($fileInfo['path'])) {
            $fileContent = file_get_contents($fileInfo['path']);
            $encodedContent = chunk_split(base64_encode($fileContent));
            
            // Określ MIME type na podstawie rozszerzenia
            $mimeType = getMimeType($fileInfo['original_name']);
            
            $body .= '--' . $boundary . "\r\n";
            $body .= 'Content-Type: ' . $mimeType . '; name="' . $fileInfo['original_name'] . '"' . "\r\n";
            $body .= 'Content-Transfer-Encoding: base64' . "\r\n";
            $body .= 'Content-Disposition: attachment; filename="' . $fileInfo['original_name'] . '"' . "\r\n";
            $body .= 'Content-ID: <' . $inputName . '>' . "\r\n\r\n";
            $body .= $encodedContent . "\r\n";
        }
    }
    
    // Zamknij główny boundary
    $body .= '--' . $boundary . '--' . "\r\n";
    
    return @mail($to, $subject, $body, $headersStr);
}

function createHtmlMessage($messageLines, $attachments) {
    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #8B5A3C; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #8B5A3C; border-bottom: 2px solid #8B5A3C; padding-bottom: 5px; }
        .photos { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px; }
        .photo { text-align: center; }
        .photo img { max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 5px; }
        .photo p { margin: 5px 0; font-size: 12px; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        td { padding: 8px; vertical-align: top; }
        .label { font-weight: bold; color: #8B5A3C; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Artisan Clinic - Konsultacja Online</h1>
    </div>
    <div class="content">';
    
    $currentSection = '';
    foreach ($messageLines as $line) {
        if (strpos($line, ':') !== false && strpos($line, 'DANE OSOBOWE:') !== false) {
            $html .= '<div class="section"><h3>Dane Osobowe</h3><table>';
            $currentSection = 'personal';
        } elseif (strpos($line, 'WYBRANE ZABIEGI:') !== false) {
            if ($currentSection == 'personal') $html .= '</table></div>';
            $html .= '<div class="section"><h3>Wybrane Zabiegi</h3><ul>';
            $currentSection = 'procedures';
        } elseif (strpos($line, 'WYBRANY LEKARZ:') !== false) {
            if ($currentSection == 'procedures') $html .= '</ul></div>';
            $html .= '<div class="section"><h3>Wybrany Lekarz</h3>';
            $currentSection = 'doctor';
        } elseif (strpos($line, 'HISTORIA MEDYCZNA:') !== false) {
            $html .= '</div><div class="section"><h3>Historia Medyczna</h3><table>';
            $currentSection = 'medical';
        } elseif (strpos($line, 'OCZEKIWANIA PO ZABIEGU:') !== false) {
            $html .= '<div class="section"><h3>Oczekiwania po zabiegu</h3>';
            $currentSection = 'expectations';
        } elseif (strpos($line, 'OPIS INNEGO ZABIEGU:') !== false) {
            $html .= '<div class="section"><h3>Opis innego zabiegu</h3>';
            $currentSection = 'other_procedure';
        } elseif (strpos($line, 'DODATKOWE UWAGI:') !== false) {
            if ($currentSection == 'medical') $html .= '</table></div>';
            $html .= '<div class="section"><h3>Dodatkowe uwagi</h3>';
            $currentSection = 'comments';
        } elseif (strpos($line, 'PRZESŁANE ZDJĘCIA:') !== false) {
            $html .= '</div><div class="section"><h3>Przesłane Zdjęcia</h3>';
            $currentSection = 'photos';
        } elseif (!empty(trim($line))) {
            if ($currentSection == 'personal' && strpos($line, ':') !== false) {
                $parts = explode(':', $line, 2);
                $html .= '<tr><td class="label">' . trim($parts[0]) . ':</td><td>' . trim($parts[1]) . '</td></tr>';
            } elseif ($currentSection == 'procedures' && strpos($line, '- ') === 0) {
                $html .= '<li>' . substr($line, 2) . '</li>';
            } elseif ($currentSection == 'doctor') {
                $html .= '<p>' . htmlspecialchars($line) . '</p>';
            } elseif ($currentSection == 'medical' && strpos($line, ':') !== false) {
                $parts = explode(':', $line, 2);
                $html .= '<tr><td class="label">' . trim($parts[0]) . ':</td><td>' . trim($parts[1]) . '</td></tr>';
            } elseif ($currentSection == 'expectations' || $currentSection == 'other_procedure' || $currentSection == 'comments') {
                $html .= '<p>' . nl2br(htmlspecialchars($line)) . '</p>';
            }
        }
    }
    
    // Zamknij ostatnią sekcję
    if ($currentSection == 'personal' || $currentSection == 'medical') {
        $html .= '</table></div>';
    } elseif ($currentSection == 'procedures') {
        $html .= '</ul></div>';
    } else {
        $html .= '</div>';
    }
    
    // Dodaj zdjęcia jako osadzone obrazy
    if (!empty($attachments)) {
        $html .= '<div class="section"><h3>Załączone Zdjęcia</h3><div class="photos">';
        foreach ($attachments as $inputName => $fileInfo) {
            $html .= '<div class="photo">';
            $html .= '<img src="cid:' . $inputName . '" alt="' . htmlspecialchars($fileInfo['original_name']) . '">';
            $html .= '<p>' . htmlspecialchars($fileInfo['original_name']) . '</p>';
            $html .= '<p>(' . round($fileInfo['size'] / 1024, 2) . ' KB)</p>';
            $html .= '</div>';
        }
        $html .= '</div></div>';
    }
    
    $html .= '
    </div>
</body>
</html>';
    
    return $html;
}

function getMimeType($filename) {
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimeTypes = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'bmp' => 'image/bmp',
        'tiff' => 'image/tiff',
        'tif' => 'image/tiff'
    ];
    
    return $mimeTypes[$extension] ?? 'application/octet-stream';
}

if ($success) {
    json_response('success', $config['messages']['success'] ?? 'Formularz został wysłany pomyślnie!');
}

json_response('error', 'Błąd wysyłania emaila');
