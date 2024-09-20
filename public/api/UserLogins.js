
function login_vote() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('pass').value;


        if (email.length < 4) {
            alert("ກະລູນາປ້ອນອີເມວ");
            // return;
        }
        if (password.length < 4) {
            alert("ກະລຸນາປ້ອນລະຫັດຜ່ານ");
            // return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            firebase.auth().onAuthStateChanged(function (user) {
                console.log("hhhhh",user);
                
                if (user) {
                    // User is signed in.
                    var email_user = user.email;
                    var uid = user.uid;
                    var paths = firebase.database().ref("All_user_added" + "/" + "user_list");
                    paths.once("value", function (snapshot) {
                        snapshot.forEach((childSnapshot) => {
                            var key = childSnapshot.key;
                            var childdata = childSnapshot.val();
                            if (childdata.email == email && childdata.pass == password) {
                                var statuspath = firebase.database().ref("All_user_added" + "/" + "user_list" + "/" + key);
                                statuspath.set({
                                    email: email,
                                    pass: password,
                                    status: true,
                                    vote: false
                                });
                            }
                        });
                    });

                    var login_user = firebase.database().ref("Login_user" + "/" + uid);
                    login_user.set({
                        email: email,
                        uid: uid,
                        status: true
                    });
                    // window.location.href = "../src/user/VoteData.html";
                    // for deployment
                    window.location.href = "../src/admin/Main_menu.html";
                    // for debugging
                    window.location.href = "../public/src/admin/Main_menu.html";
                }
            });
            // window.location.href = "../src/user/authen_user.html";
        }).catch(function (error) {
            // Handle Errors here.
            var error_code = error.code;
            var errorMessage = error.message;

            // ...
            if (error_code == "auth/weak-password") {
                alert("this password is too weak");
            } else {
                document.getElementById("alert").hidden = false;

            }
        });
    }

}