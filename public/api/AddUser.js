function create_user() {
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    if (email.length < 4) {
        alert("ກະລູນາປ້ອນອີເມວ");
        // return;
    }
    if (pass.length < 4) {
        alert("ກະລຸນາປ້ອນລະຫັດຜ່ານ");
        // return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function () {
        var add_to_user = {
            email: email,
            pass: pass,
            status: false,
            vote: false,
        }
        firebase.database().ref("All_user_added" + "/" + "user_list").push(add_to_user).then(function () {
            console.log("success insert to firebase");
        }).catch(function (error) {
            console.log(error.message);
        });

        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("alert").hidden = false;

    }).catch(function (error) {
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

function menu() {
    window.location.href = "../admin/menu.html"
}
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var password = user.password;
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