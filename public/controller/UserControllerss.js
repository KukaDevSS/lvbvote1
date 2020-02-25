function addUser() {
    window.location.href = "../admin/addUser.html"
}

function viewUser() {
    window.location.href = "../admin/AllUserSystem.html"
}

function menu() {
    window.location.href = "../admin/Main_menu.html"
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