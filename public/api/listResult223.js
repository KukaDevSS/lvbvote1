var app = new Vue({
    el: '#table',
    data: {
        values: [],
    },
    created() {
        const paths = firebase.database().ref("user_vote" + "/" + "user_list").orderByChild('score');
        paths.on("child_added", snapshot => {
            this.values.push({
                ...snapshot.val(),
                id: snapshot.key
            });
        });
        paths.on("child_changed", () => {
            this.values = [];
            paths.on("child_added", snapshot => {
                this.values.push({
                    ...snapshot.val(),
                    id: snapshot.key
                });
            });
        });
        paths.on("child_removed", () => {
            this.values = [];
            paths.on("child_added", snapshot => {
                this.values.push({
                    ...snapshot.val(),
                    id: snapshot.key
                });
            });
        })
    },
    methods: {
        Update_score: function (id, score) {
            var paths = firebase.database().ref("user_vote" + "/" + "user_list");
            paths.child(id).update({
                score: score + 1,
            });
        },
        down_score: function (id, score) {
            var paths = firebase.database().ref("user_vote" + "/" + "user_list");
            paths.child(id).update({
                score: score - 1,
            });
        },

        deleteData: function (id) {
            var paths = firebase.database().ref("user_vote" + "/" + "user_list");
            paths.child(id).remove();
        }
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