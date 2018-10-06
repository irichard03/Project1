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
var displayName;
var isAnonymous;
var uid;
//init materialize
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('signed in!');
        displayName = user.displayName;
        console.log(user.displayName);
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        $('#nameLabel').text(`Nickname:  ${displayName}`);
        $("#profileNavBtn").removeClass("disabled");
        var newConnection = database.ref("connections/").push(user.displayName);
        newConnection.onDisconnect().remove();
    }else{
        M.toast({html: 'Please go to the previous page and login!'});
    }

});
// Setting User's Attributes

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
$("#profileBtn").on("click", function () {
    var team = $('#prefTeam :selected').text();
    console.log(`Favorite Team: ${team}`);
    console.log(`Health: ${healthStat}`);
    console.log(`Strength: ${strengthStat}`);
    console.log(`Wit: ${witStat}`);
    if(team === 'Choose your Team' || totalPower > 0) {
        if(team === 'Choose your Team') {
            M.toast({html: "Please choose a team!"});
        }
        if(totalPower > 0) {
            M.toast({html: "Make sure to use all of your power!"});
        }
    }else{
        database.ref(`accounts/${displayName}`).update({
            health: healthStat,
            strength: strengthStat,
            wits: witStat,
            prefCity: team,
        });
        
    }
});
