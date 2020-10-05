Plotly.d3.csv('https://raw.githubusercontent.com/sadamytjp/raw_data/master/gasolina/price_State.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }
  
    var allStateNames = unpack(rows, 'Entidad'),
    allYear = unpack(rows, 'Year').map(Number),
    allGas91 = unpack(rows, 'Gas91').map(Number),
    listofStates = [],
    currentGas91 = [],
    currentYear = [];
    //console.log(allGas91);
    
  for (var i = 0; i < allStateNames.length; i++ ){
    if (listofStates.indexOf(allStateNames[i]) === -1 ){
      listofStates.push(allStateNames[i]);
    }
  }
  
  function getStateData(chosenState) {
    currentYear = [];
    currentGas91  = [];
    for (var i = 0 ; i < allStateNames.length ; i++){
      if ( allStateNames[i] === chosenState ) {
        currentYear.push(allYear[i]);
        currentGas91.push(allGas91[i]);
      } 
    }
  };

  setBubblePlot('Aguascalientes');
  
function setBubblePlot(chosenState) {
    getStateData(chosenState);
    
    var currentgas91Mean = d3.mean(currentGas91);
    //console.log(currentgas91Mean);
    
    var level = (180/4) * currentgas91Mean;
    var degrees = 180 - level, radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1, pathX = String(x), space = ' ', pathY = String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{ type: 'scatter', x: [0], y:[0], 
        marker: {size: 15, color:'darkred'}, showlegend: false, 
        name: 'speed', 
        text: currentgas91Mean,
        hoverinfo: 'text+name'},
        { values: [1, 1, 1, 1, 4],
        rotation: 90,
        text: [ "$22.5 - $26", "$19 - $22.5", "$15.5 - $19", "$12 - $15.5", " "],
        textinfo: 'text', 
        textposition:'inside',
        marker: {colors:['darkred', 'firebrick',
                        'red', 'crimson',
                        'rgba(0, 0, 0, 0)']},
        hoverinfo: 'text', 
        hole: .5, type: 'pie',
    showlegend: false
    }];
    
    var layout = { 
        shapes:[{ type: 'path', path: path, fillcolor: 'darkred',
        line: { color: 'darkred' } }],
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('gauge-premium', data, layout);

    document.getElementById("text2").innerHTML = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentgas91Mean);
}


var stateSelector = document.querySelector('#selSubject');

//function assignOptions(textArray, selector) {
//  for (var i = 0; i < textArray.length;  i++) {
//      var currentOption = document.createElement('option');
//      currentOption.text = textArray[i];
//      selector.appendChild(currentOption);
//  }
//}

//assignOptions(listofStates, stateSelector);

function updateState(){
    setBubblePlot(stateSelector.value);
}
  
stateSelector.addEventListener('change', updateState, false);
});

