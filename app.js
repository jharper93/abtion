const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const app = express();

app.listen(3000);
app.use(express.static('public'));

console.log("App.js running");

    class Flight {
        constructor(time, expected, airline, destination, flightNum, gate, terminal, status) {
            this.time = time,
            this.expected = expected,
            this.airline = airline,
            this.destination = destination,
            this.flightNum = flightNum,
            this.gate = gate,
            this.terminal = terminal,
            this.status = status
        }
    };


app.get('/search', (req, res) => {

    depArr = req.query.depArr;
    place = req.query.place;
    date = req.query.date;
    time = req.query.time;

    var scrapeUrl = `https://www.cph.dk/en/flight-information/${depArr}?q=${place}&date=${date}&time=${time}`

    console.log(scrapeUrl);

    var flights = [];

request(scrapeUrl, function(err, response, html){
        response.statusCode
        if(!err){
            var $ = cheerio.load(html);
        
            allRows = $('.flights__table').children()

            //loops through all the children and creates new Flight object and pushes each onto array 'flights'
            allRows.each(function() { 
                
                    //On the CPH airport website: when the 'expected' time is empty, the regular flight 'time' is wrapped in <em></em> tags, so an extra selector must be added to gain pure text to attribute to timeVal, when this is the case. This is completed by the if statement below.
            
                    var timeVal = $(this).find('.flights__table__col--time div');
                    var statusVal = $(this).find('.flights__table__col--terminal:nth-of-type(2) div span').html();//status

                    if($((timeVal).find('span')).length > 1) {

                        timeVal = '<strike>' + $(this).find('span:nth-child(1)').html() + '</strike>';
                        expectedVal = $(this).find('span:nth-child(2) em').html();
                        statusVal = "Delayed"
                        
                    } else {

                        expectedVal = "";
                        timeVal = $(this).find('em').html();
                        
                    };

                    var airlineVal = $(this).find('.v--desktop-only').next().find('div span span').html();//airline
                    var destVal = $(this).find('.flights__table__col--destination div span strong span').html();//destination
                    var flightNumVal = $(this).find('.flights__table__col--destination div span:nth-child(3) small').html();//flightNum
                    var gateVal = $(this).find('.flights__table__col--gate div span').html();//gate
                    var terminalVal = $(this).find('.flights__table__col--terminal div span').html();//terminal


                    var newFlight = new Flight(timeVal, expectedVal, airlineVal, destVal, flightNumVal, gateVal, terminalVal, statusVal);
                     
                    //if statement below filters out any rows that are filled with anthing other than flight information
                    if(gateVal != 'Gate'){
                        flights.push(newFlight);
                    }
                
                    
                    
            });//allRows.each()
            
            
            res.send(flights);

        } else {
            res.statusCode = 500;
            res.send(err);
        
        }//if(err)
             

    });//request()

});//get

