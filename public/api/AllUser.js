var app = new Vue({
    el: '#tabel',
    data: {
        values: [],
    },
    created() {
        const values = firebase.database().ref("All_user_added" + "/" + "user_list").orderByChild('score');
        values.on("child_added", snapshot => {
            var status = snapshot.val().status;
            var vote = snapshot.val().vote;
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
            this.values.push({
                ...snapshot.val(),
                status: status,
                vote: vote
            });
        });
        values.on("child_changed", () => {
            this.values = [];
            values.on("child_added", snapshot => {
                var status = snapshot.val().status;
                var vote = snapshot.val().vote;
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
                this.values.push({
                    ...snapshot.val(),
                    status: status,
                    vote: vote
                });
            });
        });

    },

})

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
    window.location.href = "../admin/Main_menu.html"
}