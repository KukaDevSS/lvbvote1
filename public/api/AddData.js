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
}

var picture = document.getElementById("picture");
var file;
picture.addEventListener('change', function (e) {
    var file = e.target.files[0];
    var fileName = file.name;
    firebaseRef = firebase.storage().ref("picture" + "/" + fileName);
    var task = firebaseRef.put(file);
    task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("progress").style.width = percentage + "%";

    }, function error(err) {
        console.log(e.message);
    }, function complete() {
        console.log("success");
        var Download_URL = firebase.storage().ref("picture" + "/" + fileName);
        var url;
        Download_URL.getDownloadURL().then(function (url) {
            // fileName = fileName.split(".");
            // var insert_img_url = firebase.database().ref("VotePicture" + "/" + fileName[0]);
            // // insert_img_url.set({
            // //     fileName: fileName[0],
            // //     url: url,
            // // })
            console.log(url);

            add_to_firebase(url);
            // console.log(url);
        }).catch(function (error) {
            console.log(error.message);
        })
    });

});

// function add_to_firebase1() {
//     var name = document.getElementById("name").value;
//     var lastname = document.getElementById("lastname").value;
//     var position = document.getElementById("position").value;
//     var score = document.getElementById("score").value;
//     var email = document.getElementById("email").value;
//     var phone = document.getElementById("phone").value;
//     var branch = document.getElementById("branch").value;
//     var picture = document.getElementById("picture").value;
//     if (picture == "" || name == "" || lastname == "" || position == "" || score == "" || email == "" || phone == "" || branch == "") {
//         alert("ກະລູນາປ້ອນຊໍ້ມູນໃຫ່ຄົບຖ້ວນ");
//         return;
//     }
// }

function add_to_firebase(url) {
    var img_url = url;
    var name = document.getElementById("name").value;
    var lastname = document.getElementById("lastname").value;
    var position = document.getElementById("position").value;
    var score = document.getElementById("score").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var branch = document.getElementById("branch").value;
    if (img_url == "" || name == "" || lastname == "" || position == "" || score == "" || email == "" || phone == "" || branch == "") {
        alert("ກະລູນາປ້ອນຊໍ້ມູນໃຫ່ຄົບຖ້ວນ");
        return;
    } else {
        insert_data(name, lastname, position, score, email, phone, branch, img_url);
    }


}

function edit_database() {
    console.log(id);

}

function insert_data(name, lastname, position, score, email, phone, branch, img_url) {
    var add_to_list = {
        name: name,
        lastname: lastname,
        position: position,
        score: score,
        email: email,
        phone: phone,
        branch: branch,
        img_url: img_url,
    }
    firebase.database().ref("user_vote" + "/" + "user_list").push(add_to_list).then(function () {
        console.log("success insert to firebase");
        window.location.href = "../admin/ListViewVote.html"
    }).catch(function (error) {
        console.log(error.message);
    });
}

function view_vote_list() {
    window.location.href = "../test.html";
}


function view_list() {
    window.location.href = "../admin/ListViewVote.html";
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