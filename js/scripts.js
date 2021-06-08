'use strict';

const mapboxToken = `pk.eyJ1IjoibmF0ZWxlZTMiLCJhIjoiY2twbXN2aGMyMTVudzJvbzF5cXp6eXNxcSJ9.gS-W91_vNYab7sDkoO0KrA`
const documenuToken = `fcde733833850f1632dfc4288c914dd6`


mapboxgl.accessToken = 'pk.eyJ1IjoibmF0ZWxlZTMiLCJhIjoiY2twbXN2aGMyMTVudzJvbzF5cXp6eXNxcSJ9.gS-W91_vNYab7sDkoO0KrA';
var map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/navigation-day-v1', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 9 // starting zoom
})

// https://api.documenu.com/v2/restaurants/distance?lat=${lat}&lon=${long}&cuisine=mexican

//Grabs text input and sends SMS message via twilio post request
function sendSMS (recipientNumber, chosenName) {
    fetch(`https://api.twilio.com/2010-04-01/Accounts/ACe38cbd4c09769f19cfeae3ff8792aa49/Messages.json`, {
        mode: "cors",
        method: "POST",
        headers: {'Authentication': 'Basic ' + btoa('ACe38cbd4c09769f19cfeae3ff8792aa49:01d87e452d9de9b3158b9799fd54d6c8')},
        body: JSON.stringify({
            To: `+1${recipientNumber}`,
            From: "+16514139078",
            Body: `Your friend is inviting you to join them for dinner at ${chosenName}`
        })
    })
    .then (response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.error("ERROR", error);
        return error
    })
}

//Listens on Send Invite button and calls sendSMS function
const submitButton = document.querySelector('#submitButton')
submitButton.addEventListener('click', function () {
    console.log("The button has been clicked")
    const recipientNumber = document.querySelector('#recipientNumber')
    const chosenName = "Zaxbys"

    sendSMS(recipientNumber, chosenName)
    
})
