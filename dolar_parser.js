
var Xray = require('x-ray');
var xray_ready = Xray();
var request = require('request');
var cheerio = require("cheerio");


function sendToMaker(makerKey,eventName,data){
  var url_string = 'https://maker.ifttt.com/trigger/' + eventName + '/with/key/' + makerKey;
  console.log("URL " + url_string);
  
  var html = '<table style="width:100%; background-color:powderblue; font-size: 180%"> <tr style="width:100%; background-color:powderblue;"> <td><center><b><big>PRECIO DOLAR</big></b</center></td> </tr> </table> <table style="width:100%; background-color:powderblue; font-size: 140%"> <tr style="width:50%"> <td><center><b><big>' + data[0].title + '</big></b></center></td> <td><center><b><big>' + data[1].title + '</big></b></center></td> </tr> <tr style="width:50%"> <td><center><b><big>' + data[0].difference + '</big></b></center></td> <td><center><b><big>' + data[1].difference + '</big></b></center></td> </tr><tr style="width:50%"> <td><center><b><big>' + data[0].buy_price + '</big></b></center></td> <td><center><b><big>' + data[1].buy_price + '</big></b></center></td> </tr> </table>'
  
  
  
  request.post({
      url: url_string,
      form:    { 
    'value1' : html,
    'value2' : "",
    'value3' : ""}
    }, function(error, response, body) {
      console.log('Body response was ', body);
      console.log('Error was ', error);
    });
    
  console.log("Send");
}

module.exports = 
  function (ctx, req, res) {
    // write the header and set the response type as a json
    console.log("Response Begin");
    res.writeHead(200, { 'Content-Type': 'application/json' });
    //writeJSON(res);
    console.log("Xray Begin");
    xray_ready('http://www.ambito.com/economia/mercados/monedas/dolar/', {data: xray_ready(
      '.container-fluid div section div div', [{
        title: 'div div h2 a b',
        difference: 'div div div .variacion big',
        buy_price: 'div div div .ultimo big'
        }]
      )
    })(function(err, data) {
    console.log("Xray End")
    
    
    if(err){
      console.log("Xray Error! " + JSON.stringify(err))
      res.write( JSON.stringify(err));
    }
    else{
      console.log("Writing Response")
      var realData = [
          data.data[1],
          data.data[2]
        ];
       console.log("Real Data " + JSON.stringify( realData ))
      
      console.log("Sending event to Maker...")
      sendToMaker("BSBTCmAfGhaWR30dBE3oP","dolar_changed",realData);
      console.log("Event send!")
      res.write( JSON.stringify( realData ));
    }
    
    res.end();
    console.log("Response End")
    })
    
    
  }