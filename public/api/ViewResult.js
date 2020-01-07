var firebaseRef = firebase.database().ref("user_vote/user_list");
var showRealtime = function () {
    firebaseRef.once("value", function (snapshot) {
        snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childdata = childSnapshot.val();
            var time = new Date();
            var h = time.getHours()
            var m = time.getMinutes();

            document.getElementById("showVote").innerHTML += ` 
      
            <div class="col-sm-4" id="card" style="padding-left:4%;padding-right:4%;padding-top:1%;">
            <div class="card card-cascade">
                <div class="view view-cascade overlay">
                    <img class="card-img-top" src="${childdata.img_url}"
                        alt="Card image cap">
                </div>

                <div class="card-body card-body-cascade text-center" >
                    <h4 class="card-title" style="font-family:lao notisan;"><strong>${childdata.name + " "+ childdata.lastname}</strong></h4>
                    <h6 class="font-weight-bold indigo-text py-2" style="font-family:lao notisan;">ຕໍ່າແໜ່ງ: ${childdata.position} </h6>
                    <h6 class="font-weight-bold indigo-text py-2" style="font-family:lao notisan;">ສາຂາ: ${childdata.branch} </h6>
                    <h5>ຄະແນນ: ${childdata.score}</h5>
                    <button id="${key}" onclick="Update_score(id)" class="btn btn-success" style="font-family:lao notisan; margin-top:10px;padding-left:20px;padding-right:20px">ໂຫວດ</button>
                </div>
                <div class="card-footer">
                     <small class="text-muted" style="font-family:lao notisan;">ອັບເດດລ່າສຸດ ${h}:${m}</small>
                </div>

            </div>
        </div>`
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });
}

window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var password = user.password;
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
    showRealtime();
}

function Update_score(id) {
    var current_score;
    get_score(id, current_score);
}

function get_score(id, current_score) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("user_vote/user_list");
            firebaseRef.once("value", function (snapshot) {
                current_score = snapshot.child(id).val().score;
                update_data(id, current_score);
                console.log(current_score);
            }, function (error) {
                console.log("Error: " + error.code);
            });
        }
    });
}

function update_data(id, current_score) {
    var update_score = current_score;
    update_score = current_score + 1;
    var update = {
        score: update_score,
    };
    var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + id);
    firebaseRef.update(update);
    document.getElementById("alert").hidden = false;
    // 1,000 means 1 second.
    cinterval = setInterval('countdown_timer()', 1000);
}

var max_time = 2;
var cinterval;

function countdown_timer() {
    // decrease timer
    max_time--;
    // document.getElementById('countdown').innerHTML = max_time;
    if (max_time == 0) {
        clearInterval(cinterval);
        document.getElementById("alert").hidden = true;
        max_time = 2;
        window.location.reload();
    }
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
            console.log(email);

            firebase.auth().signOut().then(function () {
                window.location.href = "../../index.html"
            }).catch(function (error) {
                // An error happened.
                console.log(error.message);

            });
        }
    });
}