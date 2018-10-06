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
                    } else {
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
        });
    // Needs timeout before displays names so API can complete
    if (i === (cityArray.length - 1)) {
        setTimeout(giveNames, 1500);
    }
}

// Updates cards to show Name from API & sets oppponent attribute for card
function giveNames() {
    for (i = 0; i < cityNames.length; i++) {
        var nameHolder = "name" + cityNames[i];
        $(`#${nameHolder}`).html("Opponent: " + nameArray[i]);
        $(`#${nameHolder}`).parent().attr("data-opponent", nameArray[i]);
    }
}


//Jacob's card-title Click grabs City and Name
$('.card-title').on("click", function () {
    console.log($(this).attr("data-city"));
    console.log($(this).attr("data-opponent"));
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
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
});

$("#plusBtnHealth").on("click", function () {
    if (totalPower <= 30 && totalPower > 0) {
        healthStat++;
        totalPower--;
        $("#displayPowerOne").html(`Health: ${healthStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
});
$("#minusBtnStrength").on("click", function () {
    if (totalPower < 30 && totalPower >= 0) {
        strengthStat--;
        totalPower++;
        $("#displayPowerTwo").html(`Strength: ${strengthStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
});

$("#plusBtnStrength").on("click", function () {
    if (totalPower <= 30 && totalPower > 0) {
        strengthStat++;
        totalPower--;
        $("#displayPowerTwo").html(`Strength: ${strengthStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
});
$("#minusBtnWits").on("click", function () {
    if (totalPower < 30 && totalPower >= 0) {
        witStat--;
        totalPower++;
        $("#displayPowerThree").html(`Wits: ${witStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
});

$("#plusBtnWits").on("click", function () {
    if (totalPower <= 30 && totalPower > 0) {
        witStat++;
        totalPower--;
        $("#displayPowerThree").html(`Wits: ${witStat}`);
        $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    }
});

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
    var user = firebase.auth().currentUser;
    if (user) {
        database.ref(`accounts/${user.displayName}`).set({
            health: healthStat,
            strength: strengthStat,
            wits: witStat
        });
    } else {
        console.log("You are not Logged In!");
    }

});
//trying to DRY jacobs stuff result unsuccessful
$("").on("click", function () { // this doesnt do anything 
    var direction = $(this).attr("id");
    var stat = $(this).attr("data-stat");
    var display = $(this).attr("data-display");
    var name = $(this).attr("data-name");
    console.log("direction: " + direction);
    console.log("stat: " + stat);
    console.log("display: " + display);
    powerDisplay(stat, display, direction, name);
});

function powerDisplay(stat, display, direction, name) {
    if (totalPower <= 30 && totalPower > 0 && direction.indexOf("plus") !== -1) {
        stat++;
        totalPower--;
    } else if (totalPower < 30 && totalPower >= 0 && direction.indexOf("minus") !== -1) {
        stat--;
        totalPower++;
    }
    $(display).html(name + ":" + stat);
    $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
    console.log(stat);
}


//Combat Functions
var baseAcc = 0.9; // 3.677 - (23/(10+wits)^.7)
var baseDodge = 0.1;
var userDodge = 0; // 1 - (attackerAccuracy/(attackerAccuracy + (defenderWits/100)^0.985))
var userHealth = 10; //10 * vitality;

var abilities = {
    "kick": {
        damage: baseKick * userStr + Math.round(Math.random() * (userStr * baseKick) / 5),
        accuracy: userAcc - 0.35
    },
    "punch": {
        damage: basePunch * userStr + Math.round(Math.random() * (userStr * basePunch) / 10),
        accuracy: userAcc
    },
    "throw": {
        damage: baseThrow * userStr + Math.round(Math.random() * (userStr * baseThrow) / 15),
        accuracy: userAcc + 0.35

    }
};
//battle commands

var battle = {
    attack: function (attackType) {
        var roll = Math.random();
        if (roll > battle.evadeCheck(wits)) {
            enemyHP = enemyHP - abilities.attackType.damage;
            $("").html(`You attacked ${enemyName} for ${abilities.attackType.damage} damage!`); //enemyname is placeholder
        } else {
            //you missed
        }
    },
    evadeCheck: function (wits, attackType) {
        return 1 - (abilities.attackType.accuracy / (abilities.attackType.accuracy + (wits / 100) ^ 0.985));
    },
};
$(document).on("click", ".combatBtns", function () {

})

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

var userStr;
var enemyStr;
var userWits;
var enemyWits;
var enemyAcc;
var userAcc = 3.677 - (23 / Math.pow((10 + enemyWits), 0.7));

$(document).ready(function () {
    kickTwenty = baseKick * 20 + Math.round(Math.random() * (20 * baseKick) / 5);
    console.log("Testing Math:" + kickTwenty);
});