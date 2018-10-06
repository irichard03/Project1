
//On ready function, do stuff when page loads.
$(document).ready(function(){



});    


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