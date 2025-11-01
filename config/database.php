<?php
 $host = 'localhost';
 $db_name = 'wedding_db';
 $username = 'root'; // Ganti dengan username DB Anda
 $password = ''; // Ganti dengan password DB Anda

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db_name}", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database $db_name :" . $e->getMessage());
}
// echo json_encode(["success" => true, "message" => "Koneksi DB berhasil."]);