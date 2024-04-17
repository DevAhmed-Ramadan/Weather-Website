let submitFind = document.getElementById("submit1");
let submitEmail = document.getElementById("submit2")
let emailInput = document.getElementById("email1");
let cardHeaders = document.querySelectorAll(".card-header");
let searchInput = document.getElementById("search");
let warningMsg = document.getElementById("warning-msg");
let arrOfDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let arrOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let latitude;
let longitude;
let latAndLong;

submitEmail.addEventListener("click", function (e) {
    e.preventDefault()
    location.reload();
})

submitFind.addEventListener("click", function (e) {
    apiData(searchInput.value);
    searchInput.value = null;
})

searchInput.addEventListener("input", function () {
    apiData(searchInput.value);
})



function successCallback(position) {
    console.log(position);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    latAndLong = `${position.coords.latitude},${position.coords.longitude}`
    apiData(latAndLong)
}

function errorCallback(position) {
    console.error(position);
}

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
// ===============================================================================


async function apiData(croods) {
    try {
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c360d874cf574689a4c32418241604&q=${croods}&days=3`);
        let data = await response.json();
        displayCard(data)
    }
    catch {
        apiData(latAndLong);
    }
}



function displayCard(dataOfResponse) {
    for (let i = 0; i < cardHeaders.length; i++) {
        if (i == 0) {
            //                                                                      17 - 04 - 2024 
            cardHeaders[i].children[0].textContent = arrOfDays[new Date(dataOfResponse.forecast.forecastday[i].date).getDay()];
            cardHeaders[i].children[1].textContent = `${new Date(dataOfResponse.forecast.forecastday[i].date).getDate()} ${arrOfMonths[new Date(dataOfResponse.forecast.forecastday[i].date).getMonth()]}`

            cardHeaders[i].nextElementSibling.children[0].textContent = dataOfResponse.location.name;
            cardHeaders[i].nextElementSibling.children[1].children[0].textContent = `${dataOfResponse.forecast.forecastday[i].day.avgtemp_c}°C`;
            cardHeaders[i].nextElementSibling.children[1].children[1].firstChild.src = `https:${dataOfResponse.forecast.forecastday[i].day.condition.icon}`
            cardHeaders[i].nextElementSibling.children[2].textContent = dataOfResponse.forecast.forecastday[i].day.condition.text;
            cardHeaders[i].nextElementSibling.children[3].children[1].textContent = `${dataOfResponse.forecast.forecastday[i].day.daily_chance_of_rain} %`
            cardHeaders[i].nextElementSibling.children[4].children[1].textContent = `${dataOfResponse.forecast.forecastday[i].day.maxwind_kph} Km/h`
        }
        else {
            cardHeaders[i].textContent = arrOfDays[new Date(dataOfResponse.forecast.forecastday[i].date).getDay()];
            cardHeaders[i].nextElementSibling.firstElementChild.firstElementChild.src = `https:${dataOfResponse.forecast.forecastday[i].day.condition.icon}`;
            cardHeaders[i].nextElementSibling.children[1].textContent = `${dataOfResponse.forecast.forecastday[i].day.maxtemp_c}°C`;
            cardHeaders[i].nextElementSibling.children[2].textContent = `${dataOfResponse.forecast.forecastday[i].day.mintemp_c}°C`;
            cardHeaders[i].nextElementSibling.children[3].textContent = dataOfResponse.forecast.forecastday[i].day.condition.text;
        }
    }
}
