//Declare a variable to store the searched city
var city="";
// variable declaration
var searchCity = $("#search-city");
var searchBtn = $("#search-button");
var clearBtn = $("#clear-history");
var currentCity = $("#current-city");
var currentTemp = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];
// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey="13e95711b596fa30042cb18b5fbd698f";
// Display the curent and future weather to the user after reading the city form the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
// AJAX call
function currentWeather(city){
    // URL so we can get a data from server side.
    var callURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:callURL,
        method:"GET",
    }).then(function(response){

        // parse the response to display the current weather, name, date of city.
        console.log(response);
        //Server side A for icon property.
        var weathericon= response.weather[0].icon;
        var iconURL="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        // The date format method is taken from the  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        var date=new Date(response.dt*1000).toLocaleDateString();
        //parse the response for name of city and concanatig the date and icon.
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconURL+">");
        // parse the response to display the current temperature.
        
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemp).html((tempF).toFixed(2)+"&#8457");
        // Display the Humidity
        $(currentHumidty).html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        var windSpeed=response.wind.speed;
        var windMPH=(windSpeed*2.237).toFixed(1);
        $(currentWSpeed).html(windMPH+"MPH");
        // Display UV Index.
        //Using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityName"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityName",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityName",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
    // This function returns the UVIindex response.
function UVIndex(ln,lt){
    //lets build the url for uvindex.
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
    
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    var dayover= false;
    var callForecastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:callForecastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconCode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconURL="https://openweathermap.org/img/wn/"+iconCode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconURL+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}

//Daynamically add the passed city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityName"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityName"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityName");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);





















