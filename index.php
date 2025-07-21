<?php
require 'vendor/autoload.php';
require 'config.php';

use setasign\Fpdi\Fpdi;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $signature = $_POST['signature'];

    $data = explode(',', $signature);
    $decoded = base64_decode($data[1]);

    $filename = 'consent_' . time() . '.png';
    file_put_contents($filename, $decoded);

    // Crear PDF con la firma
    $pdf = new Fpdi();
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 16);
    $pdf->Cell(40, 10, "Consentimiento firmado por: " . $name);
    $pdf->Image($filename, 10, 30, 100);
    $pdf_file = 'consent_' . time() . '.pdf';
    $pdf->Output('F', $pdf_file);

    // Subir a Google Drive
    putenv('GOOGLE_APPLICATION_CREDENTIALS=credentials.json');
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->addScope(Google_Service_Drive::DRIVE_FILE);

    $service = new Google_Service_Drive($client);
    $fileMetadata = new Google_Service_Drive_DriveFile(array(
        'name' => $pdf_file
    ));
    $content = file_get_contents($pdf_file);
    $file = $service->files->create($fileMetadata, array(
        'data' => $content,
        'mimeType' => 'application/pdf',
        'uploadType' => 'multipart',
        'fields' => 'id'
    ));

    echo "Archivo subido exitosamente. ID: " . $file->id;
    unlink($filename);
    unlink($pdf_file);
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Consentimiento Legal</title>
</head>
<body>
    <h2>Consentimiento Legal</h2>
    <form method="POST">
        <label for="name">Nombre completo:</label>
        <input type="text" name="name" required><br><br>
        <canvas id="signature-pad" width="400" height="200" style="border:1px solid #000;"></canvas><br>
        <input type="hidden" name="signature" id="signature">
        <button type="button" onclick="saveSignature()">Firmar</button>
        <input type="submit" value="Enviar">
    </form>

    <script src="https://cdn.jsdelivr.net/npm/signature_pad@2.3.2/dist/signature_pad.min.js"></script>
    <script>
        var canvas = document.getElementById('signature-pad');
        var signaturePad = new SignaturePad(canvas);

        function saveSignature() {
            if (signaturePad.isEmpty()) {
                alert("Por favor firme primero.");
            } else {
                document.getElementById('signature').value = signaturePad.toDataURL();
            }
        }
    </script>
</body>
</html>
