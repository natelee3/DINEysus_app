'use strict';

const startButton = document.querySelector('#getStarted');
const documenuToken = `fcde733833850f1632dfc4288c914dd6`
const mapquestKey = `EpFz7Wy7GIu3sNdKCA7Iq9cZ6PM6Gd3G`
const mapboxToken = `pk.eyJ1IjoibmF0ZWxlZTMiLCJhIjoiY2twbXN2aGMyMTVudzJvbzF5cXp6eXNxcSJ9.gS-W91_vNYab7sDkoO0KrA`


startButton.addEventListener('click', function() {
    console.log("Button clicked")
    const streetInputRaw = document.querySelector('#street-name');
    const cityInput = document.querySelector('#city');
    const stateInput = document.querySelector('#state');
    const zipInput = document.querySelector('#zipcode');
    const radiusInput = document.querySelector('#radius');
    const streetInput = streetInputRaw.value.replace(/\s/g, "+");
    addressToGeo(streetInput, cityInput.value, stateInput.value, zipInput.value, radiusInput.value)
})

function addressToGeo (street, city, state, zip, radius) {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${mapquestKey}&street=${street}&city=${city}&state=${state}&postalCode=${zip}`)
        .then(response => {
            return response.json();
        })
        .then(body => {
            let userLat = body.results[0].locations[0].latLng.lat
            let userLng = body.results[0].locations[0].latLng.lng
            console.log("User lat and lon: ", userLat, userLng)
            console.log("Minutes: ", radius)
            getResults(userLat, userLng, radius)
        })
        .catch(error => {
            console.error("ERROR", error);
            return error;
        })
}

function getResults (lat, lon, minutes) {
    let docUrl = `https://api.documenu.com/v2/restaurants/distance?minutes=${minutes}&mode=driving&lat=${lat}&lon=${lon}&key=${documenuToken}`
    fetch(docUrl)
        .then(response => {
            return response.json();
        })
        .then(body => {
            console.log(body)
            updateResults(body, lat, lon)
        })
        .catch(error => {
            console.error("ERROR", error);
            return error
        })
}

function updateResults (body, userLat, userLon) {
    const carousel = document.querySelector('.carousel-inner')
    const resultArray = body.data.slice(0,3)
    resultArray.forEach(function (item, index) {
        let itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');
        if (index == 0) {itemDiv.classList.add('active')};

        let svg = document.createElement('svg');
        svg.setAttribute("class", "bd-placeholder-img");
        svg.setAttribute("viewBox", "0 0 100 100")
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
        svg.setAttribute("focusable", "false");
        itemDiv.appendChild(svg)
        let rect = document.createElement('rect');
        rect.setAttribute("width", "100%")
        rect.setAttribute("height", "100%");
        rect.setAttribute("fill", "#d3d3d3");
        svg.appendChild(rect)

        let textContainer = document.createElement('div');
        textContainer.classList.add('container');
        let textStart = document.createElement('div');
        // textStart.classList.add('carousel-caption', 'text-start')
        textContainer.appendChild(textStart);
        itemDiv.appendChild(textContainer);
        let resultName = document.createElement('h3');
        resultName.innerText = item.restaurant_name;
        let resultAddress = document.createElement('p');
        resultAddress = item.address.formatted
        let resultPhone = document.createElement('p');
        resultPhone.innerText = item.restaurant_phone
        let choiceButton = document.createElement('button');
        choiceButton.classList.add("choiceButton", "btn", "btn-primary", "btn-lg")
        choiceButton.innerText = "Choose this Option";
        textStart.append(resultName);
        textStart.append(resultAddress);
        textStart.append(resultPhone);
        textStart.append(choiceButton)
        carousel.append(itemDiv)
    })

    // console.log(`Restaurant location is: `, body.data[0].geo.lat, body.data[0].geo.lon)
    let destinationLat = body.data[0].geo.lat;
    let destinationLon = body.data[0].geo.lon;
    console.log({userLat},{userLon})
    generateMap(userLat, userLon, destinationLat, destinationLon)
    // generateMap(-122.42, 37.78, -77.03, 38.91)
}


function generateMap (lat1, lon1, lat2, lon2) {
    // let mapboxUrl = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${lat1},${lon1};${lat2},${lon2}?access_token=${mapboxToken}`
    // fetch(mapboxUrl)
    //     .then(response => {
    //         return response.json()
    //     })
    //     .then(body => {
    //         console.log(body)
    //     })
    //     .catch(error => {
    //         console.error("ERROR", error);
    //         // return error;
    //     })
        let lat1num = parseFloat(lat1)
        let lon1num = parseFloat(lon1)

        mapboxgl.accessToken = 'pk.eyJ1IjoibmF0ZWxlZTMiLCJhIjoiY2twbXN2aGMyMTVudzJvbzF5cXp6eXNxcSJ9.gS-W91_vNYab7sDkoO0KrA';
        var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        center: [lon1num, lat1num],
        zoom: 13
        });
        
        map.addControl(new mapboxgl.NavigationControl());

        map.addControl(
        new MapboxDirections({
        accessToken: mapboxgl.accessToken
        }),
        'top-left'
        );    
}




//Grabs text input and sends SMS message via twilio post request
// function sendSMS (recipientNumber, chosenName) {
//     fetch(`https://api.twilio.com/2010-04-01/Accounts/ACe38cbd4c09769f19cfeae3ff8792aa49/Messages.json`, {
//         mode: "cors",
//         method: "POST",
//         headers: {'Authentication': 'Basic ' + btoa('ACe38cbd4c09769f19cfeae3ff8792aa49:01d87e452d9de9b3158b9799fd54d6c8')},
//         body: JSON.stringify({
//             To: `+1${recipientNumber}`,
//             From: "+16514139078",
//             Body: `Your friend is inviting you to join them for dinner at ${chosenName}`
//         })
//     })
//     .then (response => {
//         return response.json()
//     })
//     .then(data => {
//         console.log(data)
//     })
//     .catch(error => {
//         console.error("ERROR", error);
//         return error
//     })
// }

// //Listens on Send Invite button and calls sendSMS function
// const submitButton = document.querySelector('#submitButton')
// submitButton.addEventListener('click', function () {
//     console.log("The button has been clicked")
//     const recipientNumber = document.querySelector('#recipientNumber')
//     const chosenName = "Zaxbys"

//     sendSMS(recipientNumber, chosenName)
    
// })


//Handler for multiple buttons

if (document.body.addEventListener) {
    document.body.addEventListener('click', buttonHandler, false)
}
else {
    document.body.attachEvent('onclick', buttonHandler);
}

function buttonHandler(e){
    e = e || window.event;
    let target = e.target || e.srcElement;
    if (target.className.match('choiceButton')) {
        let userChoice = document.querySelector('#carousel-item active > h3');
        console.log("User Choice: ", userChoice)
        console.log("One of the user choice buttons was clicked.")
    }
}