window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var firebaseRef = firebase.database().ref("adminLogin");
            firebaseRef.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childdata = childSnapshot.val();
                    if (email != childdata.email) {
                        window.location.href = "../../index.html";
                    }
                });
            });
        } else {
            window.location.href = "../../index.html";
        }
    });
}

function create_user() {
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;

    if (email.length < 4) {
        alert("ກະລູນາປ້ອນອີເມວ");
        return;
    }
    if (pass.length < 4) {
        alert("ກະລຸນາປ້ອນລະຫັດຜ່ານ");
        return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
        var error_code = error.code;
        var errorMessage = error.message;

        if (error_code == "auth/weak-password") {
            alert("this password is too weak");
        } else {
            alert(errorMessage);
        }
        console.log(error);

    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = "../../index.html"
    }).catch(function (error) {
        // An error happened.
    });
}


function logout() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var uid = user.uid;
            var login_user = firebase.database().ref("Login_user" + "/" + uid);
            login_user.set({
                email: email,
                uid: uid,
                status: false
            });
            firebase.auth().signOut().then(function () {
                window.location.href = "../../index.html"
            }).catch(function (error) {
                console.log(error.message);

            });
        }
    });
}