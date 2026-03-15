// //! Elements
// const prayerIds = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
// const prayerNames = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];

// const prayers = {
//   Fajr: document.getElementById("fajr"),
//   Sunrise: document.getElementById("sunrise"),
//   Dhuhr: document.getElementById("dhuhr"),
//   Asr: document.getElementById("asr"),
//   Maghrib: document.getElementById("maghrib"),
//   Isha: document.getElementById("isha"),
// };

// const prayerBoxes = document.querySelectorAll(".prayer-time");
// const remainSpan = document.querySelector(".time-remains span");
// const prayerTimesGrid = document.getElementById("prayer-times-grid"); // الـ div الخاص بالمواقيت

// let timingsData = null;
// let countdownInterval = null;

// //! Convert To 12h
// function formatTime(time) {
//   let [h, m] = time.split(":").map(Number);
//   if (h > 12) h -= 12;
//   return `${h}:${m.toString().padStart(2, "0")}`;
// }

// //! Time To Minutes
// function timeToMinutes(time) {
//   let [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// }

// //! Handle denied permission
// function handleLocationDenied() {
//   prayerTimesGrid.style.display = "none"; // اخفاء المواقيت
//   let msg = document.getElementById("no-permission-msg");
//   if (!msg) {
//     msg = document.createElement("p");
//     msg.id = "no-permission-msg";
//     msg.className = "chose-city text-white text-center py-6";
//     msg.textContent =
//       "اختر المدينة أو اعطي سماحية للموقع للحصول على مواقيت الصلاة";
//     prayerTimesGrid.parentNode.insertBefore(msg, prayerTimesGrid);
//   }
//   msg.style.display = "block";
// }

// //! Restore times section
// function restoreTimesGrid() {
//   prayerTimesGrid.style.display = "grid"; // إظهار المواقيت
//   const msg = document.getElementById("no-permission-msg");
//   if (msg) msg.style.display = "none";
// }

// //! Get Location
// function getLocation() {
//   if (!navigator.geolocation) return handleLocationDenied();
//   navigator.geolocation.getCurrentPosition((pos) => {
//     restoreTimesGrid();
//     getPrayerTimes(pos.coords.latitude, pos.coords.longitude);
//     cityAndCountry(pos.coords.latitude, pos.coords.longitude);
//   }, handleLocationDenied);
// }

// //! Fetch Prayer Times
// function getPrayerTimes(lat, lon) {
//   fetch(
//     `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`,
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       timingsData = data.data.timings;
//       updatePrayerTimes();
//       detectNextPrayer();
//       startCountdown();

//       if (countdownInterval) clearInterval(countdownInterval);
//       countdownInterval = setInterval(() => {
//         detectNextPrayer();
//         startCountdown();
//       }, 1000);
//     })
//     .catch(() => {
//       handleLocationDenied();
//     });
// }

// //! Update Prayer Times
// function updatePrayerTimes() {
//   prayerIds.forEach((name) => {
//     prayers[name].textContent = formatTime(timingsData[name]);
//   });
// }

// //! Detect Next Prayer
// function detectNextPrayer() {
//   if (!timingsData) return;
//   let now = new Date();
//   let nowMinutes = now.getHours() * 60 + now.getMinutes();
//   prayerBoxes.forEach((el) => el.classList.remove("active"));

//   for (let i = 0; i < prayerIds.length; i++) {
//     let prayerMinutes = timeToMinutes(timingsData[prayerIds[i]]);
//     if (nowMinutes < prayerMinutes) {
//       document.getElementById("next").textContent = prayerNames[i];
//       prayerBoxes[i].classList.add("active");
//       return;
//     }
//   }

//   document.getElementById("next").textContent = "الفجر";
//   prayerBoxes[0].classList.add("active");
// }

// //! Countdown to next prayer
// function startCountdown() {
//   if (!timingsData) return;
//   let now = new Date();
//   let currentSeconds =
//     now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
//   let nextPrayerSeconds = null;

//   for (let i = 0; i < prayerIds.length; i++) {
//     let [h, m] = timingsData[prayerIds[i]].split(":").map(Number);
//     let prayerSeconds = h * 3600 + m * 60;
//     if (currentSeconds < prayerSeconds) {
//       nextPrayerSeconds = prayerSeconds;
//       break;
//     }
//   }

//   if (nextPrayerSeconds === null) {
//     let [h, m] = timingsData["Fajr"].split(":").map(Number);
//     nextPrayerSeconds = h * 3600 + m * 60 + 86400;
//   }

//   let diff = nextPrayerSeconds - currentSeconds;
//   if (diff < 0) diff += 86400;

//   let hours = Math.floor(diff / 3600)
//     .toString()
//     .padStart(2, "0");
//   let minutes = Math.floor((diff % 3600) / 60)
//     .toString()
//     .padStart(2, "0");
//   let seconds = (diff % 60).toString().padStart(2, "0");

