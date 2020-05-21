const apiKey = 'MRiZ8DX5wsmKOkYYg57YAIV28j9n9GfM';
const token = 'pk.eyJ1Ijoiam9obmF0aGFubml6aW9sIiwiYSI6ImNqcG5oZjR0cDAzMnEzeHBrZGUyYmF2aGcifQ.7vAuGZ0z6CY0kXYDkcaOBg';
const button = document.querySelector('button');
const poiElementstart = document.querySelector('.origins');
const poiElementend = document.querySelector('.destinations');
const winnipegBoundingBox = "-97.32972, 49.762789, -96.951241, 49.994007"

let lat;
let lon;
let map;

// mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obmF0aGFubml6aW9sIiwiYSI6ImNqcG5oZjR0cDAzMnEzeHBrZGUyYmF2aGcifQ.7vAuGZ0z6CY0kXYDkcaOBg';

button.onclick = e => {
  const startingPoint = document.querySelector('.origin-form');
  const endingPoint = document.querySelector('.destination-form');
  getLocationListstart(startingPoint.value);
  getLocationListend(endingPoint.value); 

  e.preventDefault();
}

function getLocationListstart(query) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${lon},${lat}&types=poi&access_token=${token}&limit=10`)
    .then(resp => resp.json())
    .then(json => {
      insertIntoPOIStartList(json.features);
    });
}
function getLocationListend(query) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?proximity=${lon},${lat}&types=poi&access_token=${token}&limit=10`)
    .then(resp => resp.json())
    .then(json => {

      insertIntoPOIEndList(json.features);
    });
}

navigator.geolocation.getCurrentPosition(function(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}, () => {}, {enableHighAccuracy: true});


function insertIntoPOIStartList(poiList) {
  poiElementstart.textContent = "";
  poiList.sort((a, b) => {
    return distance(lat, lon, b.center[1], b.center[0], "K") - distance(lat, lon, a.center[1], a.center[0], "K");
  });

  poiList.forEach(poi => {
    poiElementstart.insertAdjacentHTML('afterbegin', `
      <li class="poi" data-long="${poi.center[0]}" data-lat="${poi.center[1]}">
        <ul>
          <li class="name">${poi.text}</div>
          <li class="street-address">${poi.properties.address}</div>
          <li class="distance">${distance(lat, lon, poi.center[1], poi.center[0], "K").toFixed(1)} KM</div>
        </ul>
      </li>
    `);
  });
}

function insertIntoPOIEndList(poiList) {
  poiElementend.textContent = "";
  poiList.sort((a, b) => {
    return distance(lat, lon, b.center[1], b.center[0], "K") - distance(lat, lon, a.center[1], a.center[0], "K");
  });

  poiList.forEach(poi => {
    poiElementend.insertAdjacentHTML('afterbegin', `
      <li class="poi" data-long="${poi.center[0]}" data-lat="${poi.center[1]}">
        <ul>
          <li class="name">${poi.text}</div>
          <li class="street-address">${poi.properties.address}</div>
          <li class="distance">${distance(lat, lon, poi.center[1], poi.center[0], "K").toFixed(1)} KM</div>
        </ul>
      </li>
    `);
  });
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}