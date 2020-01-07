window.onload = function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            var uid = user.uid;
            var login_user = firebase.database().ref("Login_user" + "/" + uid);
            login_user.set({
                email: email,
                uid: uid,
                status: true
            });
            var ref = firebase.database().ref("Voted_user");
            ref.orderByKey().on("child_added", function (snapshot) {
                if (uid == snapshot.key) {
                    var firebaseRef = firebase.database().ref("Voted_user");
                    firebaseRef.on("value", function (snapshot) {
                        var uid_voted = snapshot.child(uid).val().uid;
                        var date_voted = snapshot.child(uid).val().today;
                        var status = snapshot.child(uid).val().status;
                        var time = new Date();
                        var today = time.getDate();
                        if (date_voted == today && uid == uid_voted && status == 1) {
                            window.location.href = "../user/success_vote.html";
                        }
                    });
                } else {
                    window.location.href = "../user/VoteData.html";
                }
            })
        }
    });
}