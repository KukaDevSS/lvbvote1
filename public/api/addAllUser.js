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

    var domain = "@laovietbank.com.la";
    var f = "lvb0";
    var pass = "lvb@0";
    for (i = 1; i <= 10; i++) {
        var email = f + i + domain;
        var info_pass = pass + i;
        console.log(email);
        console.log(info_pass);
    }

    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function () {
        var add_to_user = {
            email: email,
            pass: pass,
        }
        firebase.database().ref("All_user_added" + "/" + "user_list").push(add_to_user).then(function () {
            console.log("success insert to firebase");
        }).catch(function (error) {
            console.log(error.message);
        });
        window.location.href = "../admin/ListAlluser.html";

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
window.onload = function () {
    var domain = "@laovietbank.com.la";
    var f = "lvb0";
    var pass = "lvb@0";
    for (i = 1; i <= 100; i++) {
        var email = f + i + domain;
        var info_pass = pass + i;
        console.log(email);
        console.log(info_pass);
        var add_to_user = {
            email: email,
            pass: info_pass,
            status: false,
            vote: false,
        }
        firebase.database().ref("All_user_added" + "/" + "user_list").push(add_to_user).then(function () {
            console.log("success insert to firebase");
        }).catch(function (error) {
            console.log(error.message);
        });
        // firebase.auth().createUserWithEmailAndPassword(email, info_pass).catch(function (error) {
        //     var error_code = error.code;
        //     var errorMessage = error.message;
        //     if (error_code == "auth/weak-password") {
        //         alert("this password is too weak");
        //     } else {
        //         alert(errorMessage);
        //     }
        //     console.log(error);

        // });
    }
}