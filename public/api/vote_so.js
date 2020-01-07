window.onload = function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            var uid = user.uid;
            console.log(uid);
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
        }
    });
    show_data();
    var user_login = firebase.database().ref("user_login" + "/" + uid).set({
        email: email,
        status: true,
    })
}

function vote(id) {
    var current_score;
    // document.getElementsByName("")
    get_score(id, current_score);
}

function update_data(id, name, lastname, position, current_score, email, uid) {
    var update_score = current_score;
    update_score = current_score - 1;
    var update = {
        score: update_score,
        name: name,
        lastname: lastname,
        position: position,
    };
    var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + id);
    firebaseRef.set(update);

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
    window.location.href = "./success_vote.html";

}

function show_data() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("id");
            firebaseRef.once("value", function (snapshot) {
                snapshot.forEach((childSnapshot) => {
                    var key = childSnapshot.key;
                    var childdata = childSnapshot.val();
                    document.getElementById("card").innerHTML += `<div class="col"> <div class="card" style="width: 18rem;">
                                <img class="card-img-top" src="" alt="Card image cap">
                                <div class="card-body">
                                    <h5>${childdata.name}</h5>
                                    <p>${childdata.position}</p>
                                    <p>${childdata.score}</p>
                                    <img src="${childdata.img_url}">
                                <button class="btn btn-success" name="button_vote" id="${key}" onclick="vote(id)">vote</button>
                                </div>
                            </div> 
                            </div>`

                });

            }, function (error) {
                console.log("Error: " + error.code);
            });
        }
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
                var name = snapshot.child(id).val().name;
                var lastname = snapshot.child(id).val().lastname;
                var position = snapshot.child(id).val().position;
                current_score = snapshot.child(id).val().score;
                update_data(id, name, lastname, position, current_score, email, uid);
            }, function (error) {
                console.log("Error: " + error.code);
            });
        } else {
            // User is signed out.

        }
    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = "../../index.html"
    }).catch(function (error) {
        // An error happened.
    });
}