// --- SISTEM NOTIFIKASI KUSTOM ---

/**
 * Fungsi untuk menampilkan notifikasi
 * @param {string} message - Pesan yang akan ditampilkan
 * @param {'success'|'error'} type - Tipe notifikasi (sukses atau error)
 * @param {number} [duration=5000] - Durasi notifikasi muncul dalam milidetik
 */
function showNotification(message, type = "success", duration = 3000) {
  const container = document.getElementById("notificationContainer");
  if (!container) {
    console.error("Notification container not found!");
    return;
  }

  // 1. Buat elemen notifikasi
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  // 2. Isi konten notifikasi
  notification.innerHTML = `
        <div class="notification-header">
            <span>${
              type === "success" ? "Berhasil!" : "Terjadi Kesalahan"
            }</span>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-body">${message}</div>
    `;

  // 3. Tambahkan ke container
  container.appendChild(notification);

  // 4. Tambahkan event listener untuk tombol tutup
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    hideNotification(notification);
  });

  // 5. Tampilkan notifikasi dengan animasi (trigger reflow)
  requestAnimationFrame(() => {
    notification.classList.add("show");
  });

  // 6. Sembunyikan notifikasi otomatis setelah durasi tertentu
  setTimeout(() => {
    hideNotification(notification);
  }, duration);
}

/**
 * Fungsi untuk menyembunyikan dan menghapus notifikasi
 * @param {HTMLElement} notification - Elemen notifikasi yang akan dihapus
 */
function hideNotification(notification) {
  notification.classList.remove("show");
  // Tunggu animasi selesai sebelum menghapus elemen dari DOM
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300); // Durasi harus sama dengan CSS transition
}
// Loading Screen
window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loadingScreen").classList.add("hidden");
  }, 2000);
});

// Smooth Scrolling for remaining anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date("January 7, 2026 08:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerText =
    minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerText =
    seconds < 10 ? "0" + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Music Player
const musicPlayer = document.getElementById("musicPlayer");
const bgMusic = document.getElementById("bgMusic");
let isPlaying = false;

musicPlayer.addEventListener("click", function () {
  if (isPlaying) {
    bgMusic.pause();
    musicPlayer.classList.remove("playing");
  } else {
    bgMusic.play().catch((e) => {
      console.log("Audio play failed:", e);
    });
    musicPlayer.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

const rsvpForm = document.getElementById("rsvpForm");
rsvpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(rsvpForm);

  fetch("api/submit_rsvp.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        showNotification(data.message, "success"); // GANTI ALERT
        rsvpForm.reset();
      } else {
        showNotification(data.message, "error"); // GANTI ALERT
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification(
        "Gagal mengirim RSVP. Periksa koneksi internet Anda.",
        "error"
      ); // GANTI ALERT
    });
});

// --- SISTEM UCAPAN & DOA (DENGAN PAGINASI) ---

// Fungsi untuk merender navigasi paginasi
function renderPagination(currentPage, totalPages) {
  const paginationNav = document.getElementById("paginationNav");
  paginationNav.innerHTML = ""; // Kosongkan navigasi lama

  if (totalPages <= 1) {
    return; // Tidak perlu menampilkan navigasi jika hanya 1 halaman
  }

  // Fungsi pembuat link
  const createLink = (page, text, isDisabled = false) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#wishes"; // Link ke section wishes
    a.className = "pagination-link";
    a.textContent = text;
    a.setAttribute("data-page", page);

    if (isDisabled) {
      a.classList.add("disabled");
    } else if (page === currentPage) {
      a.classList.add("active");
    }

    li.appendChild(a);
    return li;
  };

  // Link ke halaman sebelumnya (<<)
  paginationNav.appendChild(
    createLink(currentPage - 1, "<<", currentPage === 1)
  );

  // Link nomor halaman
  for (let i = 1; i <= totalPages; i++) {
    paginationNav.appendChild(createLink(i, i));
  }

  // Link ke halaman berikutnya (>>)
  paginationNav.appendChild(
    createLink(currentPage + 1, ">>", currentPage === totalPages)
  );

  // Event listener untuk semua link paginasi (menggunakan event delegation)
  paginationNav.addEventListener("click", function (e) {
    e.preventDefault();
    const target = e.target.closest(".pagination-link");
    if (
      target &&
      !target.classList.contains("disabled") &&
      !target.classList.contains("active")
    ) {
      const pageToLoad = parseInt(target.getAttribute("data-page"));
      loadWishes(pageToLoad);
    }
  });
}

