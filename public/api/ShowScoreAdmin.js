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
    loadData();
}

function loadData() {
    var firebaseRef = firebase.database().ref("user_vote/user_list").orderByChild("score");
    firebaseRef.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childdata = childSnapshot.val();
            document.getElementById("card").innerHTML += `
            <div class="col-sm-4">
                <div class="card">
                    <div class="card-body">
                        <img src="${childdata.img_url}"
                            style="width: 100%;height:280px;border-radius: 8px;">
                        <h5 class="card-title" style="padding-top: 15px;">${childdata.name + childdata.lastname}</h5>
                        <h5 class="card-title" style="padding-top: 15px;">ຕ່ຳແໜ່ງ: ${childdata.position}</h5>                       
                        <p class="card-text">ສາຂາ: ${childdata.branch}</p>
                        <a style="color:white; padding-top:12px;" class="btn btn-primary"><h5>ຄະແນນໂຫວດ: ${childdata.score}</h5> </a>
                    </div>
                </div>
            </div>
            `;
        });
    });
}

function updateData() {
    window.location.reload();
}

function logout1() {
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
                // An error happened.
                console.log(error.message);
            });
        }
    });

}