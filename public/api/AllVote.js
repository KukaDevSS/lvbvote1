var app = new Vue({
    el: '#table',
    data: {
        values: [],
    },
    created() {
        const paths = firebase.database().ref("vote_on_system" + "/" + "user_list");
        paths.on("child_added", snapshot => {
            this.values.push({
                ...snapshot.val(),
                id: snapshot.key
            });
        });
    },
    methods: {
        sortArrays(values) {
            return values.slice().sort(function (a, b) {
                return a.phone - b.phone;
            });
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