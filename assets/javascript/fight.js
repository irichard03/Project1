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
var playerHealth = userHealth * 10;
var actionPoints = 4;
var computerActionPoints = 0;
var userAcc;
var abilities;
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('signed in!');
        displayName = user.displayName;
        console.log(user.displayName);
        fireAccounts.once("value", function (snap) {
                userHealth = snap.child(`${displayName}`).child('health').val();
                console.log("health: " + userHealth);
                userWit = snap.child(`${displayName}`).child('wits').val();
                console.log("wits: " + userWit);
                userStrength = snap.child(`${displayName}`).child('strength').val();
                console.log("strength: " + userStrength);
            }).then(function () {
                userAcc = 3.677 - (23 / Math.pow((10 + userWit), 0.7));
                abilities = {
                    "kick": {
                        damage: baseKick * userStrength + Math.round(Math.random() * (userStrength * baseKick) / 5),
                        accuracy: userAcc - 0.35
                    },
                    "punch": {
                        damage: basePunch * userStrength + Math.round(Math.random() * (userStrength * basePunch) / 10),
                        accuracy: userAcc
                    },
                    "throw": {
                        damage: baseThrow * userStrength + Math.round(Math.random() * (userStrength * baseThrow) / 15),
                        accuracy: userAcc + 0.35
                    }
                };
            }),
            function (errorObject) {
                console.log("Errors handled: " + errorObject.code);
            }
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        $('#nickName').text(displayName);
    }
});

var battle = {
    attack: function (attackType, toast) {
        var roll = Math.random();
        if (actionPoints >= 2) {
            if (roll > battle.evadeCheck(computerWit, attackType)) {
                computerHealth = computerHealth - abilities[attackType].damage;
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
            $('.playerFighter').css("float", "left").attr("data-position", "left");;
            actionPoints--;
        }
        //if there is space available to the left,
        //move to the left
        //consume one action point
        //else senda  message that there is no room to the left
        //subtract an action piont
    },
    moveRight: function () {
        if (actionPoints >= 1) {
            $('.playerFighter').css("float", "right").attr("data-position", "right");
            actionPoints--;
        }
        //if there is at least 1 action point left
        //if there is space to the right,
        //move to the right
        //consume one action piont
        //else send a message that there is no room to the right
        //subtract an action point
    },
    guard: function () {
        //if there is at least one action point left
        //set the guard status
        //temporarily increase wits and health by 25% for the next opponents next turn
        //subtract 2 actoin points
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
//On ready function, do stuff when page loads.
$(document).ready(function () {
    //Combat Functions
    //battle commands
    $(document).on("click", ".combatBtns", function (action) {
        action = $(this).attr("data-action");
        switch (action) {
            case "punch":
                if ($(".playerFighter").attr("data-position") === "right" && $(".cpuFighter").attr("data-position") === "left"){
                    battle.attack("punch", "POW!");
                } else {
                    M.toast({
                        html: "<span>You are too far away!</span>",
                        classes: "rounded"
                    });
                }
                break;
            case "kick":
                battle.attack("kick", "SNIKT!");
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
});//end of document on ready
//ignore, math testing