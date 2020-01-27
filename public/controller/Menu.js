function create() {
    window.location.href = "../admin/addListVote.html";
}

function Add_User() {
    window.location.href = "../admin/Userpage.html";
}


function view() {

    window.location.href = "../admin/managescore.html";

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