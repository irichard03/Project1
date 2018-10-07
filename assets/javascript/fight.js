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
var baseKick = 2;
var basePunch = 1;
var baseThrow = 0.6;
var throwAccBonus = 0.2;
var userStr = 10;
var damagePlaceHolder = 80;
var giphApiKey = "Y3h4ksc22JmMFoYTKH2XUYmRwrnYL8Gd";
var computerHealth = 200;
var playerHealth = userHealth * 10;
var baseAcc = 0.9; // 3.677 - (23/(10+wits)^.7)
var baseDodge = 0.1;
var userDodge = 0; // 1 - (attackerAccuracy/(attackerAccuracy + (defenderWits/100)^0.985))
var userHealth = 10; //10 * vitality;
var actionPoints = 999;
var wits = 10;
var userAcc = 3.677 - (23 / Math.pow((10 + wits), 0.7));
var wins;
var losses;
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
    attack: function (attackType, toast) {
        var roll = Math.random();
        if (actionPoints >= 2) {
            if (roll > battle.evadeCheck(wits, attackType)) {
                computerHealth = computerHealth - abilities[attackType].damage;
                if (computerHealth > 0) {
                    callAPI(attackType);
                }
                console.log(`You attacked the computer for ${abilities[attackType].damage} damage!`); //enemyname is placeholder
                console.log(computerHealth);
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
                M.toast({
                    html: "YOU MISSED!",
                    classes: "rounded"
                });
                console.log(battle.evadeCheck(wits, attackType));
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
                    html: "GULP!",
                    classes: "rounded"
                });
            }
        }
    },
    moveLeft: function () {
        if (actionPoints >= 1) {
            $('.playerFighter').css("float", "left");
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
            $('.playerFighter').css("float", "right");
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
            console.log("dodgechance: " + dodgeChance);
            console.log(abilities[attackType].damage);
            console.log("userStr: " + userStr);
            console.log("basepunch: " + basePunch);
            console.log(attackType);
            console.log(abilities);
            console.log(userAcc);
            console.log(userStr);
            return dodgeChance;
        } else {
            console.log("dogde else: " + dodgeChance);
        }
    },
};
M.AutoInit();
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('signed in!');
        displayName = user.displayName;
        console.log(user.displayName);
        var newConnection = database.ref("connections/").push(user.displayName);
        newConnection.onDisconnect().remove();
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
                battle.attack("punch", "POW!");
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

    //
  




    //random function for giphs.
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


   

    //read local storage and set the background.
    var myCity = localStorage.getItem("city");
    console.log("my city is" + myCity);
    getCity(myCity);

    //set background based on city passed into it.
    function getCity(myCity){
        switch(myCity) {
            case "Houston":
                var cityImage = "assets/images/Astrodome.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break;
            case "Seattle":
                var cityImage = "assets/images/Seattle.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break;
            case "Buffalo":
                var cityImage = "assets/images/Buffalo.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break;
            case "Miami":
                var cityImage = "assets/images/Miami.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break; 
            case "Philadelphia":
                var cityImage = "assets/images/Philadelphia.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break;   
            case "Boston":
                var cityImage = "assets/images/Boston.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break;  
            case "Atlanta":
                var cityImage = "assets/images/Atlanta.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break; 
            case "Dallas":
                var cityImage = "assets/images/Dallas.jpg";
                $('.main').css('background-image', "url(" + cityImage + ")");
                break;      
            default:
                var cityImage = "assets/images/Astrodome.jpg";
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
                    winsNet:winsNet,
                });
            }),
            function (errorObject) {
                console.log("Errors handled: " + errorObject.code);
            }
        //Promise function for top ten, getting info from to display
        var search = database.ref('/topten').orderByChild('winsNet').limitToFirst(10);
        search.once('value')
            .then(function (snapshot) {
            snapshot.forEach(function (childsnap) {
                var newKey = childsnap.key;
                var newVal = childsnap.child('winsNet').val()
                console.log(newKey);
                console.log(newVal);
                newDiv = $('<div>');
                var newP = $('<p>');
                newP.text(`${newKey}: ${childsnap.child('winsNet').val()} wins!`);
                newDiv.append(newP);
                
            })
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
            }
        //Promise function for top ten to display on game end modal
        var search = database.ref('/topten').orderByChild('winsNet').limitToFirst(10);
        search.once('value')
            .then(function (snapshot) {
            snapshot.forEach(function (childsnap) {
                var newKey = childsnap.key;
                var newVal = childsnap.child('winsNet').val()
                console.log(newKey);
                console.log(newVal);
                newDiv = $('<div>');
                var newP = $('<p>');
                newP.text(`${newKey}: ${childsnap.child('winsNet').val()} wins!`);
                newDiv.append(newP);
                
            })
            $('#topTen').html(newDiv);
        });

        
    }

    //function to display custom end modal style is controlled in css, does not disappear, only option is to pick another opponent.
    function endModal(){
        console.log("end modal called");
        var modal = $('#endModal');
        modal.css("display", "block");
        buildTable();
    }
    //end of endmodal function

    function buildTable(){
        topTen.once("value", function (snapshot) {
            var latestSnapshot = snapshot.val();
            for(var iterator in latestSnapshot){
                var x = latestSnapshot[iterator].key
                console.log(x);
                $('#topTen').prepend(`"<p>Player ${x} has a net win loss record of: ${latestSnapshot[iterator].winsNet}</p>"`);
                console.log(latestSnapshot);
            }
            
        });
    }

    


    //uncomment below to test end modal dsiplay see style.css line #300 to configure.
    endModal();
    //end of document on ready
});



