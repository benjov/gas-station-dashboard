Plotly.d3.csv('https://raw.githubusercontent.com/sadamytjp/raw_data/master/gasolina/price_State.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }
    
    var allStateNames = unpack(rows, 'Entidad'),
    allYear = unpack(rows, 'Year').map(Number),
    allGas87 = unpack(rows, 'Gas87').map(Number),
    listofStates = [];
    currentGas87 = [];
    currentYear = [];
    //console.log(allGas87);
    
  for (var i = 0; i < allStateNames.length; i++ ){
    if (listofStates.indexOf(allStateNames[i]) === -1 ){
      listofStates.push(allStateNames[i]);
    }
  }
  
  function getStateData(chosenState) {
    currentGas87 = [];
    currentYear = [];
    for (var i = 0 ; i < allStateNames.length ; i++){
      if ( allStateNames[i] === chosenState ) {
        currentGas87.push(allGas87[i]);
        currentYear.push(allYear[i]);
      } 
    }
  };

function removeElement(arrayName,arrayElement=0)
 {
    for(var i=0; i<arrayName.length;i++ )
     { 
        if(arrayName[i]==arrayElement)
            arrayName.splice(i,1); 
      }
    return arrayName
  }
  setBubblePlot('Aguascalientes');
  
function setBubblePlot(chosenState) {
    getStateData(chosenState);
    var currentGas87Int = removeElement(currentGas87);
    var currentGas87Int = currentGas87Int.filter(dato => dato != null);

    //console.log(currentGas87Int);
    var currentGas87Mean = d3.mean(currentGas87Int);
    //console.log(currentGas87Mean);
    
    var level = (180/4) * currentGas87Mean;
    var degrees = 180 - level, radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1, pathX = String(x), space = ' ', pathY = String(y), pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{ type: 'scatter', x: [0], y: [0], 
        marker: {size: 15, color:'green'}, showlegend: false, 
        name: 'speed', 
        text: currentGas87Mean,
        hoverinfo: 'text+name'},
        { values: [1, 1, 1, 1, 4],
        rotation: 90,
        text: [ "$21.5 - $25", "$18 - $21.5", "$14.5 - $18", "$11 - $14.5", " "],
        textinfo: 'text', 
        textposition:'inside',
        marker: {colors:['rgba(0, 100, 0, .5)', 'rgba(0, 128, 0, .5)',
                        'rgba(34, 139, 34, .5)', 'rgba(46, 139, 87, .5)',
                        'white']},
        hoverinfo: 'text', 
        hole: .5, type: 'pie',
    showlegend: false
    }];
    
    var layout = { 
        shapes:[{ type: 'path', path: path, fillcolor: 'green',
        line: { color: 'green' } }],
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot('gauge-magna', data, layout);

    document.getElementById("text1").innerHTML = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentGas87Mean);

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

