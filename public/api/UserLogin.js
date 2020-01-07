function login_vote() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('pass').value;
        console.log("login");


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
                if (user) {
                    // User is signed in.
                    var email = user.email;
                    var uid = user.uid;
                    var login_user = firebase.database().ref("Login_user" + "/" + uid);
                    login_user.set({
                        email: email,
                        uid: uid,
                        status: true
                    });
                    var ref = firebase.database().ref("Voted_user");
                    ref.orderByKey().on("child_added", function (snapshot) {
                        if (uid == snapshot.key) {
                            var firebaseRef = firebase.database().ref("Voted_user");
                            firebaseRef.on("value", function (snapshot) {
                                var uid_voted = snapshot.child(uid).val().uid;
                                var date_voted = snapshot.child(uid).val().today;
                                var status = snapshot.child(uid).val().status;
                                var time = new Date();
                                var today = time.getDate();
                                if (date_voted == today && uid == uid_voted && status == 1) {
                                    window.location.href = "../src/user/success_vote.html";
                                }
                            });
                        } else {
                            window.location.href = "../src/user/VoteData.html";
                        }
                    })
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