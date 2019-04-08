function populate() {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDd6LhTpxM1CLYJyW3AFXVqTbGifAp1t3w",
        authDomain: "train-schedule-77c89.firebaseapp.com",
        databaseURL: "https://train-schedule-77c89.firebaseio.com",
        projectId: "train-schedule-77c89",
        storageBucket: "train-schedule-77c89.appspot.com",
        messagingSenderId: "1009544627581"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database
    var database = firebase.database();

    // Initial Values
    var train = "";
    var destination = "";
    var time = 0;
    var freq = "";

    // Capture Button Click
    $("#submitBtn").on("click", function (event) {
        // Don't refresh the page!
        event.preventDefault();

        // Don't forget to provide initial data to your Firebase database.
        train = $("#input-name").val().trim();
        destination = $("#input-dest").val().trim();
        time = $("#input-time").val().trim();
        freq = $("#input-frequency").val().trim();
        database.ref().push({
            train: train,
            destination: destination,
            time: time,
            freq: freq
        });

    });

    database.ref().on("child_added", function (childSnapshot) {
        snap = childSnapshot.val()
        // Log everything that's coming out of snapshot
        // console.log(childSnapshot.val().train);
        // console.log(childSnapshot.val().destination);
        // console.log(childSnapshot.val().time);
        // console.log(childSnapshot.val().freq);

        // full list of trains
        const trnName = "<td>" + snap.train + "</td>"
        const dest = "<td>" + snap.destination + "</td>"
        const freq = "<td>" + snap.freq + "</td>"     
        const minsToNext = nextTrain(snap.time, snap.freq);
        const minsFormat = moment(minsToNext, "mm");
        const minsField = "<td>"+minsToNext+"</td>";
        // const next = "<td>"+ nextTrain(moment().add(minsToNext, 'minutes'))+"</td>";
        const next = "<td></td>";

        $("tbody").append("<tr>" + trnName + dest + freq + next + minsField + "</tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#name-display").text(snapshot.val().train);
        $("#email-display").text(snapshot.val().email);
        $("#age-display").text(snapshot.val().age);
        $("#comment-display").text(snapshot.val().comment);
    });

    // Calculate time until next train

    function nextTrain(start, freq) {
        var now = moment().format("HH:mm");
        var frequency = moment(freq, "minutes");
        var began = moment(start, "HH:mm").subtract(1, "weeks");
        console.log(now);
        console.log("start = " + began);
        var diff = moment().diff(moment(began), "minutes");
        console.log("diff "+ diff);
        var mstRecent = diff % freq;
        console.log(moment(mstRecent, "minutes"));
        var next = freq - mstRecent;
        console.log(moment(next) + " until next");
        // var nextMins = moment(next, "HH:mm");
        var timeDue = moment().add(next, "minutes");
        console.log("********");
        return(next, timeDue);
    };

}