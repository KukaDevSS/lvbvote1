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
                <td id="nametable">${childdata.name + childdata.lastname}</td>
                <td id="nametable">${childdata.position}</td>
                         <td id="nametable">${childdata.branch}</td>
                         <td id="nametable">${childdata.email}</td>
                        <td id="nametable">${childdata.phone}</td>
                        <td id="nametable" style="color:blue;">${childdata.score}</td>
                        <td style="padding-top:4%;">
                            <button id="${key}" onclick="deleteData(id)" class="btn btn-danger" style="font-family:lao notisan; margin-top:10px;padding-left:20px;padding-right:20px">ລົບລາຍການ</button>
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