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
// Setting User's Attributes
var totalPower = 50;
var healthStat = 0;
var witStat = 0;
var strengthStat = 0;
var team;
//init materialize
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('signed in!');
        displayName = user.displayName;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        $('#nameLabel').text(`Nickname:  ${displayName}`);
        $("#profileNavBtn").removeClass("disabled");
        var newConnection = database.ref("connections/").push(user.displayName);
        newConnection.onDisconnect().remove();
        fireAccounts.once("value")
        .then(function (snap) {
            if(snap.child(`${displayName}`).child('health').exists()) {
                healthStat = snap.child(`${displayName}`).child('health').val();
                witStat = snap.child(`${displayName}`).child('wits').val();
                strengthStat = snap.child(`${displayName}`).child('strength').val();
                team = snap.child(`${displayName}`).child('prefCity').val();
                totalPower = 0;
                $(`#prefTeam option[value=${team}`).prop('selected',true);
                $("#pointsAvailable").html(`Points Avaialble: ${totalPower}`);
                $("#displayPowerOne").html(`Health: ${healthStat}`);
                $("#displayPowerTwo").html(`Strength: ${strengthStat}`);
                $("#displayPowerThree").html(`Wits: ${witStat}`);
            }
        }),
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        };

    }else{
        var toastNoAuth = '<span>Please go to the login page and login!</span>';
        M.toast({html: toastNoAuth});
    }

});

$("#minusBtnHealth").on("click", function () {
    if (totalPower < 50 && totalPower >= 0 && ((healthStat - 1) > 0)) {
        healthStat--;
        totalPower++;
        $("#displayPowerOne").html(`Health: ${healthStat}`);
        $("#pointsAvailable").html(`Points Available: ${totalPower}`);
    }
});

$("#plusBtnHealth").on("click", function () {
    if (totalPower <= 50 && totalPower > 0) {
        healthStat++;
        totalPower--;
        $("#displayPowerOne").html(`Health: ${healthStat}`);
        $("#pointsAvailable").html(`Points Available: ${totalPower}`);
    }
});
$("#minusBtnStrength").on("click", function () {
    if (totalPower < 50 && totalPower >= 0 && ((strengthStat - 1) > 0)) {
        strengthStat--;
        totalPower++;
        $("#displayPowerTwo").html(`Strength: ${strengthStat}`);
        $("#pointsAvailable").html(`Points Available: ${totalPower}`);
    }
});

$("#plusBtnStrength").on("click", function () {
    if (totalPower <= 50 && totalPower > 0) {
        strengthStat++;
        totalPower--;
        $("#displayPowerTwo").html(`Strength: ${strengthStat}`);
        $("#pointsAvailable").html(`Points Available: ${totalPower}`);
    }
});
$("#minusBtnWits").on("click", function () {
    if (totalPower < 50 && totalPower >= 0 && ((hwitStat - 1) > 0)) {
        witStat--;
        totalPower++;
        $("#displayPowerThree").html(`Wits: ${witStat}`);
        $("#pointsAvailable").html(`Points Available: ${totalPower}`);
    }
});

$("#plusBtnWits").on("click", function () {
    if (totalPower <= 50 && totalPower > 0) {
        witStat++;
        totalPower--;
        $("#displayPowerThree").html(`Wits: ${witStat}`);
        $("#pointsAvailable").html(`Points Available: ${totalPower}`);
    }
});

var toastNoTeam = '<span>Please choose a team!</span>';
var toastNoPower = '<span>Make sure to use all of your power!</span>';

$("#profileBtn").on("click", function () {
    team = $('#prefTeam :selected').text();
    if(team === 'Choose your Team' || totalPower > 0) {
        if(team === 'Choose your Team') {
            M.toast({html: toastNoTeam});
        }
        if(totalPower > 0) {
            M.toast({html: toastNoPower});
        }
    }else{
        database.ref(`accounts/${displayName}`).update({
            health: healthStat,
            strength: strengthStat,
            wits: witStat,
            prefCity: team,
        });
        location.replace("opponent.html");
    }
});


