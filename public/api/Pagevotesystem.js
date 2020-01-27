function show_data() {
    var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list");
    firebaseRef.on("child_added", (snapshot) => {
        var k = 0;
        var data = snapshot.val();
        var key = snapshot.key;
        document.getElementById("data").innerHTML += ` 
        <tbody>
            <tr>
            <th style="text-align:center;" id="nametable">${k+=1}</th>
            <td><img src="${data.img_url}" class="picture"></td>
            <td id="nametable"><h3>${data.name} ${data.lastname}</h3></td>
            <td id="nametable">${data.position}</td>
                    <td id="nametable" style="color:blue;"><h2>${data.score}</h2></td>
                    <td style="padding-top:3%;">
                    <button id="${key}" onclick="Update_score(id)" class="btn btn-success" style="font-family:lao notisan; margin-top:10px;padding-left:20px;padding-right:20px">ເພີ່ມ</button>
                    <button id="${key}" onclick="down_score(id)" class="btn btn-warning" style="font-family:lao notisan; margin-top:10px;padding-left:10px;padding-right:10px">ຫຼຸດ</button>
                    <button id="${key}" onclick="deleteData(id)" class="btn btn-danger" style="font-family:lao notisan; margin-top:10px;padding-left:10px;padding-right:10px">ລົບລາຍການ</button>                       
                    </td>
            </tr>
        </tbody>`
    });
    firebaseRef.on("child_changed", (snapshot) => {
        var k = 0;
        var data = snapshot.val();
        var key = snapshot.key;
        document.getElementById("data").innerHTML += ` 
        <tbody>
            <tr>
            <th style="text-align:center;" id="nametable">${k+=1}</th>
            <td><img src="${data.img_url}" class="picture"></td>
            <td id="nametable"><h3>${data.name} ${data.lastname}</h3></td>
            <td id="nametable">${data.position}</td>
                    <td id="nametable" style="color:blue;"><h2>${data.score}</h2></td>
                    <td style="padding-top:3%;">
                    <button id="${key}" onclick="Update_score(id)" class="btn btn-success" style="font-family:lao notisan; margin-top:10px;padding-left:20px;padding-right:20px">ເພີ່ມ</button>
                    <button id="${key}" onclick="down_score(id)" class="btn btn-warning" style="font-family:lao notisan; margin-top:10px;padding-left:10px;padding-right:10px">ຫຼຸດ</button>
                    <button id="${key}" onclick="deleteData(id)" class="btn btn-danger" style="font-family:lao notisan; margin-top:10px;padding-left:10px;padding-right:10px">ລົບລາຍການ</button>                       
                    </td>
            </tr>
        </tbody>`
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
    var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list" + "/" + key);
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
    get_score(id);
}

function get_score_down(id, current_score) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("vote_on_system/user_list");
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

function get_score(id) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var uid = user.uid;
            var firebaseRef = firebase.database().ref("vote_on_system/user_list");
            firebaseRef.once("value", function (snapshot) {
                var current_score = snapshot.child(id).val().score;
                var name = snapshot.child(id).val().name;
                var lastname = snapshot.child(id).val().lastname;
                var position = snapshot.child(id).val().position;
                var img_url = snapshot.child(id).val().img_url;
                var phone = snapshot.child(id).val().phone;
                var email = snapshot.child(id).val().email;
                var branch = snapshot.child(id).val().branch;
                update_data(id, current_score, name, lastname, position, img_url, phone, email, branch);
            }, function (error) {
                console.log("Error: " + error.code);
            });
        }
    });
}

function update_data_down(id, current_score) {
    var update_score = current_score - 1;
    var update = {
        score: update_score,
    };
    var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list" + "/" + id);
    firebaseRef.update(update);
    document.getElementById("alert").hidden = false;
    window.location.reload();
}

function update_data(id, current_score, name, lastname, position, img_url, phone, email, branch) {
    var update_score = current_score + 1;
    // var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list");
    // firebaseRef.push({
    //     name: name,
    //     lastname: lastname,
    //     position: position,
    //     img_url: img_url,
    //     phone: phone,
    //     email: email,
    //     branch: branch,
    //     score: update_score,
    // });
    var update = {
        score: update_score,
    };
    var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list" + "/" + id);
    firebaseRef.update(update);
    // var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list" + "/" + id);
    // firebaseRef.remove();
    document.getElementById("alert").hidden = false;
    // document.getElementById("data1").hidden = false;
    // document.getElementById("data").hidden = true;


    // window.location.reload();
}

function menu() {
    window.location.href = "../admin/menu.html"
}

function deleteData(key) {
    var firebaseRef = firebase.database().ref("vote_on_system" + "/" + "user_list" + "/" + key);
    firebaseRef.remove().then(function () {
        location.reload();
        document.getElementById("alert1").hidden = false;
    }).catch(function (error) {
        console.log(error.message);
    });
}

function addvote() {
    window.location.href = "../admin/addvotesystem.html"
}