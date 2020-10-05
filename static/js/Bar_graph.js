Plotly.d3.csv('https://raw.githubusercontent.com/sadamytjp/raw_data/master/gasolina/price_State.csv', function(err, rows){
    function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
    }
    
    var allStateNames = unpack(rows, 'Entidad'),
      allYear = unpack(rows, 'Year').map(Number),
      allGas87 = unpack(rows, 'Gas87').map(Number),
      allGas91 = unpack(rows, 'Gas91').map(Number),
      allDiesel = unpack(rows, "Diesel").map(Number)
      listofStates = [],
      currentGas87 = [],
      currentYear = [];
      //console.log(allGas87.map(Number));
      
    for (var i = 0; i < allStateNames.length; i++ ){
      if (listofStates.indexOf(allStateNames[i]) === -1 ){
        listofStates.push(allStateNames[i]);
      }
    }
    
    function getStateData(chosenState) {
      currentGas87 = [];
      currentYear = [];
      currentGas91 = [];
      currentDiesel  = [];
      for (var i = 0 ; i < allStateNames.length ; i++){
        if ( allStateNames[i] === chosenState ) {
          currentGas87.push(allGas87[i]);
          currentYear.push(allYear[i]);
          currentGas91.push(allGas91[i]);
          currentDiesel.push(allDiesel[i]);
        } 
      }    
    };
  
  // Default Country Data
  setBubblePlot('Aguascalientes');
    
  function setBubblePlot(chosenState) {
      getStateData(chosenState);  
  
      var trace1 = {
        histfunc: "avg",
        x: currentYear,
        y: currentGas87,
        type: "histogram",
        name: "Magna",
        marker: {
          size: 12, 
          opacity: 0.7,
          color: "green"
        }
      };
  
      var trace2 = {
        histfunc: "avg",
        x: currentYear,
        y: currentGas91,
        type: 'histogram',
        name: "Premium",
        marker: {
          size: 12, 
          opacity: 0.7,
          color: "red"
        }
      };
  
      var trace3 = {
        histfunc: "avg",
        x: currentYear,
        y: currentDiesel,
        type: 'histogram',
        name: "Diesel",
        marker: {
          size: 12, 
          opacity: 0.7,
          color: "black"
        }
      };
  
      var data = [trace1, trace2, trace3];
  
      var layout = {
        title: 'Average price of gas: '+ chosenState,
        xaxis: {
          autorange: true,
          type: "year"
        },
        yaxis: {
          autorange: true,
          type: "$"
        }
      };
      //console.log(currentYear);
      
      Plotly.newPlot('plotdiv', data, layout, {showSendToCloud: true});
  };
    
  var stateSelector = document.querySelector('#selSubject');

  //var innerContainer = document.querySelector('[data-num="0"'),
    //  stateSelector = innerContainer.querySelector('.countrydata');
  
  function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length;  i++) {
        var currentOption = document.createElement('option');
        currentOption.text = textArray[i];
        selector.appendChild(currentOption);
    }
  }
  
  assignOptions(listofStates, stateSelector);
  
  function updateState(){
      setBubblePlot(stateSelector.value);
  }
    
  stateSelector.addEventListener('change', updateState, false);
  });
