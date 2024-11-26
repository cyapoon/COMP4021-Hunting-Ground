const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'asset' folder to serve static files
app.use(express.static("asset"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// The Online user list object
const onlineUsers = {};

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, name, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    // console.log(users);

    //
    // E. Checking for the user data correctness
    //
    if(username === ""){
        res.json({ status: "error", error: "Username can't be empty!"});
        return;
    }
    if (name === ""){
        res.json({ status: "error", error: "Name can't be empty!"});
        return;
    } 
    if (password === ""){
        res.json({ status: "error", error: "Password can't be empty!"});
        return;
    }
    if (!containWordCharsOnly(username)){
        res.json({ status: "error", error: "Username should only contains underscores, letters or numbers!"});
        return;
    }
    if (username in users){
        res.json({ status: "error", error: "Username already exists, please change to another username!"});
        return;
    }

    //
    // G. Adding the new user account
    //

    // to ensure consistency, create object using password: hash
    const hash = bcrypt.hashSync(password, 10);
    users[username] = {name, password: hash};

    //
    // H. Saving the users.json file
    //
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, " "));

    //
    // I. Sending a success response to the browser
    //
    res.json({ status: "success" });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"));

    //
    // E. Checking for username/password
    //
    if (!(username in users)){
        res.json({ status: "error", error: "Incorrect Username or Username does not exists."});
        return;
    } else {
        const hashedpw = users[username].password;
        if(!bcrypt.compareSync(password, hashedpw)){
            res.json({ status: "error", error: "Incorrect Password!"});
            return;
        }
    }
    
    //
    // G. Sending a success response with the user account
    //
    let name = users[username].name;
    req.session.user = {username, name};
    res.json({ status: "success", user: {username, name}});
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    let s_user;
    if(req.session.user){
        s_user = req.session.user;
    }
    //
    // D. Sending a success response with the user account
    //
    if(!s_user){
        res.json({ status: "error", error: "No User with the session, please signin again."});
        return;
    }
    res.json({ status: "success", user: s_user});
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    delete req.session.user;

    //
    // Sending a success response
    //
    res.json({ status: "success"});
});


//
// ***** Please insert your Lab 6 code here *****
//
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer( app );
const io = new Server(httpServer);

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

io.on("connection", (socket) => {
    // Add a new user to the online user list
    if(socket.request.session.user){
        let username = socket.request.session.user.username;
        let name = socket.request.session.user.name;
        onlineUsers[username] = {name};
    }

    socket.on("disconnect", () => {
        // Remove the user from the online user list
        if(socket.request.session.user){
            let username = socket.request.session.user.username;
            let name = socket.request.session.user.name;
            if(onlineUsers[username]){
                delete onlineUsers[username];
            }
        }
    });
});

// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The game server has started...");
});