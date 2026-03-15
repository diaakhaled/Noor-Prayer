//! Get Location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`,
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((prayer) => {
        const fajr = document.getElementById("fajr");
        const sunrise = document.getElementById("sunrise");
        const dhuhr = document.getElementById("dhuhr");
        const asr = document.getElementById("asr");
        const maghrib = document.getElementById("maghrib");
        const isha = document.getElementById("isha");
        let fajrArr = prayer.data.timings.Fajr.split(":");
        +fajrArr[0] > 12
          ? (fajr.innerHTML = `${+fajrArr[0] - 12}:${fajrArr[1]}`)
          : (fajr.innerHTML = prayer.data.timings.Fajr);
        let sunriseArr = prayer.data.timings.Sunrise.split(":");
        +sunriseArr[0] > 12
          ? (sunrise.innerHTML = `${+sunriseArr[0] - 12}:${sunriseArr[1]}`)
          : (sunrise.innerHTML = prayer.data.timings.Sunrise);
        let dhuhrArr = prayer.data.timings.Dhuhr.split(":");
        +dhuhrArr[0] > 12
          ? (dhuhr.innerHTML = `${+dhuhrArr[0] - 12}:${dhuhrArr[1]}`)
          : (dhuhr.innerHTML = prayer.data.timings.Dhuhr);
        let asrArr = prayer.data.timings.Asr.split(":");
        +asrArr[0] > 12
          ? (asr.innerHTML = `${+asrArr[0] - 12}:${asrArr[1]}`)
          : (asr.innerHTML = prayer.data.timings.Asr);
        let maghribArr = prayer.data.timings.Maghrib.split(":");
        +maghribArr[0] > 12
          ? (maghrib.innerHTML = `${+maghribArr[0] - 12}:${maghribArr[1]}`)
          : (maghrib.innerHTML = prayer.data.timings.Maghrib);
        let ishaArr = prayer.data.timings.Isha.split(":");
        +ishaArr[0] > 12
          ? (isha.innerHTML = `${+ishaArr[0] - 12}:${ishaArr[1]}`)
          : (isha.innerHTML = prayer.data.timings.IshaArr);
        //! Next prayer
        if (
          today.getHours() * 60 + today.getMinutes() <
          +fajrArr[0] * 60 + +fajrArr[1]
        ) {
          document.getElementById("next").innerHTML = "الفجر";
          document.querySelector(".prayer-time:nth-child(1)").className +=
            " active";
        } else if (
          today.getHours() * 60 + today.getMinutes() <
          +sunriseArr[0] * 60 + +sunriseArr[1]
        ) {
          document.getElementById("next").innerHTML = "الشروق";
          document.querySelector(".prayer-time:nth-child(2)").className +=
            " active";
        } else if (
          today.getHours() * 60 + today.getMinutes() <
          +dhuhrArr[0] * 60 + +dhuhrArr[1]
        ) {
          document.getElementById("next").innerHTML = "الظهر";
          document.querySelector(".prayer-time:nth-child(3)").className +=
            " active";
        } else if (
          today.getHours() * 60 + today.getMinutes() <
          +asrArr[0] * 60 + +asrArr[1]
        ) {
          document.getElementById("next").innerHTML = "العصر";
          document.querySelector(".prayer-time:nth-child(4)").className +=
            " active";
        } else if (
          today.getHours() * 60 + today.getMinutes() <
          +maghribArr[0] * 60 + +maghribArr[1]
        ) {
          document.getElementById("next").innerHTML = "المغرب";
          document.querySelector(".prayer-time:nth-child(5)").className +=
            " active";
        } else if (
          today.getHours() * 60 + today.getMinutes() <
          +ishaArr[0] * 60 + +ishaArr[1]
        ) {
          document.getElementById("next").innerHTML = "العشاء";
          document.querySelector(".prayer-time:nth-child(6)").className +=
            " active";
        }
      })
      .catch(() => {
        document.querySelector("section:nth(2)").innerHTML =
          "اختار المدينة او اعطي سماحية للموقع بايجاد موقعة لعرض مواقيت الصلاة";
        console.log("none");
      });
  });
}

//! Get Data Hijri And Gregorian
let hijri = document.getElementById("hijri-date");
let gregorian = document.getElementById("gregorian-date");
let today = new Date();
let hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-nu-arab", {
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(today);

let gregorianDate = new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(today);

hijri.innerHTML = hijriDate;
gregorian.textContent = gregorianDate;
//! clock
setInterval(() => {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  hours = hours.toString().padStart(2, "0");
  if (hours > 12) {
    hours -= 12;
    let time = `${seconds} : ${minutes} : ${hours} <span>مساءا</span>`;
    document.getElementById("time-now").innerHTML = time;
  } else {
    let time = `${seconds} : ${minutes} : ${hours} <span>صباحا</span>`;
    document.getElementById("time-now").innerHTML = time;
  }
}, 1000);
let btn = document.getElementById("dropdown-btn");
let menu = document.getElementById("dropdown-menu");
let arrow = document.getElementById("dropdown-arrow");

let governorates = [
"الإسكندرية","البحيرة","كفر الشيخ","الدقهلية","الغربية",
"المنوفية","الشرقية","دمياط","القاهرة","الجيزة",
"القليوبية","بورسعيد","الإسماعيلية","السويس","الفيوم",
"بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان"
];


// إضافة المحافظات
for(let i = 0; i < governorates.length; i++){
  menu.innerHTML += `
  <li class="p-2 hover:bg-gray-200 cursor-pointer">
  ${governorates[i]}
  </li>`;
}


// فتح واغلاق القائمة
btn.onclick = () => {
  menu.classList.toggle("hidden");
  arrow.classList.toggle("rotate-180");
};


// اختيار عنصر
menu.addEventListener("click", (e) => {

  if(e.target.tagName === "LI"){

    btn.childNodes[0].nodeValue = e.target.textContent;

    menu.classList.add("hidden");
    arrow.classList.remove("rotate-180");

  }

});


// اغلاق القائمة عند الضغط خارجها
document.addEventListener("click",(e)=>{

  if(!btn.contains(e.target) && !menu.contains(e.target)){

    menu.classList.add("hidden");
    arrow.classList.remove("rotate-180");

  }

});