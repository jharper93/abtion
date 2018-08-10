const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
const app = express();

app.listen(3000);
app.use(express.static('public'));

console.log("App.js running");

    class Flight {
        constructor(time, expected, airline, destination, flightNum, gate, status) {
            this.time = time,
            this.expected = expected,
            this.airline = airline,
            this.destination = destination,
            this.flightNum = flightNum,
            this.gate = gate,
            this.status = status
        }
    }; 


app.get('/search', (req, res) => {

    depArr = req.query.depArr;
    place = req.query.place;
    date = req.query.date;
    time = req.query.time;

    function myFunction() {

        var d = new Date();
        var date = 0 +(d.getDate().toString());
        var month = 0 +((d.getMonth()+1).toString());
        var year = (d.getYear()+1900).toString();
        var today = `${date} - ${month} - ${year}`; 
        
        return today;
}   

    if(place == "" && time == "00" && date == myFunction()){

        scrapeUrl = `https://www.cph.dk/en/flight-information/${depArr}`

    } else {

    var scrapeUrl = `https://www.cph.dk/en/flight-information/${depArr}?q=${place}&date=${date}&time=${time}`

    }

    console.log(scrapeUrl);

    var flights = [];

request(scrapeUrl, function(err, response, html){
        response.statusCode
        if(!err){
            var $ = cheerio.load(html);
        
            allRows = $('.flights__table').children()

            //loops through all the children and creates new Flight object and pushes each onto array 'flights'
            allRows.each(function() { 
                
                    //On the CPH airport website: when 'expected' has value 'time' has extra span tag child, with new expected flight time. The if statement below finds how many children time val has and finds correct tags accordingly.
            
                    var timeVal = $(this).find('.flights__table__col--time div');
                    var statusVal = $(this).find('.stylish-table__cell:nth-of-type(7) div span').html();//status

                    if($((timeVal).find('span')).length > 1) {
                        timeVal = '<s>' + $(this).find('span:nth-child(1)').html() + '</s>';
                        expectedVal = $(this).find('span:nth-child(2) em').html();
                    } else {
                        expectedVal = "";
                        timeVal = $(this).find('em').html();
                    };

                    var airlineVal = $(this).find('.v--desktop-only').next().find('div span span').html();//airline
                    var destVal = $(this).find('.flights__table__col--destination div span strong span').html();//destination
                    var flightNumVal = $(this).find('.flights__table__col--destination div span:nth-child(3) small').html();//flightNum
                    var gateVal = $(this).find('.flights__table__col--gate div span').html();//gate


                    var newFlight = new Flight(timeVal, expectedVal, airlineVal, destVal, flightNumVal, gateVal, statusVal);

                    //filter out any header rows(ie non flight info);
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

