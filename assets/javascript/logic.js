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
        name = displayName;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        if (!displayName) {
            user.updateProfile({
                    displayName: userName,
                }).then(function () {
                    var displayName = user.displayName;
                    console.log(displayName);
                    fireAccounts.once("value", function (snap) {
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
                        }
                }),
                function (error) {
                    console.log("Errors handled with profile update: " + errorObject.code);
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

    } else {
        if(newConnection){
            newConnection.remove();
        }
        console.log('Not Logged In!');
        $('#login1').removeAttr('hidden');
        $('#login2').attr('hidden', true);
        $('#loginMsg').text('Enter your name to get started!');
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
    
};

function logout() {
    firebase.auth().signOut().then(function () {
        
    }).catch(function (error) {
        // An error happened.
    });
}


//CLick the Login Button to Log In!
$("#loginButton").on("click", function (e) { //this ID will be used in the login screen at the start of the game
    e.preventDefault();
    login();
});
//To Log out of the database or log in as another player
$("#logoutButton").on("click keypress", function (e) {
    e.preventDefault();
    logout();
})

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

//Adding Winners to Top Ten
function endGame() {
    //To be continued...
}

//Jacob's AJAX Calls
var APIKey = "166a433c57516f51dfab1f7edaed8413";
var cityArray = ["Houston,Texas", "Dallas,Texas", "Buffalo,New York", "Seattle,Washington", "Miami,Florida", "Philadelphia,Pennsylvania", "Boston,Massachusetts", "Atlanta,Georgia"];
var locationSelected; //this will need to be updated once we have locations to select from

for (var i = 0; i < cityArray.length; i++) {
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

//Jacob's card-title Click
$('.card-title').on("click", function () {
    console.log($(this).attr("data-city"));
});

// Jacob's Profile Page JS
var totalPower = 100;
$("#powerOneSlide").change(function () {
    var powerInput = $("#powerOneSlide").val();
    $("#displayPowerOne").html("Health: " + powerInput);
});

$("#powerTwoSlide").change(function () {
    var powerInput = $("#powerTwoSlide").val();
    $("#displayPowerTwo").html("Strength: " + powerInput);
});

$("#powerThreeSlide").change(function () {
    var powerInput = $("#powerThreeSlide").val();
    $("#displayPowerThree").html("Wits: " + powerInput);
});

$("#profileBtn").on("click", function () {
    var nickName = $("#nameField").val().trim();
    var prefCity = $("#prefTeam").val().trim();
    var strengthInput = $("#powerOneSlide").val();
    var witInput = $("#powerTwoSlide").val();
    console.log(`Nick Name: ${nickName}`);
    console.log(`Favorite Team: ${prefCity}`);
    console.log(`Strength: ${strengthInput}`);
    console.log(`Wit: ${witInput}`);
});