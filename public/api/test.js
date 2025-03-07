window.onload = function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            var uid = user.uid;
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
                        // console.log(status);
                        // if (date_voted == today && uid == uid_voted && status == 1) {
                        //     // alert("voted user")
                        //     window.location.href = "../user/success_vote.html";
                        // }
                    });
                }
            })
        } else {
            window.location.href = "../../index.html";
        }
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            show_data();
            checkvote()
            var user_login = firebase.database().ref("user_login").set({
                email: email,
                status: true,
            });
        }
    });
}

function vote(id) {
    var current_score;
    get_score(id, current_score);
}

function checkvote() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var uid = user.uid;
            // console.log(uid);
            var firebaseRef = firebase.database().ref("CheckVote");
            firebaseRef.once("value", (snapshot) => {
                // console.log(snapshot.child(uid).val());
                var id = snapshot.child(uid).val().lastvote_id;
                document.getElementById(id).disabled = true;
            });
        }
    })
}


function update_data(id, current_score, email, uid) {
    var update_score = current_score;
    //check last vote
    var checklast = firebase.database().ref("CheckVote");
    checklast.once("value", (snapshot) => {
        var count = 0;
        snapshot.forEach((data) => {
            var key = data.key;
            var value = data.val();
            //check voteted
            if (key != uid) {
                count = count + 1;
            }
            if (count > 0) {
                var checkVote = firebase.database().ref("CheckVote" + "/" + uid);
                checkVote.set({
                    lastvote_id: id,
                    email: email,
                    uid: uid
                });
                var update_score = current_score + 1;
                var update = {
                    score: update_score,
                };
                var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + id);
                firebaseRef.update(update);
                document.getElementById(id).disabled = true;
                document.getElementById("alert").hidden = false;
                document.getElementById("view").disabled = false;
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        var email1 = user.email;
                        var paths = firebase.database().ref("All_user_added" + "/" + "user_list");
                        paths.once("value", function (snapshot) {
                            snapshot.forEach((childSnapshot) => {
                                var key = childSnapshot.key;
                                var childdata = childSnapshot.val();
                                if (childdata.email == email1) {
                                    var statuspath = firebase.database().ref("All_user_added" + "/" + "user_list" + "/" + key);
                                    statuspath.set({
                                        email: email1,
                                        status: true,
                                        vote: true,
                                    });
                                }
                            });
                        }).then(() => {
                            // window.location.href = "./showvote.html";
                        });;
                    }
                });
            }
            if (key == uid && value.lastvote_id != id) {
                //get old vote score & delete old score
                var old_score;
                var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("id");
                firebaseRef.once("value", function (snapshot) {
                    old_score = snapshot.child(value.lastvote_id).val().score;
                    console.log("this is: old scorea:  " + old_score);
                    var update_score = old_score - 1;
                    var update = {
                        score: update_score,
                    };
                    var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + value.lastvote_id);
                    firebaseRef.update(update);
                }, function (error) {
                    console.log("Error: " + error.code);
                });

                //end of eoldscore

                //updatenewScore
                var update_score = current_score + 1;
                var update = {
                    score: update_score,
                };
                var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + id);
                firebaseRef.update(update);
                var checkVote = firebase.database().ref("CheckVote" + "/" + uid);
                checkVote.set({
                    lastvote_id: id,
                    email: email,
                    uid: uid,
                    vote: true,
                });
                //end of update new score

                // update status of vote
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        var email1 = user.email;
                        // var pass = user.pass;
                        var paths = firebase.database().ref("All_user_added" + "/" + "user_list");
                        paths.once("value", function (snapshot) {
                            snapshot.forEach((childSnapshot) => {
                                var key = childSnapshot.key;
                                var childdata = childSnapshot.val();
                                if (childdata.email == email) {
                                    var statuspath = firebase.database().ref("All_user_added" + "/" + "user_list" + "/" + key);
                                    statuspath.set({
                                        email: email1,
                                        status: true,
                                        vote: true,
                                    });
                                }
                            });
                        }).then(() => {
                            // window.location.href = "./showvote.html";
                        });;
                    }
                });
                //end of vote score
            }

        });
    })

}


function show_data() {
    var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("score");
    firebaseRef.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childdata = childSnapshot.val();
            document.getElementById("showVote").innerHTML += `
            <div class="col-sm-4"style="padding-left:4%;padding-right:4%;padding-top:1%;">
                <div class="card">
                    <div class="card-body card-body-cascade text-center" >
                        <img src="${childdata.img_url}"
                            style="width: 100%;height:280px;border-radius: 4px;">
                            <h4 class="card-title" style="font-family:lao notisan; padding-top: 15px;color:#1976d2;"><strong>${childdata.name + " "+ childdata.lastname}</strong></h4>
                                        <h6 class="font-weight-bold indigo-text py-2" style="font-family:lao notisan;">ຕໍ່າແໜ່ງ: ${childdata.position} </h6>
                                        <h6 class="font-weight-bold indigo-text py-2" style="font-family:lao notisan;">ສາຂາ: ${childdata.branch} </h6>
                                        <button id="${key}" onclick="vote(id)" style="font-family: lao notisan; padding: 12px;padding-left: 25px;padding-right:25px;"
                                        class="btn btn-primary">ກົດປຸ່ມເພື່ອໂຫວດ</button>
                    </div>
                </div>
            </div>`;
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

function get_score(id, current_score) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("id");
            firebaseRef.once("value", function (snapshot) {
                current_score = snapshot.child(id).val().score;
                update_data(id, current_score, email, uid);
            }, function (error) {
                console.log("Error: " + error.code);
            });
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

function score() {
    window.location.href = "../user/showvote.html"
}