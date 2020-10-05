// Time Series price gas

d3.json("http://127.0.0.1:5000/api/v1.0/price_time_serie").then(function(data) {
    //console.log(data);
    //console.log(data.schema);
    //console.log(data.data);
    //console.log(data.data);

    var Fechas = [];
    var priceGas87 = [];
    var priceGas91 = [];
    var priceDiesel = [];

    // For each station, create a marker and bind a popup with the station's name
    for (var index = 0; index < data.data.length; index++) {
        var Fecha = data.data[index].Fecha;
        var Gas87 = data.data[index].Gas87;
        var Gas91 = data.data[index].Gas91;
        var Diesel = data.data[index].Diesel;

        // Add to the arrays
        Fechas.push(Fecha);
        priceGas87.push(Gas87);
        priceGas91.push(Gas91);
        priceDiesel.push(Diesel)
    }

  var trace1 = {
    type: 'scatter',
    mode: 'lines',
    name: 'Magna',
    x: Fechas,
    y: priceGas87,
    line: {color: 'green'}
    };

  var trace2 = {
    type: 'scatter',
    mode: 'lines',
    name: 'Premium',
    x: Fechas,
    y: priceGas91,
    line: {color: 'red'}
    };

  var trace3 = {
    type: 'scatter',
    mode: 'lines',
    name: 'Diesel',
    x: Fechas,
    y: priceDiesel,
    line: {color: 'black'}
    };

  var data = [trace1, trace2, trace3];

  var layout = {
    title: 'Historical Prices MXN (monthly average)',
    };

  Plotly.newPlot('time-serie', data, layout);

});