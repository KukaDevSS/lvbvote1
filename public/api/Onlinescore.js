var app = new Vue({
    el: '#table',
    data: {
        values: [],
    },
    created() {
        const values = firebase.database().ref("user_vote" + "/" + "user_list").orderByChild('score');
        values.on("child_added", snapshot => {
            this.values.push(snapshot.val());
        });

    },

})

function menu() {
    window.location.href = "../admin/menu.html"
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
}