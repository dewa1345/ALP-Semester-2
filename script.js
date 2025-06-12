// Slide Panel
document.getElementById('signUp').addEventListener('click', () => {
  document.getElementById('container').classList.add("right-panel-active");
});
document.getElementById('signIn').addEventListener('click', () => {
  document.getElementById('container').classList.remove("right-panel-active");
});

// Toggle password visibility
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// Background slideshow
const images = ["evo1.jpg", "evo2.jpg", "evo3.jpg", "evo4.jpg"];
let leftIndex = 0;
let rightIndex = 2;

const bgLeft = document.getElementById('bg-left');
const bgRight = document.getElementById('bg-right');

function updateBackgrounds() {
  // Ganti background left
  bgLeft.classList.remove('active');
  setTimeout(() => {
    bgLeft.style.backgroundImage = `url(${images[leftIndex]})`;
    bgLeft.classList.add('active');
  }, 100);

  // Ganti background right
  bgRight.classList.remove('active');
  setTimeout(() => {
    bgRight.style.backgroundImage = `url(${images[rightIndex]})`;
    bgRight.classList.add('active');
  }, 100);

  // Update index
  leftIndex = (leftIndex + 1) % images.length;
  rightIndex = (rightIndex + 1) % images.length;
}

// Mulai slideshow
updateBackgrounds();
setInterval(updateBackgrounds, 5000);

document.getElementById("login-btn").addEventListener("click", function () {
    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!name || !password) {
      alert("Semua input wajib diisi!");
      return;
    }
    localStorage.setItem("username", name);
    window.location.href = "profile.html";

  });