//   remainSpan.textContent = `${seconds} : ${minutes} : ${hours}`;

//   if (diff <= 600) {
//     remainSpan.style.color = "red";
//     remainSpan.style.fontWeight = "bold";
//   } else {
//     remainSpan.style.color = "var(--main-color)";
//     remainSpan.style.fontWeight = "normal";
//   }
// }

// //! Hijri + Gregorian Date
// function updateDates() {
//   let today = new Date();
//   document.getElementById("hijri-date").textContent = new Intl.DateTimeFormat(
//     "ar-SA-u-ca-islamic-nu-arab",
//     { day: "numeric", month: "long", year: "numeric" },
//   ).format(today);

//   document.getElementById("gregorian-date").textContent =
//     new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     }).format(today);
// }

// //! Clock
// function startClock() {
//   setInterval(() => {
//     let now = new Date();
//     let hours = now.getHours();
//     let minutes = now.getMinutes().toString().padStart(2, "0");
//     let seconds = now.getSeconds().toString().padStart(2, "0");
//     let period = hours >= 12 ? "مساءً" : "صباحاً";
//     hours = hours > 12 ? hours - 12 : hours;
//     hours = hours.toString().padStart(2, "0");
//     document.getElementById("time-now").innerHTML =
//       `${seconds} : ${minutes} : ${hours} <span>${period}</span>`;
//   }, 1000);
// }

// //! Dropdown
// const btn = document.getElementById("dropdown-btn");
// const menu = document.getElementById("dropdown-menu");
// const arrow = document.getElementById("dropdown-arrow");

// const governorates = [
//   "الإسكندرية",
//   "البحيرة",
//   "كفر الشيخ",
//   "الدقهلية",
//   "الغربية",
//   "المنوفية",
//   "الشرقية",
//   "دمياط",
//   "القاهرة",
//   "الجيزة",
//   "القليوبية",
//   "بورسعيد",
//   "الإسماعيلية",
//   "السويس",
//   "الفيوم",
//   "بني سويف",
//   "المنيا",
//   "أسيوط",
//   "سوهاج",
//   "قنا",
//   "الأقصر",
//   "أسوان",
// ];

// const governoratesLocation = {
//   الإسكندرية: { lat: 31.2001, lon: 29.9187 },
//   البحيرة: { lat: 30.8481, lon: 30.3436 },
//   "كفر الشيخ": { lat: 31.1107, lon: 30.9398 },
//   الدقهلية: { lat: 31.0409, lon: 31.3785 },
//   الغربية: { lat: 30.8754, lon: 31.0335 },
//   المنوفية: { lat: 30.5972, lon: 30.9876 },
//   الشرقية: { lat: 30.7326, lon: 31.7195 },
//   دمياط: { lat: 31.4165, lon: 31.8133 },
//   القاهرة: { lat: 30.0444, lon: 31.2357 },
//   الجيزة: { lat: 30.0131, lon: 31.2089 },
//   القليوبية: { lat: 30.3292, lon: 31.2165 },
//   بورسعيد: { lat: 31.2653, lon: 32.3019 },
//   الإسماعيلية: { lat: 30.5965, lon: 32.2715 },
//   السويس: { lat: 29.9668, lon: 32.5498 },
//   الفيوم: { lat: 29.3084, lon: 30.8428 },
//   "بني سويف": { lat: 29.0661, lon: 31.0994 },
//   المنيا: { lat: 28.1099, lon: 30.7503 },
//   أسيوط: { lat: 27.1809, lon: 31.1837 },
//   سوهاج: { lat: 26.5591, lon: 31.6957 },
//   قنا: { lat: 26.1551, lon: 32.716 },
//   الأقصر: { lat: 25.6872, lon: 32.6396 },
//   أسوان: { lat: 24.0889, lon: 32.8998 },
// };

// //! Render Governorates
// function renderGovernorates() {
//   governorates.forEach((gov) => {
//     menu.innerHTML += `<li class="p-2 hover:bg-gray-200 cursor-pointer">${gov}</li>`;
//   });
// }

// //! Toggle Dropdown
// btn.onclick = () => {
//   menu.classList.toggle("hidden");
//   arrow.classList.toggle("rotate-180");
// };

// //! Select Governorate
// menu.addEventListener("click", (e) => {
//   if (e.target.tagName === "LI") {
//     let selectedGov = e.target.textContent.trim();
//     btn.childNodes[0].nodeValue = selectedGov;
//     menu.classList.add("hidden");
//     arrow.classList.remove("rotate-180");
//     let coords = governoratesLocation[selectedGov];
//     getPrayerTimes(coords.lat, coords.lon);
//     document.getElementById("governorate").textContent = `${selectedGov} - `;
//     document.getElementById("country").textContent = "مصر";
//     detectNextPrayer();
//     startCountdown();
//     restoreTimesGrid(); // إظهار المواقيت عند اختيار محافظة
//   }
// });

