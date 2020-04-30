
// Create map object
let mymap = L.map('map', {
  center: [39.8282, -98.5795],
  zoom: 3,
  maxZoom: 10,
  minZoom: 3,
  detectRetina: true
});

// add base mymap
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// to hold airport data
let airports = null;

// build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Set2').mode('lch').colors(2);

// dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// add airports to the map
// add airports GeoJson data
airports = L.geoJson.ajax("assets/airports.geojson", {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.AIRPT_NAME);
},
  pointToLayer: function (feature, latlng){
    let id = 0;
    if(feature.properties.CNTL_TWR == "Y"){
      id = 0;
    }else{
      id = 1;
    }
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'fas fa-plane marker-color-' + (id + 1).toString()
      })
    });
  },
  attribution: 'Airport Data &copy; USGS | US States &copy; Mike Bostock | Base Map &copy; CartoDB | Made By Isabella Garcia'
}).addTo(mymap);

// set function for color ramp BuPu - blue/purple
colors = chroma.scale('BuPu').colors(5);

// sets based on number of airports
function setColor(density){
  let id = 0;
  if (density > 18) { id = 4; }
    else if (density > 13 && density <= 18) { id = 3; }
    else if (density > 10 && density <= 13) { id = 2; }
    else if (density > 5 &&  density <= 10) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// set style function that sets fill color.md property eaual to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// add state polygons
let states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);

// create leaflet control object for legend; position in top right corner
let legend = L.control({
  position: 'topright'
});

legend.onAdd = function(){
  let div = L.DomUtil.create('div', 'legend');
  div.innerHTML += '<b>Number of Airports</b><br />';
  div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>19+</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>14-18</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>11-13</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 6-10</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0- 5</p>';
    div.innerHTML += '<hr><b>Air Traffic Control Tower<b><br />';
    div.innerHTML += '<i class="fas fa-plane marker-color-1"></i><p> Yes</p>';
    div.innerHTML += '<i class="fas fa-plane marker-color-2"></i><p> No</p>';

    //return the legend div containing the html content
    return div;
};

// add legend to Map
legend.addTo(mymap);

// add scale bar
L.control.scale({position: 'bottomleft'}).addTo(mymap);
