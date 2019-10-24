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

//cluster
var clusterGyms = L.markerClusterGroup();
var clusterExraids = L.markerClusterGroup();
var clusterNests = L.markerClusterGroup();
var clusterPokestops = L.markerClusterGroup();

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

// map = L.map('map',{minZoom:12}).setView([51.63418066, 0.41838735], 16);
  map = L.map('essex-map', {center: L.latLng(clat, clng), zoom: zoom});

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
            clusterExraids.addLayer(L.marker([place.latitude, place.longitude], {icon: icons['exraid']})
            .addTo(exraids)
            .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
        ));
        } else {
            // Add to markers array
            gymMarkers.push(
            // Gymstatus checks to display correct icon.
            clusterGyms.addLayer(L.marker([place.latitude, place.longitude], {icon: icons['gym']})
              .addTo(gyms)
              .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
            ));
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
          clusterPokestops.addLayer(L.marker([place.latitude, place.longitude], {icon: icons['pokestop']})
          .addTo(pokestops)
          .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
        ));
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
            iconUrl: checkSprite(Number(place.pokedexentry)),
            iconSize:     [80,80]}),
          }
          // Add to markers array
          nestMarkers.push(
            clusterNests.addLayer(L.marker([place.latitude, place.longitude], {icon: iconNest['nest']})
            .addTo(nests)
            .bindPopup('<h3 class="marker-header">' + place.title + '</h3><p class="marker-text">' + place.description + '</p>')
          ));
        }
      },
      simpleSheet: true 
    });

// Add to layer
//map.addLayer(pokestops); //hide pokestops to reduce lag
// map.addLayer(gyms);
// map.addLayer(exraids);
map.addLayer(clusterNests);
map.addLayer(clusterExraids);
map.addLayer(clusterGyms);
map.addLayer(clusterPokestops)
// Layers for the marker controlUI
var baseLayers = {};
var overlays = {
  "Pokestop": clusterPokestops,  
  "Gyms": clusterGyms,
  "Exraid Gyms": clusterExraids,
  "Nests": clusterNests,
};
// Add Layer-Controller to toggle markers
L.control.layers(baseLayers, overlays).addTo(map);




// Push both gyms and pokestop to the main markers array
setTimeout(() => {
  markers =  gymMarkers.concat(pokestopMarkers);
  // console.log(markers);
}, 2000);

map.on('moveend', onDrag);


});

function onDrag() {
  console.log("Dragged");
  zoom = map.getZoom();
  updateUrl( encodeURI(lonlat), zoom, s2level, s2ring );

  changeS2Level(s2levels)
}

// Functions
  // Exraid Checker
  function checkExraid() {
      if(place.exraid === 'yes'){
        gymlayerStatus = exraids;
        gymStatus = 'exraid';
      } 
    }


    function checkSprite(spriteId) {
      if(spriteId === 0 ) {
        return "https://jackwebdev.github.io/Pokemon-Go-Essex/images/icons/unknownnest.png"
      }
        else {
          return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + spriteId + '.png'
        }
    }

////////////////////////////////////////////////////////////////////
//Big thank you to pgmap.org as this is the same method! 
//Credit to pgmap.org!
//https://pgmap.org/
///////////////////////////////////////////////////////////////////


