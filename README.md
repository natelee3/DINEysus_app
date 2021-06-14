
# DINEysus Web App 

DigitalCrafts week 6 group front-end project

Developed: 6/7/21 - 6/14/21

## Description
DINEysus takes its inspiration from Dionysus, the Greek diety of festivity. Once you enter your address, the app gives you several options of nearby restaurants within your search radius to select. After you make your selection, you can get directions and even send text invites for friends to join you there.

## Live Demo Site
<html>
<a href="http://DINEysus.netlify.app">Go to live site on Netlify</a>
</html>

* If you encounter a CORS error, visit <https://cors-anywhere.herokuapp.com/corsdemo> and click the button to enable temporary server access.

## Screenshots
![DINEysus demo](./css/images/demo.gif)
![DINE.ysus Logo](./css/images/logo1.jpg)

## Features
- Responsive Design allows for mobile/desktop use
- Incorporates bootstrap carousel and collapsible navbar
- Multiple API requests and data manipulation

## Dependencies
DINEysus makes use of several public APIs:
- Mapquest API: takes user address and converts to geographical coordinates
- Documenu API: takes geo coordinates and returns an array of restaurants within a user-specified radius
- Yelp Fusion API: using Documenu results as search terms, return restaurant info (name, address, phone number, image)
- Mapbox API: generates an interactive map with controls and navigation
- Twilio API: uses POST request to send SMS 


## Group

- <a href="https://github.com/1mvnnie">Immanuel Alexander</a>

- <a href="https://github.com/Jabahgundy">Jabah Gundy</a>

- <a href="https://github.com/natelee3">Nate Lee</a>

