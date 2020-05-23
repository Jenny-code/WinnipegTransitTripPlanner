const token = 'pk.eyJ1IjoiamVubnljb2RlIiwiYSI6ImNrYTVzb3BiMTAwNTkycHBwbHhzYjFyYXkifQ.ZWBR9IOL-4E9M3ouFGB6Cw';
const originForm = document.querySelector('.origin-form');
const originsList = document.querySelector('.origins');
const originContainer = document.querySelector('.origin-container');
const destinationsList = document.querySelector('.destinations');
const destinationContainer = document.querySelector('.destination-container');
const body =document.querySelector("body");
const busContainer = document.querySelector(".bus-container");

originContainer.onsubmit = e => { 
  const inputElement = e.target.querySelector('input');
  displayOrigins(inputElement.value);
  inputElement.value = "";
  e.preventDefault();
}

destinationContainer.onsubmit = e => { 
  const inputElement = e.target.querySelector('input');
  displayDestinations(inputElement.value);
  inputElement.value = "";
  e.preventDefault();
}

function displayOrigins(query) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275&access_token=${token}`)
    .then(resp => resp.json())
    .then(data => {  
      let originsHTML = "";   
      data.features.forEach(location => {
        originsHTML += `<li data-long="${location.geometry.coordinates[0]}" data-lat="${location.geometry.coordinates[1]}"
          <div class="name">${location.text}</div>
          <div>${location.properties.address}</div>
          </li>
        `
      });   
    originsList.innerHTML = originsHTML;
  });
}

function displayDestinations(query) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=10&bbox=-97.325875,49.766204,-96.953987,49.99275&access_token=${token}`)
    .then(resp => resp.json())
    .then(data => {
      let destinationsHTML = "";
      data.features.forEach(location => {
        destinationsHTML += `<li data-long="${location.geometry.coordinates[0]}" data-lat="${location.geometry.coordinates[1]}"
          <div class="name">${location.text}</div>
          <div>${location.properties.address}</div>
          </li>
        `
      });  
    destinationsList.innerHTML = destinationsHTML;
  });
}

function plannedTrip(){
  let startList = originContainer.querySelectorAll("li.selected");
  console.log(startList)
  let endList = destinationContainer.querySelectorAll("li.selected");
  console.log(endList)

  let originAddress = startList[0].attributes[2].ownerElement.firstElementChild.innerHTML;
  console.log(originAddress);
  let destinationAddress = endList[0].attributes[2].ownerElement.firstElementChild.innerHTML;
  console.log(destinationAddress)

  fetch`(https://api.winnipegtransit.com/v3/trip-planner.json?api-key=emmMSENp8bkUurjFPDyP&origin=${originAddress}&destination=${destinationAddress})`
  .then(resp => resp.json())
  .then(data => {
    console.log(data)
  })

}

originsList.addEventListener("click", function(e){
  const origclickedEle = e.target.closest('LI')
  let selectedStart = originContainer.querySelectorAll("li");
    for (selection of selectedStart){
      selection.classList.remove("selected");
    }
    origclickedEle.classList.add("selected");
})

destinationsList.addEventListener("click", function(e){
  const destclickedEle = e.target.closest('LI')
  let selectedEnd = destinationContainer.querySelectorAll("li");
  for (selection of selectedEnd){
    selection.classList.remove("selected"); 
  }
  destclickedEle.classList.add("selected");
})

body.addEventListener('click', function(e){

  if (e.target.nodeName === "BUTTON" ){
    plannedTrip();

  }
})