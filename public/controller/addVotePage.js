function addOnline() {
    window.location.href = "../admin/addDataOnline.html"
}

function addIncrease() {
    window.location.href = "../admin/addVoteSystem.html"
}


function menu() {
    window.location.href = "../admin/menu.html"
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
                window.location.href = "../../index.html"
            }).catch(function (error) {
                // An error happened.
                console.log(error.message);
            });
        }
    });

}