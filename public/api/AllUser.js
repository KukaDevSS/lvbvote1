function show_data() {
    var firebaseRef = firebase.database().ref("All_user_added" + "/" + "user_list");
    var count = 0;
    firebaseRef.once("value", function (snapshot) {
        snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childdata = childSnapshot.val();
            var status = childdata.status;
            var vote = childdata.vote;
            if (status == true) {
                status = "ເຂົ້າໃຊ້ລະບົບ";
            } else {
                status = "ບໍ່ເຂົ້າໃຊ້ລະບົບ";
            }

            if (vote == true) {
                vote = "ໂຫວດຮຽບຮ້ອຍແລ້ວ";
            } else {
                vote = "ບໍ່ໂຫວດ"
            }
            count += 1;
            document.getElementById("data").innerHTML += ` 
            <tbody>
                <tr>
                <td>${count}</td>
                <td>${childdata.email}</td>
                <td>${childdata.pass}</td>
                <td>${status}</td>
                <td>${vote}</td>
                </tr>
            </tbody>`

        });
    }, function (error) {
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

function menu() {
    window.location.href = "../admin/menu.html"
}