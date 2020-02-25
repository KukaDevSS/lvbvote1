window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.href = "../../index.html";
        } else {}
    });
}
var app = new Vue({
    el: '#data',
    data: {
        values: [],
    },
    created() {
        const values = firebase.database().ref("user_vote" + "/" + "user_list").orderByChild('score');
        values.on("child_added", snapshot => {
            this.values.push(snapshot.val());
            // this.val = snapshot.val().score
        });
        values.on("child_changed", () => {
            this.values = [];
            values.on("child_added", snapshot => {
                this.values.push(snapshot.val());
            });
        });
    },
    methods: {
        delete: function () {

        }
    },

})

function updateData() {
    window.location.reload();
}

function logout1() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var uid = user.uid;
            var paths = firebase.database().ref("All_user_added" + "/" + "user_list");
            paths.once("value", (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    var key = childSnapshot.key;
                    var childdata = childSnapshot.val();
                    if (childdata.email == email) {
                        var statuspath = firebase.database().ref("All_user_added" + "/" + "user_list" + "/" + key);
                        statuspath.update({
                            status: false,
                        });
                    }
                });
            }).then(() => {
                firebase.auth().signOut().then(function () {
                    window.location.href = "../../index.html"
                }).catch(function (error) {
                    console.log(error.message);
                });
            });;
        }
    });

}