// Fungsi untuk memuat ucapan (sekarang menerima parameter `page`)
function loadWishes(page = 1) {
  fetch(`api/get_wishes.php?page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const wishesContainer = document.getElementById("wishesContainer");
        const paginationNav = document.getElementById("paginationNav");
        const addWishBtn = document.getElementById("addWishBtn");

        // Hapus ucapan lama dan navigasi lama, kecuali tombol
        const wishesToRemove = wishesContainer.querySelectorAll(
          ".wish-card, .no-wish-message"
        );
        wishesToRemove.forEach((el) => el.remove());

        // Tambahkan ucapan yang ada
        if (data.data && data.data.length > 0) {
          data.data.forEach((wish) => {
            const initial = wish.name.charAt(0).toUpperCase();
            const newWish = document.createElement("div");
            newWish.className = "wish-card";
            newWish.innerHTML = `
                        <div class="wish-header">
                            <div class="wish-avatar">${initial}</div>
                            <div>
                                <div class="wish-name">${wish.name}</div>
                                <div class="wish-date">${wish.created_at_formatted}</div>
                            </div>
                        </div>
                        <p class="wish-content">${wish.message}</p>
                    `;
            // Sisipkan sebelum navigasi
            wishesContainer.insertBefore(newWish, paginationNav);
          });
        } else {
          // Tampilkan pesan jika belum ada ucapan
          const noWishMessage = document.createElement("p");
          noWishMessage.className = "no-wish-message";
          noWishMessage.style.textAlign = "center";
          noWishMessage.style.opacity = "0.7";
          noWishMessage.textContent = "Belum ada ucapan. Jadilah yang pertama!";
          wishesContainer.insertBefore(noWishMessage, paginationNav);
        }

        // Render navigasi paginasi
        renderPagination(
          data.pagination.current_page,
          data.pagination.total_pages
        );
      } else {
        console.error("Error loading wishes:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error loading wishes:", error);
    });
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  // --- LOGIKA MODAL UCAPAN (TIDAK PERLU DIUBAH) ---
  const addWishBtn = document.getElementById("addWishBtn");
  const wishModal = document.getElementById("wishModal");
  const closeModal = document.getElementById("closeModal");
  const wishForm = document.getElementById("wishForm");

  if (addWishBtn && wishModal && closeModal && wishForm) {
    addWishBtn.addEventListener("click", () =>
      wishModal.classList.add("active")
    );
    closeModal.addEventListener("click", () =>
      wishModal.classList.remove("active")
    );
    wishModal.addEventListener("click", (e) => {
      if (e.target === wishModal) wishModal.classList.remove("active");
    });

    wishForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(wishForm);
      const submitButton = wishForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = "Mengirim...";
      submitButton.disabled = true;

      fetch("api/submit_wish.php", { method: "POST", body: formData })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            showNotification(data.message, "success");
            wishForm.reset();
            wishModal.classList.remove("active");
            loadWishes(1); // Muat ulang dari halaman pertama setelah submit
          } else {
            showNotification(data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showNotification(
            "Gagal mengirim ucapan. Periksa koneksi internet Anda.",
            "error"
          );
        })
        .finally(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        });
    });
  } else {
    console.error("Elemen modal/ucapan tidak ditemukan.");
  }

  // Panggil fungsi untuk memuat ucapan halaman pertama saat pertama kali
  loadWishes(1);
});
// Copy Account Number
const copyButtons = document.querySelectorAll(".btn-copy");

copyButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const accountNumber = this.getAttribute("data-account-number");

    // Use the Clipboard API
    navigator.clipboard
      .writeText(accountNumber)
      .then(() => {
        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin</span>';
        this.classList.add("copied");

        // Show notification
        const notification = this.closest(".bank-card").querySelector(
          ".copied-notification"
        );
        notification.classList.add("show");

        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.classList.remove("copied");
          notification.classList.remove("show");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = accountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        // Change button text temporarily
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin</span>';
        this.classList.add("copied");

        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.classList.remove("copied");
        }, 2000);
      });
  });
});

// Scroll Animations (Fade In and Fade Out)
// Scroll Animations (Fade In and Fade Out)
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px", // Mulai fade out saat elemen 100px di bawah layar
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    // Jika elemen masuk ke layar, tambahkan class 'active'
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
    // Jika elemen keluar dari layar, hapus class 'active'
    else {
      entry.target.classList.remove("active");
    }
  });
}, observerOptions);

// Amati semua section yang memiliki class 'fade-in'
document.querySelectorAll(".fade-in").forEach((section) => {
  observer.observe(section);
});
