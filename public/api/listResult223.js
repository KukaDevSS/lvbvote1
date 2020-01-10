function show_data() {
    var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("score");
    firebaseRef.on("value", function (snapshot) {
            var k = 0;
            var totalScore = [];
            snapshot.forEach((childSnapshot) => {
                var key = childSnapshot.key;
                var childdata = childSnapshot.val();
                totalScore.push(childdata.score);
                document.getElementById("data").innerHTML += ` 
            <tbody>
                <tr>
                <th style="text-align:center;" id="nametable">${k+=1}</th>
                <td><img src="${childdata.img_url}" class="picture"></td>
                <td id="nametable"><h3>${childdata.name} ${childdata.lastname}</h3></td>
                <td id="nametable">${childdata.position}</td>
                         <td id="nametable">${childdata.branch}</td>
                        <td id="nametable" style="color:blue;"><h2>${childdata.score}</h2></td>
                        <td style="padding-top:4%;">
                        <button id="${key}" onclick="Update_score(id)" class="btn btn-success" style="font-family:lao notisan; margin-top:10px;padding-left:20px;padding-right:20px">ເພີ່ມຄະແນນ</button>
                        <button id="${key}" onclick="down_score(id)" class="btn btn-danger" style="font-family:lao notisan; margin-top:10px;padding-left:10px;padding-right:10px">ຫຼຸດຄະແນນ</button>
                        </td>
                </tr>
            </tbody>`
            });
        },
        function (error) {
            console.log("Error: " + error.code);
        });
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
    show_data();
}

function deleteData(key) {
    var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + key);
    firebaseRef.remove().then(function () {
        console.log("delete success");
        location.reload();
    }).catch(function (error) {
        console.log(error.message);
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
                console.log(error.message);
            });
        }
    });
}

function down_score(id) {
    var current_score;
    get_score_down(id, current_score);
}

function Update_score(id) {
    var current_score;
    get_score(id, current_score);
}

function get_score_down(id, current_score) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("user_vote/user_list");
            firebaseRef.once("value", function (snapshot) {
                current_score = snapshot.child(id).val().score;
                update_data_down(id, current_score);
                // console.log(current_score);
            }, function (error) {
                console.log("Error: " + error.code);
            });
        }
    });
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
                // console.log(current_score);
            }, function (error) {
                console.log("Error: " + error.code);
            });
        }
    });
}

function update_data_down(id, current_score) {
    var update_score = current_score;
    update_score = current_score - 1;
    var update = {
        score: update_score,
    };
    var firebaseRef = firebase.database().ref("user_vote" + "/" + "user_list" + "/" + id);
    firebaseRef.update(update);
    document.getElementById("alert").hidden = false;
    window.location.reload();
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
    window.location.reload();
}