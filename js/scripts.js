'use strict';

//Public API keys have all been removed for security. Please visit our live deployment at http://DINEysus.netlify.app

const startButton = document.querySelector('#getStarted');
const documenuToken = ``
const mapquestKey = ``
const mapboxToken = ``
const yelpAPIkey = ``

//Event listener for start button to gather input data from user
startButton.addEventListener('click', function() {
    console.log("Button clicked")
    const streetInputRaw = document.querySelector('#street-name');
    const cityInput = document.querySelector('#city');
    const stateInput = document.querySelector('#state');
    const zipInput = document.querySelector('#zipcode');
    const radiusInput = document.querySelector('#radius');
    const streetInput = streetInputRaw.value.replace(/\s/g, "+");
    addressToGeo(streetInput, cityInput.value, stateInput.value, zipInput.value, radiusInput.value)

    const resultsElement = document.querySelector('#resultsSection');
    resultsElement.scrollIntoView()
})

//Call mapquest API to convert user inputted address to coordinates
function addressToGeo (street, city, state, zip, radius) {
    fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${mapquestKey}&street=${street}&city=${city}&state=${state}&postalCode=${zip}`)
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

//Call the Documenu API to find restaurants within {minutes} of user location
function getResults (lat, lon, minutes) {
    let docUrl = `https://api.documenu.com/v2/restaurants/distance?minutes=${minutes}&mode=driving&lat=${lat}&lon=${lon}&key=${documenuToken}`
    fetch(docUrl)
        .then(response => {
            return response.json();
        })
        .then(body => {
            console.log(body)
            sliceResults(body, lat, lon)
        })
        .catch(error => {
            console.error("ERROR", error);
            return error
        })
}

//Reduce the result array from 21 results to 3
function sliceResults(body, lat, lon) {
    const resultArray = body.data.slice(0,4)
    getYelpDetails(resultArray, lat, lon)
}

//Search Yelp API to gather images for each search result
function getYelpDetails (resultArray, lat, lon) {
    let yelpArray = []
        resultArray.forEach(function (item) {
            let searchTerm = item.restaurant_name
            let yelpUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchTerm}&latitude=${lat}&longitude=${lon}`
            fetch(yelpUrl, {
                headers: {
                    "Authorization": `Bearer ${yelpAPIkey}`,
                    "Access-Control-Allow-Origin": "*",
                    "accept": "application/json"
                },
            })
                .then(response => {
                    return response.json()
                })
                .then(body => {
                    console.log(body)
                    yelpArray.push(body.businesses[0])
                })
                .catch(error => {
                    console.error("ERROR", error)
                    return error
                })
        })
    //Programmed pause for loop to finish populating imageArray
    setTimeout(function() {
        updateResults(yelpArray, lat, lon)

    },3000)
    
} 

function cleanPhoneNumber (phoneNumberString) {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[2] + ') ' + match[3] + '-' + match[4];
    }
    return null;
}

//Create and update carousel-inner to show restaurant search results
function updateResults (yelpArray, userLat, userLon) {
    const carousel = document.querySelector('.carousel-inner')
    yelpArray.forEach(function (item, index) {        

        let itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');
        if (index == 0) {itemDiv.classList.add('active')};

        let wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('image-wrapper', 'row', 'justify-content-center');
        let resultImage = document.createElement('img');
        resultImage.classList.add('result-image', 'mx-auto')
        resultImage.src = item.image_url
        wrapperDiv.append(resultImage);
        itemDiv.append(wrapperDiv);

        let textContainer = document.createElement('div');
        textContainer.classList.add('container', 'textContainer');

        let resultName = document.createElement('h4');
        resultName.innerText = item.name;
        let resultAddress = document.createElement('p');
        resultAddress.innerText = item.location.address1
        let resultPhone = document.createElement('p');
        resultPhone.innerText = cleanPhoneNumber(item.phone)
        let choiceButton = document.createElement('button');
        choiceButton.classList.add("choiceButton", "btn", "btn-primary", "btn-md");
        choiceButton.innerText = "Choose this Option";

        textContainer.append(resultName);
        textContainer.append(resultAddress);
        textContainer.append(resultPhone);
        textContainer.append(choiceButton);
        itemDiv.append(textContainer);
        carousel.append(itemDiv)
    })
    generateMap(userLat, userLon)
}


//Populate map div with an interactive map, centered on user coordinates
function generateMap (lat1, lon1) {
    let lat1num = parseFloat(lat1)
    let lon1num = parseFloat(lon1)

    mapboxgl.accessToken = '';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-day-v1', 
    center: [lon1num, lat1num], 
    zoom: 13
    });

    map.on('load', function () {
        map.resize();
    });
    // Code to add map control
    map.addControl(new mapboxgl.NavigationControl());

    map.addControl(
    new MapboxDirections({
    accessToken: mapboxgl.accessToken
    }),
    'top-left'
    );    
}

//Handler for multiple buttons on carousel slides
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
        let userChoice = document.querySelector('.carousel-item.active h4');
        console.log("User Choice: ", userChoice.innerText)
        let chosenName = userChoice.innerText
        const mapElement = document.querySelector('#mapSection');
        mapElement.scrollIntoView()
        sendInvite(chosenName)
    }
}

//Listens on Send Invite button and calls sendSMS function
function sendInvite (chosenName) {
    const submitButton = document.querySelector('#submitButton')
    submitButton.addEventListener('click', function () {
        console.log("The button has been clicked")
        const friendName = document.querySelector('#recipientName')
        const recipientRaw = document.querySelector('#recipientNumber')
        let recipientNumber = recipientRaw.value.replace(/[\s()-]/g, '')
        
        console.log(recipientNumber, friendName.value, chosenName)
        sendSMS(recipientNumber, friendName.value, chosenName)
        
    })
}

//Grabs text input and sends SMS message via twilio post request
function sendSMS (recipientNumber, friendName, chosenName) {
    const textBody = {
        'To': `${recipientNumber}`,
        'From': '+16514139078',
        'Body': `Your friend ${friendName} is inviting you to join them for dinner at ${chosenName}`
    }
    fetch(`https://cors-anywhere.herokuapp.com/https://api.twilio.com/2010-04-01/Accounts/ACe38cbd4c09769f19cfeae3ff8792aa49/Messages.json`, {
        // mode: "cors",
        origin: "null",
        method: "POST",
        headers: {
            'Authorization':'',
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: new URLSearchParams(textBody)
    })
    .then (response => {
        return response.json()
    })
    .then(data => {
        alert("Message sent")
        console.log(data)
    })
    .catch(error => {
        console.error("ERROR", error);
        return error
    })
}





