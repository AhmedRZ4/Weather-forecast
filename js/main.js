// 2d2f1da43ff4448196e144621240612
//http://api.weatherapi.com/v1/search.json?key=2d2f1da43ff4448196e144621240612&q=new
//http://api.weatherapi.com/v1/forecast.json?key=2d2f1da43ff4448196e144621240612&q=-15.21,-75.11&days=3
const searchI = document.getElementById("searchI");
const regex = /^[a-zA-Z1-9]+((, | ,| , | |,){1}[a-zA-Z1-9]+)*$/
const validatation = document.querySelector("section .invalid-tooltip");
let idCountry;
const imgs = document.querySelectorAll("section img");
const tempText = document.querySelectorAll("section .card-temp-text");
const tempNumMain = document.querySelectorAll("section .numTemp");
const locationC = document.getElementById("location");
const icons = document.querySelectorAll("section small");
const days = document.querySelectorAll("section h5 span");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const minTemp = document.querySelectorAll("section .minTemp");
searchI.addEventListener("input", () => {
    // check input
    if (regex.test(searchI.value)) {
        fetch(`https://api.weatherapi.com/v1/search.json?key=2d2f1da43ff4448196e144621240612&q=${searchI.value}`, { method: "GET" })
            .then(p => { return p.json(); })
            .then(n => {
                if (n[0] != null) {
                    idCountry = Number(n[0].id);
                    // get forecast
                    if (idCountry != null) {
                        fetch(`https://api.weatherapi.com/v1/forecast.json?key=2d2f1da43ff4448196e144621240612&q=id:${idCountry}&days=3`
                            , { method: "GET" }
                        ).then(e => {
                            if (e.status >= 200 && e.status <= 299) {
                                return e.json();
                            }
                        }).then(o => {
                            display(o);
                        })
                            .catch(error => {
                                window.alert("Please enter a valid location");
                            });

                    } else {
                        console.log("out");
                    }
                }

                validatation.classList.add("d-none");
                validatation.classList.remove("d-block");
            }
            )
            .catch(error => { console.log("out --- " + error) });     
    } else {
        validatation.classList.add("d-block");
        validatation.classList.remove("d-none");
    }
});
// get current location
window.addEventListener("load", () => {
    if (navigator.onLine == true) {
        fetch('https://ip-api.com/json/')
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => {
                            fetch(`https://api.weatherapi.com/v1/forecast.json?key=2d2f1da43ff4448196e144621240612&q=${Number(data.lat)},${Number(data.lon)}&days=3`
                                , { method: "GET" }
                            ).then(e => {
                                if (e.status >= 200 && e.status <= 299) {
                                    return e.json();
                                }
                            }).then(o => {
                                display(o);
                            })
                                .catch(error => {
                                    window.alert("Please enter a valid location");
                                });
                        })
                }
            }
            )
            .catch(error => {
                window.alert("Offline ");
            });
    }
});
function display(obj) {
    //set location
    locationC.innerHTML = (obj.location.name != "" ? (obj.location.name + ", ") : "") + (obj.location.region != "" ? (obj.location.region + ", ") : "") + (obj.location.country)
    //set images
    imgs[0].src = obj.current.condition.icon;
    imgs[1].src = obj.forecast.forecastday[1].day.condition.icon;
    imgs[2].src = obj.forecast.forecastday[2].day.condition.icon;
    //set tempurature footer text       
    tempText[0].innerHTML = obj.current.condition.text;
    tempText[1].innerHTML = obj.forecast.forecastday[1].day.condition.text;
    tempText[2].innerHTML = obj.forecast.forecastday[2].day.condition.text;
    //set tempurater main 
    tempNumMain[0].innerHTML = obj.current.temp_c + "°C";
    tempNumMain[1].innerHTML = obj.forecast.forecastday[1].day.maxtemp_c + "°C";
    tempNumMain[2].innerHTML = obj.forecast.forecastday[2].day.maxtemp_c + "°C";
    //set min tempurater
    minTemp[0].innerHTML = obj.forecast.forecastday[1].day.mintemp_c + "°C";
    minTemp[1].innerHTML = obj.forecast.forecastday[2].day.mintemp_c + "°C";
    // set icon 
    icons[0].innerHTML = obj.current.precip_in + "%";
    icons[1].innerHTML = obj.current.wind_kph + "km/h";
    icons[2].innerHTML = obj.current.wind_dir;
    //set days
    const dayC = new Date(obj.location.localtime.slice(0, 10));
    days[0].innerHTML = daysText[dayC.getDay()];
    days[1].innerHTML = dayC.getDate() + months[dayC.getMonth()];
    days[2].innerHTML = daysText[(new Date(obj.forecast.forecastday[1].date)).getDay()];
    days[3].innerHTML = daysText[(new Date(obj.forecast.forecastday[2].date)).getDay()];
}