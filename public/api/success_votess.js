window.onload = function () {
    var userName = "Shekhar Shete";
    '<%Session["UserName"] = "' + userName + '"; %>';
    // alert('<%=Session["UserName"] %>');
    var session = document.getElementById("hdnSession").value;
    // alert(session);

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("Voted_user" + "/" + uid);
            var time = new Date();
            var today = time.getDate();
            var status = 1;
            firebaseRef.set({
                uid: uid,
                email: email,
                today: today,
                status: status
            });
        } else {
            window.location.href = "../../index.html";
        }
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
                // An error happened.
                console.log(error.message);

            });
        }
    });

}

function ViewResult() {
    window.location.href = "../user/showvote.html";
}