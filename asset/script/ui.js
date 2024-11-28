const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {

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
            const name     = $("#register-name").val().trim();
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
    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();


const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
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

        $("#instruction").on("click", function(){
            $("#instruction-overlay").show();
        });

        $("#close").on("click", function(){
            $("#instruction-overlay").hide();
        });

        $("#start").on("click", function(){
            $("#frontpage").hide();
            $("#waiting_page").show();
            Socket.startgame();
        });

        $("#cancel").on("click", function(){
            $("#waiting_page").hide();
            $("#frontpage").show();
            Socket.cancel();
        });

    };

    // This function updates the user panel
    const update = function(user) {
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

const OnlineUsersPanel = (function() {
    // This function updates the user panel
    const update = function(no_of_player) {
        if (no_of_player) {
            $("#user-panel .online-player").text("Online User: " + no_of_player);
        }
        else {
            $("#user-panel .online-player").text("");
        }
    };

    return { update };
})();

const WaitingPage = (function() {
    // This function updates the queue
    const update_queue = function(pos) {
        if (pos) {
            $("#waiting_pos").text("Queue Position: " + pos);
        }
        else {
            $("#waiting_pos").text("");
        }
    };

    return { update_queue };
})();