// //! Close Dropdown Outside
// document.addEventListener("click", (e) => {
//   if (!btn.contains(e.target) && !menu.contains(e.target)) {
//     menu.classList.add("hidden");
//     arrow.classList.remove("rotate-180");
//   }
// });

// //! Init
// getLocation();
// updateDates();
// startClock();
// renderGovernorates();

// //! Get City And Country From Location
// function cityAndCountry(lat, lng) {
//   fetch(
//     `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       const addr = data.address;
//       const country = addr.country || "غير معروف";
//       const state =
//         addr.state || addr.province || addr.governorate || "غير معروف";
//       document.getElementById("governorate").textContent = `${state} - `;
//       document.getElementById("country").textContent = country;
//     });
// }

//! Elements
const prayerIds = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const prayerNames = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];

const prayers = {
  Fajr: document.getElementById("fajr"),
  Sunrise: document.getElementById("sunrise"),
  Dhuhr: document.getElementById("dhuhr"),
  Asr: document.getElementById("asr"),
  Maghrib: document.getElementById("maghrib"),
  Isha: document.getElementById("isha"),
};

const prayerBoxes = document.querySelectorAll(".prayer-time");
const remainSpan = document.querySelector(".time-remains span");
const timesSection = document.querySelector("section:nth-of-type(2) > div");
const messageP = document.querySelector("section:nth-of-type(2) > p");

let timingsData = null;
let countdownInterval = null;

