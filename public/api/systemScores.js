var app = new Vue({
    el: '#table',
    data: {
        values: [],
        score: [],
        rankss: []
    },
    created() {
        const values = firebase.database().ref("vote_on_system" + "/" + "user_list").orderByChild('score');
        values.on("child_added", snapshot => {
            this.values.push(snapshot.val());
            this.score.push(
                snapshot.val().score,
            );
        });

        values.on("child_changed", () => {
            this.values = [];
            this.score = [];
            values.on("child_added", snapshot => {
                this.values.push(snapshot.val());
                this.score.push(
                    snapshot.val().score,
                );
            });
        });
    },
    methods: {
        sortArrays(values) {
            return values.slice().sort(function (a, b) {
                return a.phone - b.phone;
            });
        },
        sortArrays1(score) {
            var d = this.score.slice().sort(function (a, b) {
                return b - a;
            });
            // console.log(score);
            var ranks = d.indexOf(score);
            return ranks + 1;
        },


    },

})

function menu() {
    window.location.href = "../admin/Main_menu.html"
}
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