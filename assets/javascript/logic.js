/*jshint esversion: 6 */
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
var topTen = database.ref("/topten");
//local variables
var userName = "";
var name;
//init materialize
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        if (!displayName) {
            user.updateProfile({
                    displayName: userName,
                }).then(function () {
                    var displayName = user.displayName;
                    fireAccounts.once("value")
                    .then(function (snap) {
                            if (!snap.child(user.displayName).exists()) { //this way of identifying if the username is already in  use doesnt work
                                database.ref(`accounts/${user.displayName}`).set({
                                    wins: '',
                                    losses: '',
                                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                                });
                            } else {
                                console.log("That user is already here, so I won't add it");
                            }
                        }),
                        function (errorObject) {
                            console.log("Errors handled: " + errorObject.code);
                        };
                }),
                function (error) {
                    console.log("Errors handled with profile update: " + error.code);
                };
        }
        // Here we can just see what username is connected
        var newConnection = database.ref("connections/").push(user.displayName);
        newConnection.onDisconnect().remove();
        console.log("logged in!");
        //Toggle which button is displayed if you are logged in or not
        $('#login1').attr('hidden', true);
        $('#login2').removeAttr('hidden');
        $('#loginMsg').text('Logout to play as another user or to disconnect!');
        $("#profileNavBtn").removeClass("disabled");
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        // ...
    } else {
        if(newConnection){
            newConnection.remove();
        }
        console.log('Not Logged In!');
        $('#login1').removeAttr('hidden');
        $('#login2').attr('hidden', true);
        $('#loginMsg').text('Enter your name to get started!');
        $("#profileNavBtn").addClass("disabled");

    }
});
//Anonymous authentication
function login() {
    userName = $("#userID").val().trim();
    if (userName.length > 0) {
        firebase.auth().signInAnonymously().catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            
        });
        
    } else {
        $("#loginMsg").html("<i class=\"red-text errorAlert text-darken-2 loginAlert material-icons\">" + "error" + "</i>You've left it blank.");
    }
}

function logout() {
    firebase.auth().signOut().then(function () {
        
    }).catch(function (error) {
        // An error happened.
    });
}



//CLick the Login Button to Log In!
$("#loginButton").on("click", function (e) { //this ID will be used in the login screen at the start of the game
    e.preventDefault();
    loginSound.play();
    login();
});
//To Log out of the database or log in as another player
$("#logoutButton").on("click keypress", function (e) {
    e.preventDefault();
    logout();
});
//chat functions
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
var cityArray = ["Houston,Texas", "Dallas,Texas", "Buffalo,New York", "Seattle,Washington", "Miami,Florida", "Philadelphia,Pennsylvania", "Boston,Massachusetts", "Atlanta,Georgia"];
var cityNames = ["Houston", "Dallas", "Buffalo", "Seattle", "Miami", "Philadelphia", "Boston", "Atlanta"];
var nameArray = [];
var locationSelected; //this will need to be updated once we have locations to select from
var i = 0;
var opponentChoosen;
var opponentCity;
var opponentImage;

// API to find weather for each city and update html
for (i = 0; i < cityArray.length; i++) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + cityArray[i] + " &units=imperial&appid=" + APIKey;
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            var cityTemp = "temp" + response.name;
            var cityHumidity = "humidity" + response.name;

            $(`#${cityTemp}`).html("Temp: " + response.main.temp + "F");
            $(`#${cityHumidity}`).html("Humidity: " + response.main.humidity + "%");
        });
}

// API to randomly generate names for each city
for (i = 0; i < cityArray.length; i++) {
    var queryURL = "https://randomuser.me/api/";

    $.ajax({
            url: queryURL,
            dataType: 'json',
        })
        .then(function (data) {
            var randomName = data.results[0].name.first;
            randomName.toString();
            nameArray.push(randomName.substr(0, 1).toUpperCase() + randomName.substr(1));
        }).then(function(){
            giveNames();
        });
}

// Updates cards to show Name from API & sets oppponent attribute for card
function giveNames() {
    for (i = 0; i < nameArray.length; i++) {
        var nameHolder = "name" + cityNames[i];
        $(`#${nameHolder}`).html("Opponent: " + nameArray[i]);
        $(`#${nameHolder}`).parent().attr("data-opponent", nameArray[i]);
    }
}
//Audio
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
var loginSound = new sound ("./assets/audio/login.wav");
var happySound = new sound ("./assets/audio/happysound.wav");
var happySound2 = new sound ("./assets/audio/happysound2.wav");

//Jacob's card-title Click grabs City and Name
$('.card-title').on("click", function () {
    console.log($(this).attr("data-city"));
    console.log($(this).attr("data-opponent"));
    console.log($(this).attr("data-image"));
    happySound.play();
    var opponentChoosen = $(this).attr("data-opponent");
    var opponentCity = $(this).attr("data-city");
    var opponentImage = $(this).attr("data-image");

    localStorage.setItem("opponent", opponentChoosen);
    localStorage.setItem("city", opponentCity);
    localStorage.setItem("image", opponentImage);

    location.replace("fight.html");
});
