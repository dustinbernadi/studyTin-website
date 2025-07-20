export let totalMinutesFromDB = 0;

export async function setupAuthUI() {
  console.log("setupAuthUI loaded");
  console.log("token", localStorage.getItem("token"));
  console.log("user", localStorage.getItem("user"));

  const loginButton = document.getElementById("loginBtn");
  const profileToggle = document.getElementById("profileToggle");
  const profilePopup = document.getElementById("profilePopup");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtnSidebar = document.getElementById("loginBtnSidebar");
  const mobileProfileToggle = document.getElementById("profileToggleMobile");


  const token = localStorage.getItem("token");
  const user = await fetchUserProfile(token);
  localStorage.setItem("user", JSON.stringify(user)); // optional

  

  if (!token && !user) return;

  try {

    // 2. Sembunyikan tombol login, tampilkan nama
    if (loginButton) loginButton.style.display = "none";
    if (loginBtnSidebar) loginBtnSidebar.style.display = "none";
    if (profileToggle) {
      profileToggle.textContent = user.name;
      profileToggle.style.display = "block";
    }

    if (mobileProfileToggle) {
      mobileProfileToggle.textContent = user.name;
      mobileProfileToggle.style.display = "block";
    }

    totalMinutesFromDB = user.totalMinutes || 0;

    // Tampilkan UI
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileTotalMinutes").textContent =
      totalMinutesFromDB;

    // Tampilkan nama user di tombol
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("profileToggle").textContent = user.name;
    document.getElementById("profileToggle").style.display = "block";

    profileToggle.addEventListener("click", () => {
      profilePopup.classList.toggle("hidden");
    });

    mobileProfileToggle.addEventListener("click", () => {
      profilePopup.classList.toggle("hidden");
    });

    // Tambah event logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload();
    });
  } catch (error) {
    console.error("Gagal memuat profil:", error);
  }
}

async function fetchUserProfile(token) {
  if (!token) return null; // ⬅️ Cek token dulu, kalau kosong langsung keluar

  try {
    const res = await fetch("http://localhost:3000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // Kalau statusnya 403, kemungkinan token invalid/expired
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Gagal fetch user profile:", error);
    return null;
  }
}

