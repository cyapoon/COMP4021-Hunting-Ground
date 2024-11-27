const Registration = (function() {
    // This function sends a register request to the server
    // * `username`  - The username for the sign-in
    // * `name`      - The name of the user
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const register = function(username, name, password, onSuccess, onError) {

        //
        // A. Preparing the user data
        //
        let user_data = {username, name, password};
        let json_data = JSON.stringify(user_data);
 
        //
        // B. Sending the AJAX request to the server
        //
        fetch("/register", {method: "POST", headers: {"Content-Type":"application/json"}, body: json_data})
            .then((res) => {return res.json()})
            .then((json) => { 
                //
                // J. Handling the success response from the server
                //
                if(json.status === "success"){
                    if(onSuccess){
                        onSuccess();
                    }
                } else if(json.status === "error"){
                    //
                    // F. Processing any error returned by the server
                    //
                    if(onError){
                        onError(json.error);
                    }
                }
            })
            .catch((err) => {
                console.log("Error!");
            });
    };

    return { register };
})();
