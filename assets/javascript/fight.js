//var to hold damage placeholder for testing, actual damage should be passed
//in as an argument to the attack functions below.
var damagePlaceHolder = 20;

//On ready function, do stuff when page loads.
$(document).ready(function(){



});    





//Button Functions to move player and cpu back/forward by switching float values.
// class playerForward, playerBackward
// class cpuForward, cpuBackward
//  Player                  CPU
// Back[] []Forward    Forward[]   []Back
$('.playerForward').click(function(){
    $('.playerFighter').css("float", "right");
});

$('.playerBackward').click(function(){
    $('.playerFighter').css("float", "left");
});

$('.cpuForward').click(function(){
    $('.cpuFighter').css("float", "right");
});

$('.cpuBackward').click(function(){
    $('.cpuFighter').css("float", "left");
});

