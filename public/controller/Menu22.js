function create() {
    window.location.href = "../admin/addListVotes.html";
}

function Add_User() {
    window.location.href = "../admin/Userpages.html";
}


function view() {

    window.location.href = "../admin/ManageScores.html";

}

function viewScore() {
    window.location.href = "../admin/scorePage.html"
}

function logout1() {
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
                window.location.href = "../index.html"
            }).catch(function (error) {
                // An error happened.
                console.log(error.message);
            });
        }
    });

}
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