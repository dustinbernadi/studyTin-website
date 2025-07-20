import { breakMode, longBreakMode, longWorkMode, resetTimer, startTimer , stopTimer, totalMinutesSend, workMode } from "./js/timer.js";
import { closePopup, sideBar } from "./js/utils.js";
import { setupAuthUI } from "./js/authUi.js";

//event untuk klik tombol operasional timer
document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("stop-btn").addEventListener("click", stopTimer);
document.getElementById("reset-btn").addEventListener("click",  resetTimer)

//event untuk klik tombol state
document.getElementById("longWork").addEventListener("click", longWorkMode);
document.getElementById("work").addEventListener("click", workMode);
document.getElementById("break").addEventListener("click", breakMode);
document.getElementById("longBreak").addEventListener("click", longBreakMode);

//event untuk mengumpulkan menit sesi
document.addEventListener("DOMContentLoaded", () => {
  totalMinutesSend(); // hanya dijalankan sekali
});

//event untuk popup dan close popup
document.getElementById("closePopup").addEventListener("click", closePopup)

//event untuk klik tombol menu hamburger di layar kecil
document.getElementById("hamburger").addEventListener("click", sideBar);

// Intersection Observer for scroll animations
// This will add classes to elements with the data-scroll attribute when they come into view
const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'blur-none', 'translate-y-0');
          el.classList.remove('opacity-0', 'blur-sm', 'translate-y-8', '-translate-y-8');
        } else {
          el.classList.remove('opacity-100', 'blur-none', 'translate-y-0');
          el.classList.add('opacity-0', 'blur-sm');

          const direction = entry.boundingClientRect.top < 0 ? '-translate-y-8' : 'translate-y-8';
          el.classList.remove('-translate-y-8', 'translate-y-8');
          el.classList.add(direction);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.classList.add('opacity-0', 'blur-sm', 'translate-y-8');
    el.classList.add('transition-all', 'duration-700', 'ease-in-out');
    observer.observe(el);
  });

// Setup authentication UI
document.addEventListener("DOMContentLoaded", () => {
  setupAuthUI();
});


// Ensure the auth UI is set up when the page loads