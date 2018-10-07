/*jshint esversion: 6 */
//var to hold damage placeholder for testing, actual damage should be passed
//in as an argument to the attack functions below.
//Init Firebase
var config = {
    apiKey: "AIzaSyCzKFhnqEPr92D--fdoL7-hiYJvCB4tbDs",
    authDomain: "project-1-331d0.firebaseapp.com",
    databaseURL: "https://project-1-331d0.firebaseio.com",
    projectId: "project-1-331d0",
    storageBucket: "project-1-331d0.appspot.com",
    messagingSenderId: "283963407754"
};
//firebase variables
firebase.initializeApp(config);
var database = firebase.database();
var fireChat = database.ref("/chat");
var fireAccounts = database.ref("accounts/");
var connectionsRef = database.ref("/connections");
var topTen = database.ref("/topten");
var displayName;
var isAnonymous;
var uid;
var baseKick = 5;
var basePunch = 3.5;
var baseThrow = 2.25;
var giphApiKey = "Y3h4ksc22JmMFoYTKH2XUYmRwrnYL8Gd";
var cityImage;
var cpuHealth = randomBetween(1, 50 - 3);
var cpuStrength = randomBetween(1, 50 - 2 - cpuHealth);
var cpuWits = 50 - cpuHealth - cpuStrength;
var cpuAcc = 3.677 - (23 / Math.pow((10 + cpuWits), 0.7));
var parameters = {
    "player": {
        // "stats": {},
        // "attacks": {}
    },
    "cpu": {
        "stats": {
            parsedHealth: cpuHealth * 10,
            strength: cpuStrength,
            wits: cpuWits,
            accuracy: cpuAcc,
            actionPoints: 999
        },
        "attacks": {
            "kick": {
                damage: baseKick * cpuStrength + Math.round(Math.random() * (cpuStrength * baseKick) / 5),
                accuracy: cpuAcc - 0.35
            },
            "punch": {
                damage: basePunch * cpuStrength + Math.round(Math.random() * (cpuStrength * baseKick) / 10),
                accuracy: cpuAcc
            },
            "throw": {
                damage: baseThrow * cpuStrength + Math.round(Math.random() * (cpuStrength * baseThrow) / 15),
                accuracy: cpuAcc + 0.35
            }
        }
    },
};

//random computerstats end
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('signed in!');
        displayName = user.displayName;
        console.log(user.displayName);
        fireAccounts.once("value", function (snap) {
                var tempStr = snap.child(`${displayName}`).child('strength').val();
                var tempAcc = 3.677 - 23 / Math.pow(10 + snap.child(`${displayName}`).child('wits').val(), 0.7);
                parameters.player.stats = {
                    health: snap.child(`${displayName}`).child('health').val(),
                    parsedHealth: snap.child(`${displayName}`).child('health').val() * 10,
                    strength: snap.child(`${displayName}`).child('strength').val(),
                    wits: snap.child(`${displayName}`).child('wits').val(),
                    accuracy: 3.677 - 23 / Math.pow(10 + snap.child(`${displayName}`).child('wits').val(), 0.7),
                    actionPoints: 999
                };
                parameters.player.attacks = {
                    "kick": {
                        damage: baseKick * tempStr + Math.round(Math.random() * (tempStr * baseKick) / 5),
                        accuracy: tempAcc - 0.35
                    },
                    "punch": {
                        damage: basePunch * tempStr + Math.round(Math.random() * (tempStr * basePunch) / 10),
                        accuracy: tempAcc
                    },
                    "throw": {
                        damage: baseThrow * tempStr + Math.round(Math.random() * (tempStr * baseThrow) / 15),
                        accuracy: tempAcc + 0.35
                    }
                };
            }).then(function () {
                // if (parameters.player.stats.actionPoints === 0) {
                //     parameters.cpu.stats.actionPoints = 4;
                // }
                // if (parameters.cpu.stats.actionPoints !== 0) {

                // }
            }),
            function (errorObject) {
                console.log("Errors handled: " + errorObject.code);
            };
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        $('#nickName').text(displayName);
    }
});

