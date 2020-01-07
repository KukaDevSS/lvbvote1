function show_data() {
    var firebaseRef = firebase.database().ref("Login_user");
    var count = 0;
    firebaseRef.once("value", function (snapshot) {
        snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childdata = childSnapshot.val();
            count += 1;
            var status = childdata.status;
            if (status == true) {
                status = "ເຂົ້າໃຊ້ລະບົບ";
            } else {
                status = "ອອກຈາກລະບົບ";
            }
            document.getElementById("data").innerHTML += ` 
            <tbody>
                <tr>
                <th>${count}</th>
                <td>${childdata.uid}</td>
                <td>${childdata.email}</td>
                <td>${status}</td>
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