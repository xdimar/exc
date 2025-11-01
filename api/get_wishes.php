<?php
// --- Mengambil Data Ucapan dengan Paginasi ---

// Set header untuk respons JSON
header('Content-Type: application/json');

// Sertakan file konfigurasi database
require_once '../config/database.php';

// --- Konfigurasi Paginasi ---
 $limit = 3; // Jumlah ucapan per halaman
 $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
 $offset = ($page - 1) * $limit;

try {
    // 1. Query untuk mengambil data ucapan sesuai halaman
    $query = "SELECT id, name, message, created_at FROM wishes ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $wishes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Query untuk menghitung total semua ucapan
    $countQuery = "SELECT COUNT(*) as total FROM wishes";
    $countStmt = $pdo->query($countQuery);
    $totalResult = $countStmt->fetch(PDO::FETCH_ASSOC);
    $totalWishes = $totalResult['total'];

    // 3. Hitung total halaman
    $totalPages = ceil($totalWishes / $limit);

    // 4. Format tanggal untuk setiap ucapan
    foreach ($wishes as &$wish) {
        $wish['created_at_formatted'] = date('d M Y', strtotime($wish['created_at']));
    }

    // 5. Kirim respons JSON
    echo json_encode([
        'status' => 'success', 
        'data' => $wishes,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_wishes' => $totalWishes
        ]
    ]);

} catch (PDOException $e) {
    // Jika terjadi error, kirim respons error
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Gagal mengambil data ucapan.']);
}
?>