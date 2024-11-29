const SignInForm = (function () {
    // This function initializes the UI
    const initialize = function () {

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    UserPanel.update(Authentication.getUser());
                    Socket.connect();
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const name = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function () {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function () {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();


const UserPanel = (function () {
    // This function initializes the UI
    const initialize = function () {
        // Click event for the signout button
        $("#signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();
                    $("#greeting_text").text("");
                    $("#instruction-overlay").hide();
                    SignInForm.show();
                }
            );
        });

        $("#instruction").on("click", function () {
            $("#instruction-overlay").show();
        });

        $("#close").on("click", function () {
            $("#instruction-overlay").hide();
        });

        $("#start").on("click", function () {
            $("#frontpage").hide();
            $("#waiting_page").show();
            Socket.startgame();
        });

        $("#cancel").on("click", function () {
            $("#waiting_page").hide();
            $("#frontpage").show();
            Socket.cancel();
        });

    };

    // This function updates the user panel
    const update = function (user) {
        if (user) {
            $("#greeting_text").text("Welcome Back, " + user.name);
            // $("#user-panel .user-name").text(user.name);
        }
        else {
            $("#greeting_text").text("Welcome Back, Guest");
            // $("#user-panel .user-name").text("");
        }
    };

    return { initialize, update };
})();

const OnlineUsersPanel = (function () {
    // This function updates the user panel
    const update = function (no_of_player) {
        if (no_of_player) {
            $("#user-panel .online-player").text("Online User: " + no_of_player);
        }
        else {
            $("#user-panel .online-player").text("");
        }
    };

    return { update };
})();

const WaitingPage = (function () {
    // This function updates the queue
    const update_queue = function (pos) {
        if (pos) {
            $("#waiting_pos").text("Queue Position: " + pos);
        }
        else {
            $("#waiting_pos").text("");
        }
    };

    return { update_queue };
})();

const GamePlayPage = (function () {
    /* Get the canvas and 2D context */
    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");

    /* Create the sounds */
    const sounds = {
        tension: new Audio("./music/tension.mp3"),
        calm: new Audio("./music/calm.mp3"),
    };

    let gameStartTime = 0;      // The timestamp when the game starts

    /* Create the game area */
    const gameArea = BoundingBox(context, 50, 50, 625, 1025);

    /* Create the map */
    let gameMap;

    let mapData;
    let map;

    /* Create the sprites in the game */
    let monster;
    let survivor;

    let gameTimeSoFar;

    // This function initializes the UI
    const initialize = function (identity) {
        $("#waiting_page").hide();
        if (identity === "M") {
            $("#identity-text").text("You are Monster!");
            $("#job-description").text("Kill the Survivor and don't let him reach the exit!");
            setTimeout(function () {
                add_key_handler("M");
            }, 3000);
        } else if (identity === "S") {
            $("#identity-text").text("You are Survivor!");
            $("#job-description").text("Don't let the Monster catch you and escape from the exit!");
            setTimeout(function () {
                add_key_handler("S");
            }, 3000);
        }
        $("#game-start").show();
        $("#gameplay_page").show();
        create_map();
    };

    function doFrame(now) {
        if (gameStartTime == 0) {
            gameStartTime = now;
        }

        /* Update the time remaining */
        gameTimeSoFar = now - gameStartTime;

        /* Update the sprites */
        monster.update(now);
        survivor.update(now);

        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);

        /*monster catches the survivor*/
        const { x, y } = survivor.getXY();
        if (monster.getBoundingBox().isPointInBox(x - 12, y - 15) && monster.getBoundingBox().isPointInBox(x + 12, y + 15)
            && monster.getBoundingBox().isPointInBox(x + 12, y - 15) && monster.getBoundingBox().isPointInBox(x - 12, y + 15)) {
            // console.log("Monster catches the survivor");
            // console.log(timeInSecond);
            // console.log("Monster:");
            // console.log("Obstacle destroy: " + monster.getNumObstacleDestroyed());
            // console.log("Trap Hit: " + monster.getNumTrapHit());
            // console.log("Survivor:");
            // console.log("Trap set: " + survivor.getNumTrapSet());
            // console.log("Chest open: " + survivor.getNumChestOpen());
            Socket.endgame("M");
            $("#gamescene").off();
            gameStartTime = 0;
            sounds.tension.pause();
            return;
        }
        /* The survivor reaches exit */
        const xIndex = Math.round((x - gameArea.getLeft()) / 25);
        const yIndex = Math.round((y - gameArea.getTop()) / 25);
        if (mapData[yIndex][xIndex] == 7) {
            // console.log("Survivor escapes!");
            // console.log(timeInSecond);
            // console.log("Monster:");
            // console.log("Obstacle destroy" + monster.getNumObstacleDestroyed());
            // console.log("Trap Hit" + monster.getNumTrapHit());
            // console.log("Survivor:");
            // console.log("Trap set" + survivor.getNumTrapSet());
            // console.log("Chest open" + survivor.getNumChestOpen());
            Socket.endgame("S");
            $("#gamescene").off();
            gameStartTime = 0;
            sounds.tension.pause();
            return;
        }

        for (var i = 0; i < map.length; i++) {
            for (var j = 0; j < map[i].length; j++) {
                map[i][j].draw();
                // console.log(map[i][j]);
            }
        }
        monster.draw();
        survivor.draw();

        /* Process the next frame */
    };

    const create_map = function () {
        Socket.getSocket().emit("getmap");
        gameMap = GameMap(context, gameArea);
        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);
        /* Start the game */ 
        setTimeout(function(){
            start_game();
            gameMap.drawmap();
            mapData = gameMap.getMapData();
            console.log(mapData);
            map = gameMap.getMap();
            monster = Monster(context, gameArea.getRight() - 25, gameArea.getBottom() - 25, gameArea, mapData, map);
            survivor = Survivor(context, gameArea.getLeft() + 25, gameArea.getTop() + 10 * 25, gameArea, mapData, map);
        },2000);
    };

    const start_game = function() {
        /* Start the game */
        setTimeout(function(){
            update_frame();
            $("#game-start").hide();
            $("#gamescene").focus();
            sounds.tension.loop = true;
            sounds.tension.play();
        }, 3000);
    };

    const add_key_handler = function (identity) {
        if (identity === "S") {
            $("#gamescene").on("keydown", function (event) {
                /* survivor move */
                if (event.keyCode == 65) {
                    // survivor.move(1);
                    Socket.getSocket().emit("move", { direction: 1, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 87) {
                    // survivor.move(2);
                    Socket.getSocket().emit("move", { direction: 2, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 68) {
                    // survivor.move(3);
                    Socket.getSocket().emit("move", { direction: 3, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 83) {
                    // survivor.move(4);
                    Socket.getSocket().emit("move", { direction: 4, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                if (event.keyCode == 32) {
                    // survivor.switchCheatingMode();
                    Socket.getSocket().emit("cheat", { identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                if (event.keyCode == 74) {
                    // survivor.setTrap();
                    Socket.getSocket().emit("trap");
                    Socket.getSocket().emit("requestanime");
                }

            });

            $("#gamescene").on("keyup", function (event) {
                /* survivor stop */
                if (event.keyCode == 65) {
                    // survivor.stop(1);
                    Socket.getSocket().emit("stop", { direction: 1, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 87) {
                    // survivor.stop(2);
                    Socket.getSocket().emit("stop", { direction: 2, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 68) {
                    // survivor.stop(3);
                    Socket.getSocket().emit("stop", { direction: 3, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 83) {
                    // survivor.stop(4);
                    Socket.getSocket().emit("stop", { direction: 4, identity: "S" });
                    Socket.getSocket().emit("requestanime");
                }
            });

        } else if (identity === "M") {
            $("#gamescene").on("keydown", function (event) {

                /* monster move */
                if (event.keyCode == 65) {
                    // monster.move(1);
                    Socket.getSocket().emit("move", { direction: 1, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 87) {
                    // monster.move(2);
                    Socket.getSocket().emit("move", { direction: 2, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 68) {
                    // monster.move(3);
                    Socket.getSocket().emit("move", { direction: 3, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 83) {
                    // monster.move(4);
                    Socket.getSocket().emit("move", { direction: 4, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                if (event.keyCode == 32) {
                    // monster.switchCheatingMode();
                    Socket.getSocket().emit("cheat", { identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                if (event.keyCode == 74) {
                    // monster.destroy();
                    Socket.getSocket().emit("destroy");
                    Socket.getSocket().emit("requestanime");
                }

            });

            $("#gamescene").on("keyup", function (event) {
                /* monster stop */
                if (event.keyCode == 65) {
                    // monster.stop(1);
                    Socket.getSocket().emit("stop", { direction: 1, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 87) {
                    // monster.stop(2);
                    Socket.getSocket().emit("stop", { direction: 2, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 68) {
                    // monster.stop(3);
                    Socket.getSocket().emit("stop", { direction: 3, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
                else if (event.keyCode == 83) {
                    // monster.stop(4);
                    Socket.getSocket().emit("stop", { direction: 4, identity: "M" });
                    Socket.getSocket().emit("requestanime");
                }
            });

        }
    };

    const setmap = function (new_map) {
        gameMap.setMapData(new_map);
    };

    const move = function (identity, direction) {
        if (identity === "M") {
            monster.move(direction);
        }
        else if (identity === "S") {
            survivor.move(direction);
        }
    };

    const switchCheatingMode = function (identity) {
        if (identity === "M") {
            monster.switchCheatingMode();
        }
        else if (identity === "S") {
            survivor.switchCheatingMode();
        }
    }

    const stop = function (identity, direction) {
        if (identity === "M") {
            monster.stop(direction);
        }
        else if (identity === "S") {
            survivor.stop(direction);
        }
    };

    const setTrap = function () {
        survivor.setTrap();
    }

    const destroy = function () {
        monster.destroy();
    }

    const update_frame = function () {
        requestAnimationFrame(doFrame);
    }

    const get_time = function () {
        return gameTimeSoFar;
    }

    return { initialize, create_map, start_game, add_key_handler, setmap, move, stop, setTrap, destroy, switchCheatingMode, update_frame, get_time };
})();

const StatisticPage = (function () {
    // This function initializes the UI
    const initialize = function () {
        $("#restart").on("click", function () {
            $("#statistics_page").hide();
            $("#waiting_page").show();
            Socket.startgame();
        });

        $("#back_to_menu").on("click", function () {
            $("#statistics_page").hide();
            $("#frontpage").show();
        });
    };

    const show = function (identity) {
        $("#gameplay_page").hide();
        $("#statistics_page").show();
        $("#congulation_text").text(identity + " Win!");
        let time = GamePlayPage.get_time();
        time = Math.floor(time / 1000);
        let min = Math.floor(time / 60);
        let sec = (time % 60);
        $("#time").text("Time of the Game: " + min + " mins " + sec + " seconds");

    }

    return { initialize, show };
})();