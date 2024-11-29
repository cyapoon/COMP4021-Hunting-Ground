const Socket = (function () {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function () {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function () {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            let onlineUsers_list = JSON.parse(onlineUsers);
            let len = Object.keys(onlineUsers_list).length;
            // Show the online users
            OnlineUsersPanel.update(len);
        });

        socket.on("updated queue", (Queue) => {
            let list = JSON.parse(Queue);
            let user = Authentication.getUser();
            let predicate = (userinqueue) => {
                return JSON.stringify(userinqueue) === JSON.stringify(user);
            };
            let pos = list.findIndex(predicate) + 1;
            WaitingPage.update_queue(pos);
        });

        socket.on("change scene", (playing_list) => {
            let list = JSON.parse(playing_list);
            let username = Authentication.getUser().username;
            if (list["Monster"] && list["Monster"].username === username) {
                GamePlayPage.initialize("M");
            } else if (list["Survivor"] && list["Survivor"].username === username) {
                GamePlayPage.initialize("S");
            }
        });

        socket.on("mapdata", (mapdata) =>{
            GamePlayPage.setmap(mapdata);
        });

        socket.on("moving", (data) => {
            const msg = JSON.parse(data);
            let action = msg["action"];
            let playing_list = msg["playerlist"];
            let username = Authentication.getUser().username;
            if ((playing_list["Monster"] && playing_list["Monster"].username === username) || (playing_list["Survivor"] && playing_list["Survivor"].username === username)) {
                let { direction, identity } = action;
                GamePlayPage.move(identity.direction);
                // if (identity === "M") {
                //     monster.move(direction);
                // }
                // else if (identity === "S") {
                //     survivor.move(direction);
                // }
            }
        });

        socket.on("stopping", (data) => {
            const msg = JSON.parse(data);
            let action = msg["action"];
            let playing_list = msg["playerlist"];
            let username = Authentication.getUser().username;
            if ((playing_list["Monster"] && playing_list["Monster"].username === username) || (playing_list["Survivor"] && playing_list["Survivor"].username === username)) {
                let { direction, identity } = action;
                GamePlayPage.stop(identity, direction);
                // if (identity === "M") {

                //     monster.stop(direction);
                // }
                // else if (identity === "S") {
                //     survivor.stop(direction);
                // }
            }
        });

        socket.on("cheating", (data) => {
            const msg = JSON.parse(data);
            let action = msg["action"];
            let playing_list = msg["playerlist"];
            let username = Authentication.getUser().username;
            if ((playing_list["Monster"] && playing_list["Monster"].username === username) || (playing_list["Survivor"] && playing_list["Survivor"].username === username)) {
                let { identity } = action;
                if (identity === "M") {
                    monster.switchCheatingMode();
                }
                else if (identity === "S") {
                    survivor.switchCheatingMode();
                }
            }
        }

        );

        socket.on("trapping", (data) => {
            
            const msg = JSON.parse(data);
            let playing_list = msg["playerlist"];
            let username = Authentication.getUser().username;
            if ((playing_list["Monster"] && playing_list["Monster"].username === username) || (playing_list["Survivor"] && playing_list["Survivor"].username === username)) {
                console.log("trapping");
                survivor.setTrap();
            }
        });

        socket.on("destroying", (data) => {
            const msg = JSON.parse(data);
            let  playing_list  = msg["playerlist"];
            let username = Authentication.getUser().username;
            if ((playing_list["Monster"] && playing_list["Monster"].username === username) || (playing_list["Survivor"] && playing_list["Survivor"].username === username)) {
                console.log("destroying");
                monster.destroy();
            }
        });
    };

    // This function disconnects the socket from the server
    const disconnect = function () {
        socket.disconnect();
        OnlineUsersPanel.update();
        socket = null;
    };

    const startgame = function () {
        socket.emit("go in queue", Authentication.getUser());
    }

    const cancel = function () {
        socket.emit("cancel queue", Authentication.getUser());
    }

    const endgame = function(identity) {
        socket.emit("win", identity);
    }

    return { getSocket, connect, disconnect, startgame, cancel };
})();
