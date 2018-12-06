// DB
var idGyms = '1qi_xKyrQxbJ5ZyCjZdxT_1Pytk7C2Kjim6igfmc2sN0';
var idPokestops = '1-RNWRuqAhZqgy7G2oLXlNoWIwdeRyyCpinS_lCQ8cFg'
var idNests = '1NSKNguQesofI01JInw_OpNLL7Gysm4FEfW6mXXxKmFQ';
var token = 'pk.eyJ1IjoiamFjazk3IiwiYSI6ImNqbXRjbm80bTBueDUzd3A4YXp0ZXBqZ2oifQ.1i7-ebU8LcnydZ2NbjHchg';

// Maps
var map;
var place;

// Layers to store markers
var pokestops = L.layerGroup();
var gyms = L.layerGroup();
var exraids = L.layerGroup();
var nests = L.layerGroup();

// Arrays
var markers = [];
var pokestopMarkers = [];
var gymMarkers = [];
var nestMarkers = [];
var pokedexEntryArr = [];
var pokdexEntry;

var icons = {
  'pokestop': L.icon({
      iconUrl: 'images/icons/pokestop.svg',
      iconSize:     [30,30]}),
  'gym': L.icon({
      iconUrl: 'images/icons/gym.svg',
      iconSize:     [30,30]}),
  'exraid': L.icon({
      iconUrl: 'images/icons/exraid.svg',
      iconSize:     [30,30]}),
}

document.addEventListener('DOMContentLoaded',function(){

  
  map = L.map('map',{minZoom:12}).setView([51.63418066, 0.41838735], 16);
  

// Styles
  //  Default
  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>| Developed by Jack'
  // }).addTo(map);
  
  //  Pokémon Go Style
  L.tileLayer('https://api.mapbox.com/styles/v1/jack97/cjjo4zrswhw3l2sm9okqdxh1g/tiles/256/{z}/{x}/{y}?access_token=' + token, 
  { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> | Developed by Jack'}
  ,{foo: 'bar'}).addTo(map);

  // Locate your self
L.control.locate({
  strings: {
      title: "Find your GPS location."
  }
}).addTo(map);

  // Import Gyms
  Tabletop.init({ 
    key: idGyms,
    callback: function(sheet, tabletop){ 
      // Loop through the data
      for (var i in sheet){
        place = sheet[i];
        // Test to check what data is coming through
        // console.log(place);
        // Check exraid and if yes we shall return the correct gymStatus
        if(place.exraid === 'yes'){
          // Add to markers array
          gymMarkers.push(
            // Gymstatus checks to display correct icon.
          L.marker([place.latitude, place.longitude], {icon: icons['exraid']})
            .addTo(exraids)
            .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
        );
        } else {
            // Add to markers array
            gymMarkers.push(
            // Gymstatus checks to display correct icon.
            L.marker([place.latitude, place.longitude], {icon: icons['gym']})
              .addTo(gyms)
              .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
            );
        }
      }
    },
    simpleSheet: true 
  });
   // Import Pokestops
   Tabletop.init({ 
    key: idPokestops,
    callback: function(sheet, tabletop){ 
      // Loop through the data
      for (var i in sheet){
        place = sheet[i];
        // Test to check what data is coming through
        // console.log(place);
        // Add to markers array
        pokestopMarkers.push(
          L.marker([place.latitude, place.longitude], {icon: icons['pokestop']})
          .addTo(pokestops)
          .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
        );
      }
    },
    simpleSheet: true 
  });
     // Import Nests
     Tabletop.init({ 
      key: idNests,
      callback: function(sheet, tabletop){ 
        // Loop through the data
        for (var i in sheet){
          place = sheet[i];
          // Test to check what data is coming through
          // console.log(place);
          // Get the image from pokedex entry and set it to the icon
          iconNest = {
          'nest': L.icon({
            iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + Number(place.pokedexentry) + '.png',
            iconSize:     [80,80]}),
          }
          // Add to markers array
          nestMarkers.push(
            L.marker([place.latitude, place.longitude], {icon: iconNest['nest']})
            .addTo(nests)
            .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
          );
        }
      },
      simpleSheet: true 
    });



// Add to layer
//map.addLayer(pokestops); //hide pokestops to reduce lag
map.addLayer(gyms);
map.addLayer(exraids);
map.addLayer(nests);
// Layers for the marker controlUI
var baseLayers = {};
var overlays = {
  "Pokestop": pokestops,  
  "Gyms": gyms,
  "Exraid Gyms": exraids,
  "Nests": nests,
};
// Add Layer-Controller to toggle markers
L.control.layers(baseLayers, overlays).addTo(map);

// Push both gyms and pokestop to the main markers array
setTimeout(() => {
  markers =  gymMarkers.concat(pokestopMarkers);
  // console.log(markers);
}, 2000);

});

// Functions
  // Exraid Checker
  function checkExraid() {
      if(place.exraid === 'yes'){
        gymlayerStatus = exraids;
        gymStatus = 'exraid';
      } 
    }
  
