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
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

        var isAnonymous = user.isAnonymous;
        var uid = user.uid;

        // ...
    } else {
        // User is signed out.
        // ...
    }
});
//Anonymous authentication
function login() {
    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

    });

    //
    var user = firebase.auth().currentUser;
    if (user) {
        userName = $("#userID").val().trim();
        user.updateProfile({
            displayName: userName,
        }).then(function () {
            var displayName = user.displayName;
            console.log(displayName);
            if (user.displayName.length > 0) { //firebase still being called when string is empty
                fireAccounts.once("value", function (snap) {
                    if (!snap.child(user.displayName).exists()) { //this way of identifying if the username is already in  use doesnt work
                        database.ref(`accounts/${user.displayName}`).set({
                            wins: '',
                            losses: '',
                            dateAdded: firebase.database.ServerValue.TIMESTAMP
                        });

                    }
                    else {
                        console.log("That user is already here, so I won't add it");

                    }
                    // Here we can just see what username is connected
                    var newConnection = database.ref("connections/").push(user.displayName);
                    newConnection.onDisconnect().remove();

                }, function (errorObject) {
                    console.log("Errors handled: " + errorObject.code);
                });
                $("#userID").val("");
            } else {
                $("#loginMsg").html("<i class=\"red-text errorAlert text-darken-2 loginAlert material-icons\">" + "error" + "</i>You've left it blank.");
            }
        }, function (error) {
            console.log("Errors handled with profile update: " + errorObject.code);
        });
    }

}


//login info for firebase
$("#loginButton").on("click keypress", function (e) { //this ID will be used in the login screen at the start of the game
    e.preventDefault();
    login();
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
            $(`#${cityHumidity}`).html("Humidity: " + response.main.humidity + "%")
        });
}

//Jacob's card-title Click
$('.card-title').on("click", function () {
    console.log($(this).attr("data-city"));
});

// Jacob's Profile Page JS
var totalPower = 30;
var healthStat = 0;
var witStat = 0;
var strengthStat = 0;

$("#minusBtnHealth").on("click", function () {
    if (totalPower < 30 && totalPower >= 0) {
        healthStat--;
        totalPower++;
        $("#displayPowerOne").html(`Health: ${healthStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`)
    }
})

$("#plusBtnHealth").on("click", function () {
    if (totalPower <= 30 && totalPower > 0) {
        healthStat++;
        totalPower--;
        $("#displayPowerOne").html(`Health: ${healthStat}`)
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
})
$("#minusBtnStrength").on("click", function () {
    if (totalPower < 30 && totalPower >= 0) {
        strengthStat--;
        totalPower++;
        $("#displayPowerTwo").html(`Strength: ${strengthStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`)
    }
})

$("#plusBtnStrength").on("click", function () {
    if (totalPower <= 30 && totalPower > 0) {
        strengthStat++;
        totalPower--;
        $("#displayPowerTwo").html(`Strength: ${strengthStat}`)
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
})
$("#minusBtnWits").on("click", function () {
    if (totalPower < 30 && totalPower >= 0) {
        witStat--;
        totalPower++;
        $("#displayPowerThree").html(`Wits: ${witStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`)
    }
})

$("#plusBtnWits").on("click", function () {
    if (totalPower <= 30 && totalPower > 0) {
        witStat++;
        totalPower--;
        $("#displayPowerThree").html(`Wits: ${witStat}`)
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
})

$("#profileBtn").on("click", function () {
    var nickName = $("#nameField").val().trim();
    var prefCity = $("#prefTeam").val().trim();
    var strengthInput = $("#powerOneSlide").val();
    var witInput = $("#powerTwoSlide").val();
    console.log(`Nick Name: ${nickName}`);
    console.log(`Favorite Team: ${prefCity}`);
    console.log(`Health: ${healthStat}`);
    console.log(`Strength: ${strengthStat}`);
    console.log(`Wit: ${witStat}`);
})

//Combat Functions
var baseAcc = 0.9; // 3.677 - (23/(10+wits)^.7)
var baseDodge = 0.1;
var userDodge = 0; // 1 - (attackerAccuracy/(attackerAccuracy + (defenderWits/100)^0.985))
var userHealth = 10; //10 * vitality;
var Attacks = {
    "kick": {
        damage: 0,
        accuracy: 0
    },
    "punch": {
        damage: 0,
        accuracy: 0
    },
    "throw": {
        damage: 0,
        accuracy: 0
    }
};
//ignore, math testing
var test = 0;
var baseKick = 2;
var kickAccPenalty = 0.2;
var basePunch = 1;
var baseThrow = 0.6;
var throwAccBonus = 0.2;
var baseLevelFactor = 1; //increase by 0.1 per lvl
var tenStr = 10;
var fifteenStr = 15;
var twentyStr = 20;

var kickTen;
var kickTwenty;
var kickFifteen;
var punchTen;
var punchFifteen;
var punchTwenty;
var throwTen;
var throwFifteen;
var throwTwenty;

$(document).ready(function () {
 test = Math.round(Math.random()* baseKick/2);
 kickTen = baseKick * tenStr + test;
 kickTwenty = baseKick * 20 + Math.round(Math.random()* (20*baseKick)/5);
 console.log(kickTwenty);
});
