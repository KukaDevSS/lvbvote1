function login_admin() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('pass').value;
        if (email.length < 4) {
            alert("ກະລູນາປ້ອນອີເມວ");
            return;
        }
        if (password.length < 4) {
            alert("ກະລຸນາປ້ອນລະຫັດຜ່ານ");
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            var firebaseRef = firebase.database().ref("adminLogin");
            firebaseRef.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childdata = childSnapshot.val();
                    if (email == childdata.email && password == childdata.password) {
                        var login_user = firebase.database().ref("Login_user" + "/" + "admin");
                        login_user.set({
                            email: email,
                            status: true
                        });
                        window.location.href = "../src/admin/menu.html";
                    } else {
                        document.getElementById("alert").hidden = false;
                    }

                });
            });
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

// function login(emailData, passwordData) {
//     var email = document.getElementById('email').value;
//     var password = document.getElementById('pass').value;
//     if (email == emailData && password == passwordData) {
//         window.location.href = "../src/admin/Menu.html";
//     }
// }