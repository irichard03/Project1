//Init Firebase
var config = {
    apiKey: "AIzaSyCzKFhnqEPr92D--fdoL7-hiYJvCB4tbDs",
    authDomain: "project-1-331d0.firebaseapp.com",
    databaseURL: "https://project-1-331d0.firebaseio.com",
    projectId: "project-1-331d0",
    storageBucket: "project-1-331d0.appspot.com",
    messagingSenderId: "283963407754"
};
firebase.initializeApp(config);
//firebase variables
var database = firebase.database();
var fireChat = database.ref("/chat");
var fireAccounts = database.ref("accounts/");
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
//local variables
var userName = "";
//init materialize
M.AutoInit();
//login info for firebase
$("#loginButton").on("click keypress", function (e) { //this ID will be used in the login screen at the start of the game
    e.preventDefault();
    userName = $("#userID").val().trim();
    console.log(userName);
    if (userName.length > 0) { //firebase still being called when string is empty
        fireAccounts.once("value", function (snap) {
            if (!snap.child(userName).exists()) { //this way of identifying if the username is already in  use doesnt work
                database.ref("accounts/").push({
                    name: userName,
                    level: 1,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                });
            }
        }, function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
        $("#userID").val("");
    } else {
        $("#loginMsg").html("<i class=\"red-text errorAlert text-darken-2 loginAlert material-icons\">" + "error" +"</i>You've left it blank.");
    }
});

$("#chat-submit").on("click keypress", function (e) {
    e.preventDefault();
    var chatMessage = userName + ": " + $("#chat-input").val().trim();
    if (chatMessage.length > 0) {
        var chatKey = d.ref("/chat").push().key;
        d.ref("chat/" + chatKey).set(chatMessage);
    }
    $("#chat-input").val("");
});
fireChat.on("child_added", function (snap) {
    $("#chatLog").append("<div>" + snap.val() + "</div>").scrollTop($("#chatLog")[0].scrollHeight);
});

//Jacob's AJAX Calls
var APIKey = "166a433c57516f51dfab1f7edaed8413";
var cityArray = ["Houston,Texas", "Dallas,Texas", "Buffalo,New York","Seattle,Washington","Miami,Florida","Philadelphia,Pennsylvania","Boston,Massachusetts","Atlanta,Georgia"];
var locationSelected;  //this will need to be updated once we have locations to select from

for (var i = 0; i < cityArray.length; i++) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + cityArray[i] + " &units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var cityTemp = "temp"+response.name;
            var cityHumidity = "humidity"+response.name;

            $(`#${cityTemp}`).html("Temp: "+response.main.temp + "F");
            $(`#${cityHumidity}`).html("Humidity: "+ response.main.humidity +"%");
        });
}

//Jacob's card-title Click
$('.card-title').on("click",function() { 
    console.log($(this).attr("data-city"));
});

// Jacob's Profile Page JS
var totalPower = 100;
$("#powerOneSlide").change(function(){
    var powerInput = $("#powerOneSlide").val();
    $("#displayPowerOne").html("Health: "+powerInput);
});

$("#powerTwoSlide").change(function(){
    var powerInput = $("#powerTwoSlide").val();
    $("#displayPowerTwo").html("Strength: "+powerInput);
});

$("#powerThreeSlide").change(function(){
    var powerInput = $("#powerThreeSlide").val();
    $("#displayPowerThree").html("Wits: "+powerInput);
});

$("#profileBtn").on("click", function(){
    var nickName = $("#nameField").val().trim();
    var prefCity = $("#prefTeam").val().trim();
    var strengthInput = $("#powerOneSlide").val();
    var witInput = $("#powerTwoSlide").val();
    console.log(`Nick Name: ${nickName}`);
    console.log(`Favorite Team: ${prefCity}`);
    console.log(`Strength: ${strengthInput}`);
    console.log(`Wit: ${witInput}`);
});

    