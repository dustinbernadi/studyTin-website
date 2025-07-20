
export function sideBar() {
  const sidebar = document.getElementById("sideBar");
  const bar1 = document.getElementById("bar1");
  const bar2 = document.getElementById("bar2");
  const bar3 = document.getElementById("bar3");

  // Toggle sidebar slide
  if (sidebar.style.right === "0px") {
    sidebar.style.right = "-100%";
  } else {
    sidebar.style.right = "0px";
  }

  // Animate hamburger icon
  bar1.classList.toggle("rotate-45");
  bar1.classList.toggle("translate-y-2.5");

  bar2.classList.toggle("opacity-0");

  bar3.classList.toggle("-rotate-45");
  bar3.classList.toggle("-translate-y-1.5");
}

const popup = document.getElementById("popup");

export function popupDisplay() {
  popup.classList.remove("hidden");
  popup.classList.add("block");
}

export function closePopup() {
  popup.classList.remove("block");
  popup.classList.add("hidden");
}

export function playAlarmSound() {
  var audio = document.getElementById("alarmSound");
  audio.play();
}