////Variables
var zoom = getUrlParam("zoom", 16);
var s2cells = L.layerGroup([]);
var s2ring = parseInt(getUrlParam("s2n", 2));
var s2level = parseInt(getUrlParam("s2level", 0));
var lonlat = getUrlParam("lonlat", "51.63418066,0.41838735");
var clat = parseFloat(lonlat.split(",")[0]);
var clng = parseFloat(lonlat.split(",")[1]);

    //Default the map to this starting point - If no data in the URL
    function defaultLatLng() {
      lonlat;
    }

    function round(value, precision, direction) {
      var multiplier = Math.pow(10, precision || 0);
      if (direction < 0) return Math.floor(value * multiplier) / multiplier;  // round towards negative infinity
      if (direction == 0) { // round towards zero
        if (value > 0)
          return Math.floor(value * multiplier) / multiplier; // send positive values down towards zero
        else
          return Math.ceil(value * multiplier) / multiplier; // send negative values up towards zero
      }
      if (direction == 1) return Math.ceil(value * multiplier) / multiplier;   // round towards positive infinity
      if (direction > 1) return Math.round(value * multiplier) / multiplier;   // round to nearest
    }

    function getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = decodeURI(value);
      });
      return vars;
    }

    function getUrlParam(parameter, defaultvalue) {
      var urlparameter = defaultvalue;
      if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
      } else {
        if (parameter == 'lonlat') {
          // if the 'center' parameter was not specified in the url, guess the users location here...
          defaultLatLng();
        }
      }
      return urlparameter;
    }

  function updateUrl(lonlat, zoom, s2lv, s2ring ) {
    var urlString = "essex-map.html?lonlat=" + lonlat + "&zoom=" + zoom + "&s2level=" + s2lv;
    if (history.replaceState) {
      window.history.replaceState({}, "", urlString);
    } else {
      document.location.href = urlString;
    }
  }

  function setS2Selection(s2lv) {
    if (s2lv == 0) s2lv = 0;
    else if (s2lv < 6) s2lv = 6;
    else if (s2lv > 24) s2lv = 24;
    document.getElementById('s2levels').value = s2lv.toString();
  }


    function changeS2Level(s2levels) {
      console.log("ChangeS2Level Ran");
      updateS2Cells(parseInt(s2levels.value));
    }

    function updateS2Cells(s2val) {
      var c = map.getCenter();
      console.log(c);
      lonlat = round(c.lat, 6, -1).toFixed(6) + ',' + round(c.lng, 6, -1).toFixed(6);
      s2val = parseInt(s2val);
  
      if (isNaN(s2val)) s2val = 0;
  
      //s2val = 21 : s2levels  6 & 10
      //s2val = 22 : s2levels 10 & 14
      //s2val = 23 : s2levels 14 & 17
      //s2val = 24 : s2levels 17 & 20
      if (s2val == -1) s2val = parseInt(getUrlParam("s2level", 0));
      if (!s2val) s2val = 0; // if s2val = 0, null, undefined, NaN
      else if (s2val < 6) s2val = 6;
      else if (s2val > 24) s2val = 24;
      s2level = s2val;
  
  
      s2ring = parseInt(getUrlParam("s2n", 2));
      if (s2ring < 0) s2ring = 0;
      if (s2ring > 20) s2ring = 20;
  
      updateUrl(encodeURI(lonlat), zoom, s2level, s2ring );
        
      map.removeLayer(s2cells);
      s2cells.clearLayers();
  
      if (s2level == 0) return; //S2 cells have been turned off, so we're done...
  
      //s2val = 21 : s2levels  6 & 10
      //s2val = 22 : s2levels 10 & 14
      //s2val = 23 : s2levels 14 & 17
      //s2val = 24 : s2levels 17 & 20
      var parent_level = 10;
      var children_level = 10;
      if (s2level > 20) {
        if (s2level == 21) {
          parent_level = 6;
          children_level = 10;
        } else if (s2level == 22) {
          parent_level = 10;
          children_level = 14;
        } else if (s2level == 23) {
          parent_level = 14;
          children_level = 17;
        } else if (s2level == 24) {
          parent_level = 17;
          children_level = 20;
        }
  
        var s2 = S2.S2Cell.FromLatLng({lat: c.lat, lng: c.lng}, parent_level);
        var s2c = s2.getChildren(children_level);
  
        for (var i = 0; i < s2c['children'].length; i++) {
          var cn = s2c['children'][i].getCornerLatLngs();
          for (var j = 0; j < 4; j++) {
            var latlngs = [[cn[0].lat, cn[0].lng],[cn[1].lat, cn[1].lng],[cn[2].lat, cn[2].lng],[cn[3].lat, cn[3].lng]];
            s2cells.addLayer(L.polygon(latlngs, {color: '#4CAF50', weight: 2, fillColor: '#4CAF50', fillOpacity: 0.05}));
          }
        }
        for (var i = 0; i < s2c['neighbors'].length; i++) {
          var cn = s2c['neighbors'][i].getCornerLatLngs();
          for (var j = 0; j < 4; j++) {
            var latlngs = [[cn[0].lat, cn[0].lng],[cn[1].lat, cn[1].lng],[cn[2].lat, cn[2].lng],[cn[3].lat, cn[3].lng]];
            s2cells.addLayer(L.polygon(latlngs, {color: '#0000cc', weight: 4, fillColor: '#333333', fillOpacity: 0.1}));
          }
        }
        map.addLayer(s2cells);
        return;
      }
  
      var s2 = S2.S2Cell.FromLatLng({lat: c.lat, lng: c.lng}, s2level);
      var neighbors = s2.getNeighbors(s2ring); // NxN grid of cells centered on s2, where N=2*s2ring+1
  
      for (var i = 0; i < neighbors.length; i++) {
        var cn = neighbors[i].getCornerLatLngs();
        for (var j = 0; j < 4; j++) {
          var latlngs = [[cn[0].lat, cn[0].lng],[cn[1].lat, cn[1].lng],[cn[2].lat, cn[2].lng],[cn[3].lat, cn[3].lng]];
          s2cells.addLayer(L.polygon(latlngs, {color: '#0000cc', weight: 4, fillColor: '#333333', fillOpacity: 0.1}));
        }
      }
      map.addLayer(s2cells);
    }
  
//Get current selector value
function getCurrentSelectorValue(){
  var s2level = parseInt(getUrlParam("s2level", 0));
  setS2Selection(s2level);
  updateS2Cells(s2level);
}
setTimeout(getCurrentSelectorValue, 2000);