var sCSS = require("./main.css");

var L = require("leaflet");
require("leaflet-fullscreen");
require("leaflet-providers");
require("leaflet-area-select");
//<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.1/dist/leaflet.css" />
//<link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/leaflet.fullscreen.css' rel='stylesheet' />
//<script src='https://cdnjs.cloudflare.com/ajax/libs/leaflet-providers/1.1.15/leaflet-providers.min.js'></script>
//<link rel="stylesheet" type="text/css" href="https://heyman.github.io/leaflet-areaselect/src/leaflet-areaselect.css">


// TODO : Is this the correct area to zoom to?
	var map = L.map('mapid',{
    renderer: L.canvas(),
    selectArea: true ,
    preferCanvas: true
  }).setView([53.4483679,-1.3665311], 15);

	var mapbox= L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	});
	


var dsm2m = L.tileLayer.wms("http://www.geostore.com/OGC/OGCInterface;jsessionid=oNcGXBBb9g7YaXZoIbZDdeb3?SESSIONID=-1487330334&INTERFACE=ENVIRONMENT&", {
    layers: 'LIDAR-DSM-TSR-2M-ENGLAND-EA-WMS',
    format: 'image/png',
    transparent: true,
    attribution: "Defra Network WMS server provided by the Environment Agency."
}).addTo(map);

var dtm2m = L.tileLayer.wms("http://www.geostore.com/OGC/OGCInterface;jsessionid=kgs7hVuXq2kfCXG0p0mf2OHA?SESSIONID=377419698&INTERFACE=ENVIRONMENT&", {
    layers: 'LIDAR-DTM-TSR-2M-ENGLAND-EA-WMS',
    format: 'image/png',
    transparent: true,
    attribution: "Defra Network WMS server provided by the Environment Agency."
});

var dsm1m = L.tileLayer.wms("http://www.geostore.com/OGC/OGCInterface;jsessionid=ijwlfBxs9nlruVkFFgyY2i8B?SESSIONID=-1487330334&INTERFACE=ENVIRONMENT&", {
    layers: 'LIDAR-DSM-TSR-1M-ENGLAND-EA-WMS',
    format: 'image/png',
    transparent: true,
    attribution: "Defra Network WMS server provided by the Environment Agency."
});

var dtm1m = L.tileLayer.wms("http://www.geostore.com/OGC/OGCInterface;jsessionid=ckTOaQg1KNqkM6YfXAAebY7i?SESSIONID=377419698&INTERFACE=ENVIRONMENT&", {
    layers: 'LIDAR-DTM-TSR-1M-ENGLAND-EA-WMS',
    format: 'image/png',
    transparent: true,
    attribution: "Defra Network WMS server provided by the Environment Agency."
});

    
/*
	
	function onMapClick(e) {
	    console.log("You clicked the map at " , e.latlng);
	}

	map.on('click', onMapClick);
	*/
var baseLayers = {
    "Mapbox": mapbox,
    "OSM HOT": L.tileLayer.provider('OpenStreetMap.HOT'),
    "OSM Mapnik": L.tileLayer.provider('OpenStreetMap.Mapnik'),
    "Topo Map": L.tileLayer.provider('OpenTopoMap'),
    //"Satellite Images": L.tileLayer.provider('Esri.WorldImagery'),
    "Terrain": L.tileLayer.provider('Stamen.Terrain'),
};


var overlays = {
  "Surface 2m":dsm2m,
  "Terrain 2m":dtm2m,
  "Surface 1m":dsm1m,
  "Terrain 1m":dtm1m
   /* "Previous Schools": PreviousLayer,
    "Pupils (approx)": PupilLayer,
    "Not Recruited From": NotRecruitedLayer,
	"Local Authority":LAOutlines,
	"Recruitment Districts":RecruitmentDistricts*/
};
L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);

L.control.fullscreen().addTo(map);
L.control.scale().addTo(map);


var leafletImage = require("leaflet-image");

map.on('areaselected', (e) => {
  console.log(e,e.bounds, e.bounds.toBBoxString()); // lon, lat, lon, lat 
  leafletImage(map, function(err, canvas) {
    console.log("canvas", canvas);
    // now you have canvas
    // example thing to do with that canvas:
    var ctx = canvas.getContext("2d");
    
    
    var llMin = e.bounds.getNorthWest();
    var llMax = e.bounds.getSouthEast();
    var pMin = map.latLngToLayerPoint(llMin);
    var pMax = map.latLngToLayerPoint(llMax);
    console.log(pMin.x, pMin.y, pMax.x, pMax.y);
    
    var aImageData = ctx.getImageData(pMin.x, pMin.y, pMax.x-pMin.x, pMax.y-pMin.y);
    console.log(ctx, aImageData);
    /*for(var y = 0 ; y < aImageData.height; y++) {
      for(var x = 0 ; x < aImageData.width; x++) {
        var iStart = ((y * aImageData.width) + x ) * 4;
        var iTotal = ((256*256) * aImageData.data[iStart]) + ((256*1) * aImageData.data[iStart+1]) + ((1*1) *aImageData.data[iStart+2]);
        console.log(x, y, iTotal);
      }
    }*/

  });

});


require("leaflet-control-geocoder");

L.Control.geocoder().addTo(map);




