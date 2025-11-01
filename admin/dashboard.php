<?php
session_start();
require_once '../config/database.php';

// Ambil Data RSVP
$rsvpStmt = $pdo->query("SELECT * FROM rsvps ORDER BY created_at DESC");
$rsvps = $rsvpStmt->fetchAll(PDO::FETCH_ASSOC);

// Ambil Data Ucapan
$wishStmt = $pdo->query("SELECT * FROM wishes ORDER BY created_at DESC");
$wishes = $wishStmt->fetchAll(PDO::FETCH_ASSOC);

include 'partials/header.php';
// include 'partials/sidebar.php';
?>
<div class="main-content">
    <?php
    // Tampilkan pesan sukses atau error jika ada
    if (isset($_SESSION['success_message'])) {
        echo '<div class="card" style="background-color: #d4edda; border-left: 5px solid #28a745; color: #155724;">' . htmlspecialchars($_SESSION['success_message']) . '</div>';
        unset($_SESSION['success_message']); // Hapus pesan setelah ditampilkan
    }
    if (isset($_SESSION['error_message'])) {
        echo '<div class="card" style="background-color: #f8d7da; border-left: 5px solid #dc3545; color: #721c24;">' . htmlspecialchars($_SESSION['error_message']) . '</div>';
        unset($_SESSION['error_message']); // Hapus pesan setelah ditampilkan
    }
    ?>
    
    <!-- ... kode card untuk data RSVP dan ucapan ada di bawah sini ... -->

<div class="main-content">
    <div class="card">
    <h2>Data RSVP</h2>
    
    <!-- Search Bar -->
    <div class="search-container">
        <input type="search" id="searchRsvp" class="search-input" placeholder="Cari berdasarkan nama...">
    </div>
    
    <table id="rsvpTable">
        <thead>
            <tr>
                <th>Nama</th>
                <th>Kehadiran</th>
                <th>Jumlah Tamu</th>
                <th>Pesan</th>
                <th>Tanggal</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($rsvps as $rsvp): ?>
            <tr>
                <td><?= htmlspecialchars($rsvp['name']) ?></td>
                <td><?= $rsvp['attendance'] == 'yes' ? 'Hadir' : 'Tidak Hadir' ?></td>
                <td><?= $rsvp['guests'] ?></td>
                <td class="wrap-text"><?= htmlspecialchars($rsvp['message']) ?></td>
                <td><?= date('d M Y H:i', strtotime($rsvp['created_at'])) ?></td>
                <td>
                    <a href="handlers/rsvp_handler.php?action=delete&id=<?= $rsvp['id'] ?>" class="btn btn-danger" onclick="return confirm('Yakin ingin menghapus?')">Hapus</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

    <div class="card">
    <h2>Data Ucapan & Doa</h2>
    
    <!-- Search Bar -->
    <div class="search-container">
        <input type="search" id="searchWishes" class="search-input" placeholder="Cari berdasarkan nama...">
    </div>
    
    <table id="wishesTable">
        <thead>
            <tr>
                <th>Nama</th>
                <th>Ucapan</th>
                <th>Tanggal</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($wishes as $wish): ?>
            <tr>
                <td><?= htmlspecialchars($wish['name']) ?></td>
                <td class="wrap-text"><?= htmlspecialchars($wish['message']) ?></td>
                <td><?= date('d M Y H:i', strtotime($wish['created_at'])) ?></td>
                <td>
                    <a href="handlers/wish_handler.php?action=delete&id=<?= $wish['id'] ?>" class="btn btn-danger" onclick="return confirm('Yakin ingin menghapus?')">Hapus</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
</div>
<!-- JavaScript untuk Pencarian Real-time -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Fungsi untuk mengimplementasikan pencarian pada tabel
     * @param {string} searchInputId - ID dari input pencarian
     * @param {string} tableId - ID dari tabel yang akan difilter
     * @param {number} columnIndex - Indeks kolom yang akan menjadi dasar pencarian (dimulai dari 0)
     */
    function setupTableSearch(searchInputId, tableId, columnIndex) {
        const searchInput = document.getElementById(searchInputId);
        const table = document.getElementById(tableId);

        if (!searchInput || !table) {
            console.error(`Elemen dengan ID '${searchInputId}' atau '${tableId}' tidak ditemukan.`);
            return;
        }

        const tableRows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        searchInput.addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();

            for (let i = 0; i < tableRows.length; i++) {
                const row = tableRows[i];
                const cellText = row.getElementsByTagName('td')[columnIndex].textContent.toLowerCase();

                if (cellText.includes(searchText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    // --- Inisialisasi Pencarian untuk Setiap Tabel ---
    
    // Setup pencarian untuk tabel RSVP (berdasarkan kolom "Nama", indeks 0)
    setupTableSearch('searchRsvp', 'rsvpTable', 0);

    // Setup pencarian untuk tabel Ucapan (berdasarkan kolom "Nama", indeks 0)
    setupTableSearch('searchWishes', 'wishesTable', 0);
});
</script>

<?php include 'partials/footer.php'; ?>
