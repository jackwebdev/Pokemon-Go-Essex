

mapboxgl.accessToken = 'pk.eyJ1IjoiamFjazk3IiwiYSI6ImNqam80NHhiYjIydjcza20wd3AwajNzZGIifQ.oHWFzGB3jFhqwftPqWMHPw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jack97/cjjo4zrswhw3l2sm9okqdxh1g',
    center: [0.41838735, 51.63418066], // starting position
    minzoom: 3,
    zoom: 16 // starting zoom

});

// Add geolocate + control to the map.
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
  		trackUserLocation: true

}));

// Popups
map.on('click', function(e) {
  var pokestops = map.queryRenderedFeatures(e.point, {
    layers: ['pokestops'] // replace this with the name of the layer
  });

  if (!pokestops.length) {
    return;
  }

  	var pokestop = pokestops[0];

 	var popupPokestops = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(pokestop.geometry.coordinates)
    .setHTML('<h3><strong>' + pokestop.properties.title + '</strong></h3><p>' + pokestop.properties.description + '</p>')
    .setLngLat(pokestop.geometry.coordinates)
    .addTo(map);

});

map.on('click', function(e) {
   var gyms = map.queryRenderedFeatures(e.point, {
    layers: ['gyms'] // replace this with the name of the layer
  });

  if (!gyms.length) {
    return;
  }

  	var gym = gyms[0];

    var popupGyms = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(gym.geometry.coordinates)
    .setHTML('<h3><strong>' + gym.properties.title + '</strong></h3><p>' + gym.properties.description + '</p>')
    .setLngLat(gym.geometry.coordinates)
    .addTo(map);

});

map.on('click', function(e) {
  var exraids = map.queryRenderedFeatures(e.point, {
   layers: ['exraids'] // replace this with the name of the layer
 });

 if (!exraids.length) {
   return;
 }

   var exraid = exraids[0];

   var popupExraid = new mapboxgl.Popup({ offset: [0, -15] })
   .setLngLat(exraid.geometry.coordinates)
   .setHTML('<h3><strong>' + exraid.properties.title + '</strong></h3><p>' + exraid.properties.description + '</p>')
   .setLngLat(exraid.geometry.coordinates)
   .addTo(map);

});
