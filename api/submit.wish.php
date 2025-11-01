<?php
// --- Menyimpan Ucapan Baru ---

// Mulai output buffering untuk mencegah output yang tidak diinginkan
ob_start();

// Sertakan file konfigurasi database
require_once '../config/database.php';

// Siapkan respons default
 $response = ['status' => 'error', 'message' => 'Terjadi kesalahan.'];

// Proses hanya jika request method adalah POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil dan sanitasi input
    $name = trim($_POST['wishName'] ?? '');
    $message = trim($_POST['wishMessage'] ?? '');

    // Validasi sederhana
    if (empty($name) || empty($message)) {
        $response['message'] = 'Nama dan ucapan tidak boleh kosong.';
    } else {
        try {
            $query = "INSERT INTO wishes (name, message) VALUES (?, ?)";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$name, $message]);

            $response = ['status' => 'success', 'message' => 'Terima kasih! Ucapan Anda telah tersimpan.'];
        } catch (PDOException $e) {
            // Log error ke file log server
            error_log("Wish Submission Error: " . $e->getMessage());
            $response['message'] = 'Gagal menyimpan ucapan. Silakan coba lagi.';
        }
    }
}

// Bersihkan output buffer yang mungkin sudah terkirim (warning, notice, spasi, dll)
ob_clean();

// Set header JSON
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

// Output response JSON yang bersih
echo json_encode($response);

// Akhiri script dan kirim output buffer
ob_end_flush();
exit;
?>