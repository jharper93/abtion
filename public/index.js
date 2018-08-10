$(document).ready(function(){   

$('#welcome-text').animate({opacity: 1}, 1600);    
//_____________Search Area interface________________//

//Enables date picker function, from datepicker.js
    $('.datepicker').datepicker()


//#submit button is clicked (removes previous search results, gathers parameters from input/selections, assigns to 'data' object, triggers $get() request, generates HTML with response(adding necessary classes));
$('#submit').on('click', function(e) {


    //________Remove any previous search results

        $('.response-empty h1').html('');
        $('.flight-table').hide();
        $('.flight-table tbody').remove();
        const flightTable = document.getElementsByClassName('flight-table');
    
    //________Gathers properties from index.html form

        //If options have been selected
            var place = $('.place').find("option:selected").text();
            var date = $('#date').val()
            var time = $('.time').find("option:selected").text().substring(0, 2);
    
        //DEPARTURE or ARRIVAL? - depARR
            if($('.departures').prop('checked')){
                var depArr = 'departures';
            } else {
                var depArr = 'arrivals';
            };

        //if nothing has been selected,
            
            //PLACE 
                if(place == "All Destinations") {
                    place = "";
                };

            //DATE
                if(date === ""){

                    function myFunction() {

                        var d = new Date();
                        var date = 0 +(d.getDate().toString());
                        var month = 0 +((d.getMonth()+1).toString());
                        var year = (d.getYear()+1900).toString();
                        var today = `${date} - ${month} - ${year}`; 
                        
                        date = today;
                    }

                }

            //TIME - (first two characters of time )
                if(time === 'Al'){
                    var time = '00'
                } 
    

    //_________Creates object of index.html form inputs

        var data = {
            
            "depArr" : depArr,
            "place" : place,
            "date" : date,
            "time" : time

        }

    //_________Get request 
    
        $.get('/search', data, function(response){

        //________If response array is empty
            if(response.length == 0){
                $('.flight-table').css('display: none;');
                $('.response-empty').show();
                 
                    var dirDestSuf;
                    var dateSuf = "today";
                    var timeSuf = "";

                        if(depArr == "departures"){
                            dirDestSuf = "departing"
                            if(!place == ""){
                                dirDestSuf = `to ${place} ${dirDestSuf}`
                            }
                        } else {
                            dirDestSuf = "arriving"
                            if(!place == ""){
                                dirDestSuf = `${dirDestSuf} from ${place}`
                            }
                        };
                    
                        if(!date == ""){
                            dateSuf = `on ${date}`;
                        }

                        if(!time == "00"){
                            timeSuf = `after ${time}:00`
                        }

                    const textDisplay = $('.response-empty h1');
                    var responseEmptyString = `Unfortunately there are no flights ${dirDestSuf} ${timeSuf} ${dateSuf}.`;
                    textDisplay.html(responseEmptyString);
                
            } else {

                $('.flight-table').show();
          

    //_______Generate HTML from response
                const tBody = document.createElement('tbody');
                $(flightTable).append(tBody);

                for(i=0; i < response.length; i++){
                    const tableRow = document.createElement('tr');
                    $(tBody).append(tableRow);

                    var obVals = Object.values(response[i]);
                        
                    for(var j = 0; j < obVals.length; j++){
                        td = document.createElement('td');
                        $(td).html(obVals[j]);

                        if(j===1 || j===3 || j===4){
                            $(td).addClass('mobile-hide')
                        } else if((td.innerHTML == "Boarding") || (td.innerHTML == "Closing")){
                            $(tableRow).addClass('amber')
                        } else if((td.innerHTML == "Cancelled") || (td.innerHTML == "Final Call") || (td.innerHTML == "Closed")){
                            $(tableRow).addClass('red')
                        } else if((td.innerHTML == "To gate") || (td.innerHTML == "Baggage") || (td.innerHTML == "Landed")){
                            $(tableRow).addClass('green')
                        }
                        $(tableRow).append(td);

                        //for mobile/dekstop hide/show
                        if(j===1 && td.innerHTML !== ""){
                            tdText = td.innerHTML;
                            $(td).prev().append(`<p><b>${tdText}</b></p>`);
                        } else if(j===3){
                            tdText = td.innerHTML;
                            $(td).prev().append(`<caption class="small">${tdText}</caption>`);
                        }else if(j===4){
                            tdText = td.innerHTML;
                            $(td).prev().prev().append(`<caption class="small">${tdText}</caption>`);
                        }


                    }//for loop j
                }//for loop i
        }//empty string if/else
    });//$.get()
});//submit
});//$doc ready
