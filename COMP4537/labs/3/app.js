function myFunc() {
    let XMLHttpRequest = require();
    const xhttp = new XMLHttpRequest();
    xhttp.open(
      "GET",
      "https://exo-engine.com/COMP4537/labs/3/getDate/?name=helly", true);
      xhttp.send();
      xhttp.onreadystatechange = function () {
        console.log("helllo");
      }
  }
  
  myFunc();