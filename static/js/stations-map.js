// MAP Stations

d3.json("http://127.0.0.1:5000/api/v1.0/price_sep27_2020").then(function(data) {
  //console.log(data);

  d3.json("http://127.0.0.1:5000/api/v1.0/price_state").then(function(Estados) {
  var States = [];
  var names = [];
  
  // For each station, create a marker and bind a popup with the station's name
  for (var index = 0; index < Estados.data.length; index++) {
    if (Estados.data[index].Year == 2017 && Estados.data[index].Month == 3){
      var name = Estados.data[index].Entidad;
      var state = [Estados.data[index].Entidad, Estados.data[index].Longitud, Estados.data[index].Latitud];
      // Add to array
      names.push(name);
      States.push(state);
      }
    };
  //console.log(States[1]);
  
  // Add Options in select("#selSubject") OR select("select")
  d3.select("#selSubject")
    .selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .html(function(name) {
      return name;
    });
  
  //*************************************************************//
  // Data Init:
  //*************************************************************//
  mapping(data, States[0][0], [States[0][1], States[0][2]]);

  //*************************************************************//
  // Data CHANGE across dropdownn menu:
  //*************************************************************//
  d3.selectAll("#selSubject").on("change", updateMap );

    //*************************************************************//
  // UPDATE MAPPING:  
  //*************************************************************//
  function updateMap() {
    var dropdownMenu = d3.select("#selSubject");
    var Subject = dropdownMenu.property("value");
    //
    d3.select("#map").remove();

    d3.select("#NewMap").html("<div id=\"map\" style = \"width: 500px; height: 350px\"></div>");

    //d3.select("#NewMap").html("<div id=\"map\" class = \"col-md-12\" style = \"width: 500px; height: 350px\"></div>");

    var newData = States.filter(function(item){
      return item[0] == Subject;         
      });
    
    mapping(data, newData[0][0], [newData[0][1], newData[0][2]] );
  };

  });

  //*************************************************************//
  // MAPPING:  
  //*************************************************************//

  function mapping(data, state, Coordenadas) {
  //console.log([data.data[0].Latitud, data.data[0].Longitud]);
  //sconsole.log(data.data[0].Entidad);
  // Verificar que los nombres esten en minúculas y con acentos, ya que compara
  // dos archivos distintos

  var stationMarkers = [];
  
  // For each station, create a marker and bind a popup with the station's name
  for (var index = 0; index < data.data.length; index++) {
    if (data.data[index].Entidad == state){
      var stationMarker = L.marker([data.data[index].Latitud, data.data[index].Longitud])
                            .bindPopup("<h4>" + data.data[index].Razon_Social + "<h4><h4>Franquicia: " 
                            + data.data[index].Franquicia_Marca + "<h4><hr><h4>Precios: </h4><p>Magna: " 
                            + data.data[index].Gas87 + "<p><p>Premium: " + data.data[index].Gas91 + "<p><p>Diésel: " 
                            + data.data[index].Diesel + "<p>");

      // Add the marker to the stationMarkers array
      stationMarkers.push(stationMarker);
    }
  };
  
  //console.log(stationMarkers);

  // Create base street-map:
  function createMap(stationMarkers) {
      // Create the tile layer that will be the background of our map
      var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 16,
        id: "mapbox.light",
        accessToken: API_KEY
        });

      // Create a baseMaps object to hold the lightmap layer
      var baseMaps = { "Light Map": lightmap };

      // Create an overlayMaps object to hold the bikeStations layer
      var overlayMaps = { "Gas Stations": stationMarkers };

      // Create the map object with options
        var map = L.map("map", {
          center: [Coordenadas[1], Coordenadas[0]],
          zoom: 10,
          layers: [lightmap, stationMarkers]
          });
  
      // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    };

  createMap(L.layerGroup(stationMarkers));
  };

});