//! Convert To 12h
function formatTime(time) {
  let [h, m] = time.split(":").map(Number);
  if (h > 12) h -= 12;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

//! Time To Minutes
function timeToMinutes(time) {
  let [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

//! Restore Times Grid (show)
function restoreTimesGrid() {
  timesSection.style.display = "grid";
  messageP.style.display = "none";
}

//! Fetch Prayer Times from coordinates
function fetchPrayerTimes(lat, lon) {
  fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`,
  )
    .then((res) => res.json())
    .then((data) => {
      timingsData = data.data.timings;
      updatePrayerTimes();
      detectNextPrayer();
      startCountdown();
      restoreTimesGrid();
    })
    .catch(() => {
      messageP.textContent = "حصل خطأ أثناء جلب المواقيت";
      messageP.style.display = "block";
      timesSection.style.display = "none";
    });
}

//! Update Prayer Times
function updatePrayerTimes() {
  prayerIds.forEach((name) => {
    prayers[name].textContent = formatTime(timingsData[name]);
  });
}

//! Detect Next Prayer
function detectNextPrayer() {
  if (!timingsData) return;
  let now = new Date();
  let nowMinutes = now.getHours() * 60 + now.getMinutes();
  prayerBoxes.forEach((el) => el.classList.remove("active"));

  for (let i = 0; i < prayerIds.length; i++) {
    let prayerMinutes = timeToMinutes(timingsData[prayerIds[i]]);
    if (nowMinutes < prayerMinutes) {
      document.getElementById("next").textContent = prayerNames[i];
      prayerBoxes[i].classList.add("active");
      return;
    }
  }

  // لو انتهى اليوم
  document.getElementById("next").textContent = "الفجر";
  prayerBoxes[0].classList.add("active");
}

//! Countdown to next prayer
function startCountdown() {
  if (!timingsData) return;
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    let now = new Date();
    let currentSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    let nextPrayerSeconds = null;

    for (let i = 0; i < prayerIds.length; i++) {
      let [h, m] = timingsData[prayerIds[i]].split(":").map(Number);
      let prayerSeconds = h * 3600 + m * 60;
      if (currentSeconds < prayerSeconds) {
        nextPrayerSeconds = prayerSeconds;
        break;
      }
    }

    if (nextPrayerSeconds === null) {
      let [h, m] = timingsData["Fajr"].split(":").map(Number);
      nextPrayerSeconds = h * 3600 + m * 60 + 86400;
    }

    let diff = nextPrayerSeconds - currentSeconds;
    if (diff < 0) diff += 86400;

    let hours = Math.floor(diff / 3600)
      .toString()
      .padStart(2, "0");
    let minutes = Math.floor((diff % 3600) / 60)
      .toString()
      .padStart(2, "0");
    let seconds = (diff % 60).toString().padStart(2, "0");

    remainSpan.textContent = `${seconds} : ${minutes} : ${hours}`;

    if (diff <= 600) {
      remainSpan.style.color = "red";
      remainSpan.style.fontWeight = "bold";
    } else {
      remainSpan.style.color = "var(--main-color)";
      remainSpan.style.fontWeight = "normal";
    }
  }, 1000);
}

//! Hijri + Gregorian Date
function updateDates() {
  let today = new Date();
  document.getElementById("hijri-date").textContent = new Intl.DateTimeFormat(
    "ar-SA-u-ca-islamic-nu-arab",
    { day: "numeric", month: "long", year: "numeric" },
  ).format(today);

  document.getElementById("gregorian-date").textContent =
    new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
}

//! Clock
function startClock() {
  setInterval(() => {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");
    let period = hours >= 12 ? "مساءً" : "صباحاً";
    hours = hours > 12 ? hours - 12 : hours;
    hours = hours.toString().padStart(2, "0");
    document.getElementById("time-now").innerHTML =
      `${seconds} : ${minutes} : ${hours} <span>${period}</span>`;
  }, 1000);
}

//! Dropdown
const btn = document.getElementById("dropdown-btn");
const menu = document.getElementById("dropdown-menu");
const arrow = document.getElementById("dropdown-arrow");

const governorates = [
  "الإسكندرية",
  "البحيرة",
  "كفر الشيخ",
  "الدقهلية",
  "الغربية",
  "المنوفية",
  "الشرقية",
  "دمياط",
  "القاهرة",
  "الجيزة",
  "القليوبية",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
];

const governoratesLocation = {
  الإسكندرية: { lat: 31.2001, lon: 29.9187 },
  البحيرة: { lat: 30.8481, lon: 30.3436 },
  "كفر الشيخ": { lat: 31.1107, lon: 30.9398 },
  الدقهلية: { lat: 31.0409, lon: 31.3785 },
  الغربية: { lat: 30.8754, lon: 31.0335 },
  المنوفية: { lat: 30.5972, lon: 30.9876 },
  الشرقية: { lat: 30.7326, lon: 31.7195 },
  دمياط: { lat: 31.4165, lon: 31.8133 },
  القاهرة: { lat: 30.0444, lon: 31.2357 },
  الجيزة: { lat: 30.0131, lon: 31.2089 },
  القليوبية: { lat: 30.3292, lon: 31.2165 },
  بورسعيد: { lat: 31.2653, lon: 32.3019 },
  الإسماعيلية: { lat: 30.5965, lon: 32.2715 },
  السويس: { lat: 29.9668, lon: 32.5498 },
  الفيوم: { lat: 29.3084, lon: 30.8428 },
  "بني سويف": { lat: 29.0661, lon: 31.0994 },
  المنيا: { lat: 28.1099, lon: 30.7503 },
  أسيوط: { lat: 27.1809, lon: 31.1837 },
  سوهاج: { lat: 26.5591, lon: 31.6957 },
  قنا: { lat: 26.1551, lon: 32.716 },
  الأقصر: { lat: 25.6872, lon: 32.6396 },
  أسوان: { lat: 24.0889, lon: 32.8998 },
};

//! Render Governorates
function renderGovernorates() {
  governorates.forEach((gov) => {
    menu.innerHTML += `<li class="p-2 hover:bg-gray-200 cursor-pointer">${gov}</li>`;
  });
}

//! Toggle Dropdown
btn.onclick = () => {
  menu.classList.toggle("hidden");
  arrow.classList.toggle("rotate-180");
};

//! Select Governorate
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    let selectedGov = e.target.textContent.trim();
    btn.childNodes[0].nodeValue = selectedGov;
    menu.classList.add("hidden");
    arrow.classList.remove("rotate-180");
    let coords = governoratesLocation[selectedGov];
    fetchPrayerTimes(coords.lat, coords.lon);
    document.getElementById("governorate").textContent = `${selectedGov} - `;
    document.getElementById("country").textContent = "مصر";
  }
});

//! Close Dropdown Outside
document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
    arrow.classList.remove("rotate-180");
  }
});

//! Get Location
function getLocation() {
  if (!navigator.geolocation) {
    messageP.textContent =
      "اختار المدينة أو اعطي سماحية للموقع للحصول على موقعك";
    messageP.style.cssText = "display: flex; justify-content: center;";
    timesSection.style.display = "none";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      fetchPrayerTimes(lat, lon);
      cityAndCountry(lat, lon);
    },
    () => {
      messageP.textContent =
        "اختار المدينة أو اعطي سماحية للموقع للحصول على موقعك";
      messageP.style.cssText = "display: flex; justify-content: center;";
      timesSection.style.display = "none";
    },
  );
}

//! Get City And Country From Location
function cityAndCountry(lat, lng) {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
  )
    .then((res) => res.json())
    .then((data) => {
      const addr = data.address;
      const country = addr.country || "غير معروف";
      const state =
        addr.state || addr.province || addr.governorate || "غير معروف";
      document.getElementById("governorate").textContent = `${state} - `;
      document.getElementById("country").textContent = country;
    });
}

//! Init
renderGovernorates();
getLocation();
updateDates();
startClock();
