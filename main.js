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

let timingsData = null;

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

//! Get Location
function getLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((pos) => {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    getPrayerTimes(lat, lon);
  });
}

//! Fetch Prayer Times
function getPrayerTimes(lat, lon) {
  fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`,
  )
    .then((res) => res.json())
    .then((data) => {
      timingsData = data.data.timings;

      updatePrayerTimes();
      detectNextPrayer();

      //! تحديث الصلاة القادمة كل دقيقة
      setInterval(detectNextPrayer, 60000);
    })
    .catch(() => {
      document.querySelector("section:nth-child(2)").innerHTML =
        "اختار المدينة او اعطي سماحية للموقع لعرض مواقيت الصلاة";
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
    let prayerTime = timingsData[prayerIds[i]];
    let prayerMinutes = timeToMinutes(prayerTime);

    if (nowMinutes < prayerMinutes) {
      document.getElementById("next").textContent = prayerNames[i];

      prayerBoxes[i].classList.add("active");

      return;
    }
  }

  //! لو اليوم انتهى تكون الصلاة القادمة الفجر
  document.getElementById("next").textContent = "الفجر";
  prayerBoxes[0].classList.add("active");
}

//! Hijri + Gregorian Date
function updateDates() {
  let today = new Date();

  const hijri = document.getElementById("hijri-date");
  const gregorian = document.getElementById("gregorian-date");

  hijri.textContent = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-nu-arab", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  gregorian.textContent = new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
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

    let period = hours >= 12 ? "مساءا" : "صباحا";

    if (hours > 12) hours -= 12;

    document.getElementById("time-now").innerHTML =
      `${hours}:${minutes}:${seconds} <span>${period}</span>`;
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

//! Render Governorates
function renderGovernorates() {
  governorates.forEach((gov) => {
    menu.innerHTML += `
    <li class="p-2 hover:bg-gray-200 cursor-pointer">
      ${gov}
    </li>
    `;
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
    btn.childNodes[0].nodeValue = e.target.textContent;

    menu.classList.add("hidden");
    arrow.classList.remove("rotate-180");
  }
});

//! Close Dropdown Outside
document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
    arrow.classList.remove("rotate-180");
  }
});

//! Init
getLocation();
updateDates();
startClock();
renderGovernorates();