//var to hold damage placeholder for testing, actual damage should be passed
//in as an argument to the attack functions below.
var damagePlaceHolder = 80;
var giphApiKey = "Y3h4ksc22JmMFoYTKH2XUYmRwrnYL8Gd";
var computerHealth = 200;
var playerHealth = 100;


//On ready function, do stuff when page loads.
$(document).ready(function(){

//Giphy call pass in string to change search parameter for gif results.
    function callAPI(buttonClicked){
        $('.displayBox').css('visibility', 'visible');
        let x = getRandomInt(10);
        giphyUrl = "https://api.giphy.com/v1/gifs/search?q=" + buttonClicked + "&key=" + giphApiKey;
        $.ajax({
            url: giphyUrl,
            method: "GET"
        }).then(function(response) {
            if(response){
                console.log("api call succeesfull");
                console.log(response);
            
                //if player wins    
                if(buttonClicked === 1){
                    //need to increment players win count.
                    $('.displayBox').append(`<img src="${response.data[x].images.original.url}" width="360px" height="360px">`);
                    setTimeout(function(){
                        $('.displayBox').empty();
                        $('.displayBox').css('visibility', 'hidden');
                    },20000);
                }else{

                    $('.displayBox').append(`<img src="${response.data[x].images.original.url}" width="360px" height="360px">`);
                    setTimeout(function(){
                        $('.displayBox').empty();
                        $('.displayBox').css('visibility', 'hidden');
                    },3000);
                }
            }
            else{
                console.log("FAILED API CALL");
            }
        });
    }




//random function for giphs.
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


//TODObutton Functions to modify player bars
    $('.playerPunch').click(function(){
        callAPI("punch");
        computerHealth = computerHealth - damagePlaceHolder;
        console.log(computerHealth);
        if(computerHealth < 0){
            computerHealth = 0;
            $('#cpuHealth').css('width', '0px');
            callAPI(1);
        }else{
            let cpuHealthString = computerHealth.toString();
            cpuHealthString += 'px'
            console.log(cpuHealthString);
            $('#cpuHealth').css('width', cpuHealthString);
        }
        
    });





    //TODObutton Functions to modify cpu bars

    //ToDo Function for player winning, should increment wins and display gif.
    

    //Button Functions to move player and cpu back/forward by switching float values.
    $('.playerForward').click(function(){
        $('.playerFighter').css("float", "right");
    });

    $('.playerBackward').click(function(){
        $('.playerFighter').css("float", "left");
    });

    $('.cpuForward').click(function(){
        $('.cpuFighter').css("float", "right");
    });

    $('.cpuBackward').click(function(){git
        $('.cpuFighter').css("float", "left");
    });

    //end of document on ready
});    