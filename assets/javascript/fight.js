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
var userHealth;
var userWit;
var userStrength;
var baseKick = 5;
var basePunch = 3.5;
var baseThrow = 2.25;
var giphApiKey = "Y3h4ksc22JmMFoYTKH2XUYmRwrnYL8Gd";
var computerHealth = 200;
var computerWit = 10;
var actionPoints = 4;
var computerActionPoints = 0;
var userAcc;
var cityImage;


var battleStats = {
    "playerAbilities": {

    },
    "playerStats": {

    },
    "cpuAbilities": {
        "cpuKick": {
            damage: baseKick * computerStrength + Math.round(Math.random() * (computerStrength * baseKick) / 5),
            accuracy: cpuAcc - 0.35
        },
        "cpuPunch": {
            damage: basePunch * computerStrength + Math.round(Math.random() * (computerStrength * baseKick) / 10),
            accuracy: cpuAcc
        },
        "cpuThrow": {
            damage: baseThrow * computerStrength + Math.round(Math.random() * (computerStrength * baskThrow) / 15),
            accuracy: cpuAcc + 0.35
        }
    },
    "cpuStats": {
        health: randomBetween(1, 50 - 3),
        computerHealth: battleStats[cpuStats].health * 10,
        strength: randomBetween(1, 50 - 2 - computerHealth),
        wits: 50 - battleStats[cpuStats].health - battleStats[cpuStats].strength,
        accuracy: 3.677 - (23 / Math.pow((10 + battleStats[cpuStats].wits), 0.7))
    }
};
var actionPoints = {
    "user": 4,
    "cpu": 0
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
                battleStats[playerStats] = {
                    health: snap.child(`${displayName}`).child('health').val(),
                    playerHealth: snap.child(`${displayName}`).child('health').val() * 10,
                    strength: snap.child(`${displayName}`).child('strength').val(),
                    wits: snap.child(`${displayName}`).child('wits').val(),
                    accuracy: 3.677 - 23 / Math.pow((10 + snap.child(`${displayName}`).child('wits').val(), 0.7))
                };
            }).then(function () {
                userAcc = 
                battleStats[playerAbilities] = {
                    "kick": {
                        damage: baseKick * battleStats[playerStats].strength + Math.round(Math.random() * (battleStats[playerStats].strength * baseKick) / 5),
                        accuracy: userAcc - 0.35
                    },
                    "punch": {
                        damage: basePunch * battleStats[playerStats].strength + Math.round(Math.random() * (battleStats[playerStats].strength * basePunch) / 10),
                        accuracy: userAcc
                    },
                    "throw": {
                        damage: baseThrow * battleStats[playerStats].strength + Math.round(Math.random() * (battleStats[playerStats].strength * baseThrow) / 15),
                        accuracy: userAcc + 0.35
                    }
                };
                battleStats[playerStats].push()
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
    attack: function (attackType, toast, attacker, target) {
        var roll = Math.random();
        if (actionPoints[attacker] >= 2) {
            if (roll > battle.evadeCheck(target.Wits, attackType)) {
                target.Health = target.Health - abilities[attackType].damage;
                console.log(`You attacked the computer for ${abilities[attackType].damage} damage!`); //enemyname is placeholder
                console.log("Your roll: " + roll);
                console.log("cpu evade chance: " + battle.evadeCheck(computerWit, attackType));
                if (computerHealth > 0) {
                    callAPI(attackType);
                }
                M.toast({
                    html: `<span>${toast}</span>`,
                    classes: 'rounded'
                });
                if (computerHealth < 0) {
                    computerHealth = 0;
                    $('#cpuHealth').css('width', '0px');
                    callAPI(1);
                } else {
                    let cpuHealthString = computerHealth.toString();
                    cpuHealthString += 'px';
                    console.log(cpuHealthString);
                    $('#cpuHealth').css('width', cpuHealthString);
                }
            } else {
                console.log(`You attacked the computer for ${abilities[attackType].damage} damage!`); //enemyname is placeholder
                console.log("Your roll: " + roll);
                console.log("cpu evade chance: " + battle.evadeCheck(computerWit, attackType));

                M.toast({
                    html: `<span>YOU MISSED!</span>`,
                    classes: "rounded"
                });
                console.log(battle.evadeCheck(userWit, attackType));
            }
            actionPoints = actionPoints - 2;
        }
    },
    drink: function () {
        if (actionPoints >= 2) {
            if (health > 0) {
                strengthStat = strengthStat + strengthStat * 0.5;
                witStat = witStat - witStat * 0.5;
                M.toast({
                    html: `<span>GULP!</span>`,
                    classes: "rounded"
                });
            }
        }
    },
    moveLeft: function () {
        if (actionPoints >= 1) {
            $('.playerFighter').css("float", "left").attr("data-position", "left");
            actionPoints--;
        }
    },
    moveRight: function () {
        if (actionPoints >= 1) {
            $('.playerFighter').css("float", "right").attr("data-position", "right");
            actionPoints--;
        }
    },
    evadeCheck: function (wits, attackType) {
        var dodgeChance = 1 - (abilities[attackType].accuracy / (abilities[attackType].accuracy + Math.pow((wits / 100), 0.985)));
        if ((typeof dodgeChance) === "number" && isNaN(dodgeChance) === false) {
            return dodgeChance;
        } else {
            console.log("dodgeChance: " + dodgeChance);
            console.log(abilities);
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
    $(document).on("click", ".combatBtns", function (action) {
        action = $(this).attr("data-action");
        switch (action) {
            case "punch":
                if ($(".playerFighter").attr("data-position") === "right" && $(".cpuFighter").attr("data-position") === "left") {
                    battle.attack("punch", "POW!");
                } else {
                    M.toast({
                        html: "<span>You are too far away!</span>",
                        classes: "rounded"
                    });
                }
                break;
            case "kick":
                if ($(".playerFighter").attr("data-position") === "right" && $(".cpuFighter").attr("data-position") === "left") {
                    battle.attack("kick", "SNIKT!");
                } else {
                    M.toast({
                        html: "<span>You are too far away!</span>",
                        classes: "rounded"
                    });
                }
                break;
            case "throw":
                battle.attack("throw", "BANG!");
                break;
            case "drink":
                battle.drink();
                break;
            case "left":
                battle.moveLeft();
                break;
            case "right":
                battle.moveRight();
                break;
            case "guard":
                battle.guard();
                break;
        }
    });
    if (actionPoints === 0) {
        computerActionPoints = 4;
    }
    if (computerActionPoints !== 0) {

    }
}); //end of document on ready
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