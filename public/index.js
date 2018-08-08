$(document).ready(function(){   

//_____________Search Area interface________________//

//Enables date picker function, from datepicker.js
$('.datepicker').datepicker()

//Change destination selection box html depending on button toggle (Destination/Arrival)
$('.btn-group-toggle').on('click', (e) =>{
    var a = e.target.innerHTML;
    $('select.place option:nth-child(1)').html(`All ${a}`);
})



//#submit button is clicked (clears flight info on index.html, gathers parameters from input/selections, assigns to 'data' object, triggers $get() request, generates HTML with response)
    $('#submit').on('click', (e) =>{


        //________Remove any flight content that is displayed
            $('#flight-body tbody').remove();
            const flightTable = document.getElementsByClassName('flight-table');
        
        //________Gathers properties from index.html form

            var place = $('.place').find("option:selected").text();
            var date = $('#date').val()
            var time = $('.time').find("option:selected").text().substring(0, 2);
        
            //depARR
            if($('.departures').prop('checked')){
                var depArr = 'departures';
            } else {
                var depArr = 'arrivals';
            };  

            if(place === 'All Departures' || place === 'All Arivals'){
                place = "";
            };

            //time
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

            console.log(data);

        //get request 
        $.get('/search', data, function(response){

        var arr = response;

        console.log(arr)

        if(arr.length === 0){
            time = $('.time').find("option:selected").text()
            if($('.departures').prop('checked')){
            $('.reponse-empty h1').html(`Unfortunately there are no flights to ${place} on this date after ${time}`);
        } else if ($('.arrivals').prop('checked')){
            $('.reponse-empty').html(`Unfortunately there are no flights arriving from ${place} on this date after ${time}`);
        }
        }

        const tBody = document.createElement('tbody');
        $(flightTable).append(tBody);

        for(i=0; i < arr.length; i++){
            const tableRow = document.createElement('tr');
            $(tBody).append(tableRow);

            //create array of JSON values//loop through//populating new td's with object contents
            var obVals = Object.values(arr[i]);
                
            for(var j = 0; j < obVals.length; j++){
                
                td = document.createElement('td');
                td.innerHTML = obVals[j];
                $(tableRow).append(td).delay(1000);
            
            }
        }
        });
    });
});