var battle = {
    attack: function (attacker, attack, defender, toast) {
        var roll = Math.random();
        if (parameters[attacker].stats.actionPoints >= 2) {
            if (roll > battle.evadeCheck(attacker, attack, defender)) {
                parameters[defender].stats.parsedHealth -= parameters[attacker].attacks[attack].damage;
                console.log(`You attacked the computer for ${parameters[attacker].attacks[attack].damage} damage!`); //enemyname is placeholder
                console.log("Your roll: " + roll);
                console.log("cpu evade chance: " + battle.evadeCheck(attacker, attack, defender));
                if (parameters[defender].stats.parsedHealth > 0) {
                    callAPI(attack);
                }
                M.toast({
                    html: `<span>${toast}</span>`,
                    classes: 'rounded'
                });
                if (parameters[defender].stats.parsedHealth < 0) {
                    parameters[defender].stats.parsedHealth = 0;
                    $('#cpuHealth').css('width', '0px');
                    callAPI(1);
                } else {
                    let cpuHealthString = parameters[defender].stats.parsedHealth.toString();
                    cpuHealthString += 'px';
                    console.log(cpuHealthString);
                    $('#cpuHealth').css('width', cpuHealthString);
                }
            } else {
                console.log(`You attacked the computer for ${parameters[attacker].attacks[attack].damage} damage!`); //enemyname is placeholder
                console.log("Your roll: " + roll);
                console.log("cpu evade chance: " + battle.evadeCheck(attacker, attack, defender));

                M.toast({
                    html: `<span>YOU MISSED!</span>`,
                    classes: "rounded"
                });
                console.log(battle.evadeCheck(attacker, attack, defender));
            }
            parameters[attacker].stats.actionPoints -= 2;
        }
    },
    drink: function (caster) {
        if (parameters[caster].stats.actionPoints >= 2) {
            if (parameters[caster].stats.parsedHealth > 0) {
                console.log("str before: " + parameters[caster].stats.strength);
                console.log("wits before: " + parameters[caster].stats.strength);
                parameters[caster].stats.strength = parameters[caster].stats.strength + (parameters[caster].stats.strength * 0.5);
                parameters[caster].stats.wits = parameters[caster].stats.wits - parameters[caster].stats.wits * 0.5;
                parameters[caster].stats.actionPoints -= 2;
                console.log("str after: " + parameters[caster].stats.strength);
                console.log("wits after: " + parameters[caster].stats.wits);
                M.toast({
                    html: `<span>GULP!</span>`,
                    classes: "rounded"
                });
            }
        }
    },
    moveLeft: function (caster) {
        if (caster === "player") {
            if (parameters[caster].stats.actionPoints >= 1) {
                $('.playerFighter').css("float", "left").attr("data-position", "left");
                parameters[caster].stats.actionPoints--;
            }
        } else if (caster === "cpu") {
            if (parameters[caster].stats.actionPoints >= 1) {
                $(".cpuFighter").css("float", "left").attr("data-position", "left");
                parameters[caster].stats.actionPoints--;
            }
        }
    },
    moveRight: function (caster) {
        if (caster === "player") {
            if (parameters[caster].stats.actionPoints >= 1) {
                $('.playerFighter').css("float", "right").attr("data-position", "right");
                parameters[caster].stats.actionPoints--;
            }
        } else if (caster === "cpu") {
            if (parameters[caster].stats.actionPoints >= 1) {
                $(".cpuFighter").css("float", "right").attr("data-position", "right");
                parameters[caster].stats.actionPoints--;
            }
        }
    },
    evadeCheck: function (attacker, attack, defender) {
        var dodgeChance = 1 - (parameters[attacker].attacks[attack].accuracy / (parameters[attacker].attacks[attack].accuracy + Math.pow((parameters[defender].stats.wits / 100), 0.985)));
        if ((typeof dodgeChance) === "number" && isNaN(dodgeChance) === false) {
            return dodgeChance;
        } else {
            console.log("dodgeChance: " + dodgeChance);
            console.log(parameters[attacker].attacks);
        }
    },
};
//Giphy call pass in string to change search parameter for gif results.
function callAPI(buttonClicked) {
    $('.displayBox').css('visibility', 'visible');
    let x = getRandomInt(10);
    giphyUrl = "https://api.giphy.com/v1/gifs/search?q=" + buttonClicked + "&key=" + giphApiKey;
    $.ajax({
        url: giphyUrl,
        method: "GET"
    }).then(function (response) {
        if (response) {
            console.log("api call succeesfull");
            console.log(response);
            //if player wins    
            if (buttonClicked === 1) {
                //need to increment players win count.
                $('.displayBox').append(`<img src="${response.data[x].images.original.url}" width="360px" height="360px">`);
                setTimeout(function () {
                    $('.displayBox').empty();
                    $('.displayBox').css('visibility', 'hidden');
                }, 20000);
            } else {
                $('.displayBox').append(`<img src="${response.data[x].images.original.url}" width="360px" height="360px">`);
                setTimeout(function () {
                    $('.displayBox').empty();
                    $('.displayBox').css('visibility', 'hidden');
                }, 3000);
            }
        } else {
            console.log("FAILED API CALL");
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function computerChoice() {

}
//Randomly generating computer Stats
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//On ready function, do stuff when page loads.
$(document).ready(function () {

    // set opponent
    $("#cpuNickName").text(localStorage.getItem("opponent"));
    $("#opponentFightImg").attr("src", localStorage.getItem("image"));
    $("#opponentFightImg2").attr("src", localStorage.getItem("image"));

    console.log(localStorage.getItem("opponent"));
    console.log(localStorage.getItem("image"));

    //Combat Functions
    //battle commands
    $(document).on("click", ".combatBtns", function (action, user) {
        action = $(this).attr("data-action");
        user = $(this).attr("data-user");
        if (user === "player") {
            switch (action) {
                case "punch":
                    if ($(".playerFighter").attr("data-position") === "right" && $(".cpuFighter").attr("data-position") === "left") {
                        battle.attack("player", "punch", "cpu", "POW!");
                    } else {
                        M.toast({
                            html: "<span>You are too far away!</span>",
                            classes: "rounded"
                        });
                    }
                    break;
                case "kick":
                    if ($(".playerFighter").attr("data-position") === "right" && $(".cpuFighter").attr("data-position") === "left") {
                        battle.attack("player", "kick", "cpu", "SNIKT!");
                    } else {
                        M.toast({
                            html: "<span>You are too far away!</span>",
                            classes: "rounded"
                        });
                    }
                    break;
                case "throw":
                    battle.attack("player", "throw", "cpu", "BANG!");
                    break;
                case "drink":
                    battle.drink("player");
                    break;
                case "left":
                    battle.moveLeft("player");
                    break;
                case "right":
                    battle.moveRight("player");
                    break;
            }
        } else if (user === "cpu") {
            switch (action) {
                case "left":
                    battle.moveLeft("cpu");
                    break;
                case "right":
                    battle.moveRight("cpu");
                    break;
            }
        }
    });
});
//end of document on ready
//random function for giphs.
//read local storage and set the background.
var myCity = localStorage.getItem("city");
console.log("my city is" + myCity);
getCity(myCity);
//set background based on city passed into it.
function getCity(myCity) {
    switch (myCity) {
        case "Houston":
            cityImage = "assets/images/Astrodome.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Seattle":
            cityImage = "assets/images/Seattle.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Buffalo":
            cityImage = "assets/images/Buffalo.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Miami":
            cityImage = "assets/images/Miami.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Philadelphia":
            cityImage = "assets/images/Philadelphia.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Boston":
            cityImage = "assets/images/Boston.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Atlanta":
            cityImage = "assets/images/Atlanta.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        case "Dallas":
            cityImage = "assets/images/Dallas.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
            break;
        default:
            cityImage = "assets/images/Astrodome.jpg";
            $('.main').css('background-image', "url(" + cityImage + ")");
    }
}

function winGame() {
    console.log("winGame Called");
    //Just bringing the scope of this outside promise function
    var newDiv;
    //Promise function to get values of accounts
    fireAccounts.once("value")
        .then(function (snap) {
            wins = snap.child(`${displayName}`).child('wins').val();
            losses = snap.child(`${displayName}`).child('losses').val();
            //adding to wins
            wins++;
            //setting text for info at game end
            var endText = `${displayName} you won!  You have ${wins} wins and ${losses} losses!`;
            $('#winsAndLosses').html(`<p>${endText}<p>`);
            //wins net is your net wins
            var winsNet = wins - losses;
            //update database for player and for topten
            database.ref(`accounts/${displayName}`).update({
                wins: wins,
            });
            database.ref(`topten/${displayName}`).update({
                winsNet: winsNet,
            });
        }),
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        };
    //Promise function for top ten, getting info from to display
    var search = database.ref('/topten').orderByChild('winsNet').limitToFirst(10);
    search.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childsnap) {
                var newKey = childsnap.key;
                var newVal = childsnap.child('winsNet').val();
                console.log(newKey);
                console.log(newVal);
                newDiv = $('<div>');
                var newP = $('<p>');
                newP.text(`${newKey}: ${childsnap.child('winsNet').val()} wins!`);
                newDiv.append(newP);

            });
            $('#topTen').html(newDiv);
        });
    //call to end game, endModalmodal will only give ption to play again.
    endModal();
}

