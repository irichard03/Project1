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
var userHealth;
var userWit;
var userStrength;
//init materialize
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('signed in!');
        displayName = user.displayName;
        console.log(user.displayName);
        fireAccounts.once("value", function (snap) {
            userHealth = snap.child(`${displayName}`).child('health').val();
            console.log(userHealth);
            userWit = snap.child(`${displayName}`).child('wits').val();
            console.log(userWit);
            userStrength = snap.child(`${displayName}`).child('strength').val();
            console.log(userStrength);
        }),
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        }
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        $('#nickName').text(displayName);
    }
});

//var to hold damage placeholder for testing, actual damage should be passed
//in as an argument to the attack functions below.
var damagePlaceHolder = 80;
var giphApiKey = "Y3h4ksc22JmMFoYTKH2XUYmRwrnYL8Gd";
var computerHealth = 200;
var playerHealth = userHealth * 10;
var baseAcc = 0.9; // 3.677 - (23/(10+wits)^.7)
var baseDodge = 0.1;
var userDodge = 0; // 1 - (attackerAccuracy/(attackerAccuracy + (defenderWits/100)^0.985))
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
var battle = {
    attack: function (attackType) {
        var roll = Math.random();
        if (actionPoints >= 2) {
            if (roll > battle.evadeCheck(wits)) {
                enemyHP = enemyHP - abilities[attackType].damage;
                $("").html(`You attacked ${enemyName} for ${abilities[attackType].damage} damage!`); //enemyname is placeholder
            } else {
                //you missed
            }
            actionPoints = actionPoints - 2;
        }
    },
    drink: function () {
        if (actionPoints >= 2) {
            if (health > 0) {
                strengthStat = strengthStat + strengthStat * 0.5;
                witStat = witStat - witStat * 0.5;
            }
        }
    },
    moveLeft: function () {
        //if there is at least 1 action point left
        //if there is space available to the left,
        //move to the left
        //consume one action point
        //else senda  message that there is no room to the left
        //subtract an action piont
    },
    moveRight: function () {
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
        return 1 - (abilities[attackType].accuracy / (abilities[attackType].accuracy + (wits / 100) ^ 0.985));
    },
};
//On ready function, do stuff when page loads.
$(document).ready(function () {
    //Combat Functions
    //battle commands

    $(document).on("click", ".combatBtns", function (action) {
        action = $(this).attr("data-action");
        switch (action) {
            case "punch":
                battle.attack("punch");
                break;
            case "kick":
                battle.attack("kick");
                break;
            case "throw":
                battle.attack("throw");
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
            case "down":
                battle.guard();
                break;
        }
    });
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




    //random function for giphs.
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    //TODObutton Functions to modify computer bars
    $('.playerPunch').click(function () {
        callAPI("punch");
        computerHealth = computerHealth - damagePlaceHolder;
        console.log(computerHealth);
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

    });
    
    //TODObutton Functions to modify cpu bars

    //ToDo Function for player winning, should increment wins and display gif.


    //Button Functions to move player and cpu back/forward by switching float values.
    $('.playerForward').click(function () {
        $('.playerFighter').css("float", "right");
    });

    $('.playerBackward').click(function () {
        $('.playerFighter').css("float", "left");
    });

    $('.cpuForward').click(function () {
        $('.cpuFighter').css("float", "right");
    });

    $('.cpuBackward').click(function () {
        //git;
        $('.cpuFighter').css("float", "left");
    });

    //end of document on ready
});
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
