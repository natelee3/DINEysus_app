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
        itemDiv.classList.add('item');
        if (index == 0) {itemDiv.classList.add('active')};
        let resultName = document.createElement('p');
        resultName.innerText = item.restaurant_name;
        let resultAddress = document.createElement('p');
        resultAddress = item.address.formatted
        let resultPhone = document.createElement('p');
        resultPhone.innerText = item.restaurant_phone
        itemDiv.append(resultName);
        itemDiv.append(resultAddress);
        itemDiv.append(resultPhone);
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





// mapboxgl.accessToken = 'pk.eyJ1IjoibmF0ZWxlZTMiLCJhIjoiY2twbXN2aGMyMTVudzJvbzF5cXp6eXNxcSJ9.gS-W91_vNYab7sDkoO0KrA';
// var map = new mapboxgl.Map({
// container: 'map', // container ID
// style: 'mapbox://styles/mapbox/navigation-day-v1', // style URL
// center: [-74.5, 40], // starting position [lng, lat]
// zoom: 9 // starting zoom
// })

// https://api.documenu.com/v2/restaurants/distance?lat=${lat}&lon=${long}&cuisine=mexican

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
