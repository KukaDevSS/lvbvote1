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
                        if (date_voted == today && uid == uid_voted && status == 1) {
                            // alert("voted user")
                            window.location.href = "../user/success_vote.html";
                        }
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

//set score from user
function update_data(id, current_score, email, uid) {
    var update_score = current_score;
    update_score = current_score + 1;
    var update = {
        score: update_score,
    };
    var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + id);
    firebaseRef.update(update);

    document.getElementById(id).disabled = true;

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
                            // pass: pass,
                            status: true,
                            vote: true,
                        });
                    }
                });
            }).then(() => {
                window.location.href = "./success_vote.html";
            });;
        }
    });

    //insert data time vote of user voted
    var time = new Date();
    var date = time.getDate();
    var timeH = time.getHours();
    var timeM = time.getMinutes();
    var firebaseRef = firebase.database().ref("All_vote" + "/" + "user" + "/" + uid).set({
        email: email,
        uid: uid,
        date: date,
        timeH: timeH,
        timeM: timeM,
    });
    // var get_voted = document.getElementById("vote_status").value;
}

//show list for vote
function show_data() {
    var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("score");
    firebaseRef.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childdata = childSnapshot.val();
            document.getElementById("showVote").innerHTML += ` 
                    <div class="col-sm-4" style="padding-left:4%;padding-right:4%;padding-top:4%;">
                    <div class="card card-cascade">
                        <div class="view view-cascade overlay">
                            <img class="card-img-top" src="${childdata.img_url}"
                                alt="Card image cap">
                        </div>
        
                        <div class="card-body card-body-cascade text-center">
                            <h4 class="card-title" style="font-family:lao notisan;"><strong>${childdata.name + " "+ childdata.lastname}</strong></h4>
                            <h6 class="font-weight-bold indigo-text py-2" style="font-family:lao notisan;">ຕໍ່າແໜ່ງ: ${childdata.position} </h6>
                            <h6 class="font-weight-bold indigo-text py-2" style="font-family:lao notisan;">ສາຂາ: ${childdata.branch} </h6>
                           
                            
                            <button id="${key}" onclick="vote(id)" style="font-family: lao notisan; padding: 12px;padding-left: 25px;padding-right:25px;"
                                class="btn btn-primary">ກົດປຸ່ມເພື່ອໂຫວດ</button>
        
                        </div>
        
                    </div>
                </div>`
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });
    // }
    // });
}
//end of show list vote


//get last score for set new score
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
//end


//logout
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