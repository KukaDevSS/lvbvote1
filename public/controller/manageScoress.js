function menu() {
    window.location.href = "../admin/Main_menu.html"
}

function onlineManagement() {
    window.location.href = "../admin/ListResult.html"
}

function systemvote() {
    window.location.href = "../admin/managevote.html"
}

function listVote() {
    window.location.href = "../admin/AllVote.html"
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