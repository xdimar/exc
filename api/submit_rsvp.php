<?php
// --- Menyimpan Data RSVP ---

// Mulai output buffering untuk mencegah output yang tidak diinginkan
ob_start();

// Sertakan file konfigurasi database
require_once '../config/database.php';

// Siapkan respons default
 $response = ['status' => 'error', 'message' => 'Terjadi kesalahan yang tidak diketahui.'];

// Proses hanya jika request method adalah POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil dan sanitasi input
    $name = trim($_POST['name'] ?? '');
    $attendance = $_POST['attendance'] ?? '';
    $guests = $_POST['guests'] ?? 1;
    $message = trim($_POST['message'] ?? '');

    // Validasi sederhana
    if (empty($name) || empty($attendance)) {
        $response['message'] = 'Nama dan konfirmasi kehadiran wajib diisi.';
    } else {
        try {
            $query = "INSERT INTO rsvps (name, attendance, guests, message) VALUES (?, ?, ?, ?)";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$name, $attendance, $guests, $message]);

            $response = ['status' => 'success', 'message' => 'RSVP Anda berhasil kami terima. Terima kasih!'];
        } catch (PDOException $e) {
            // Log error ke file log server
            error_log("RSVP Submission Error: " . $e->getMessage());
            $response['message'] = 'Gagal mengirim RSVP. Terjadi kesalahan pada server.';
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