function loseGame() {
    //Just bringing the scope of this outside promise function
    var newDiv;
    //Promise function to get values of accounts
    fireAccounts.once("value")
        .then(function (snap) {
            wins = snap.child(`${displayName}`).child('wins').val();
            losses = snap.child(`${displayName}`).child('losses').val();
            //adding to losses
            losses++;
            //setting info to display at game end
            var endText = `${displayname} you lost!  You have ${wins} wins and ${losses} losses!`;
            $('#winsAndLosses').html(`<p>${endText}<p>`);
            //net wins
            var winsNet = wins - losses;
            //update database for wins and net wins, account and top ten
            database.ref(`accounts/${displayName}`).update({
                wins: wins,
            });
            database.ref(`topten/${displayName}`).update({
                winsNet: winsNet,
            });
        }),
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        };
    //Promise function for top ten to display on game end modal
    var search = database.ref('/topten').orderByChild('winsNet').limitToFirst(10);
    search.once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childsnap) {
                var newKey = childsnap.key;
                var newVal = childsnap.child('winsNet').val();
                console.log(newKey);
                console.log(newVal);
                newDiv = $('<div>');
                var newP = $('<p>');
                newP.text(`${newKey}: ${childsnap.child('winsNet').val()} wins!`);
                newDiv.append(newP);

            });
            $('#topTen').html(newDiv);
        });


}

//function to display custom end modal style is controlled in css, does not disappear, only option is to pick another opponent.
function endModal() {
    console.log("end modal called");
    var modal = $('#endModal');
    modal.css("display", "block");
}

//uncomment below to test end modal dsiplay see style.css line #300 to configure.
//endModal();
//end of document on ready