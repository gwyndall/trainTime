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

        // Provide input data to Firebase database.
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

    // Create new entry for each train in database to table

    database.ref().on("child_added", function (childSnapshot) {
        snap = childSnapshot.val()

        const trnName = `<td> ${snap.train} </td>`
        const dest = `<td> ${snap.destination} </td>`
        const freq = `<td> ${snap.freq} </td>`

        // Calculate how many minutes until next train is due
        const minsToNext = nextTrain(snap.time, snap.freq);
        const minsField = `<td> ${minsToNext} </td>`;

        // Calculate and format time next train is due
        const nextDue = incoming(minsToNext);
        const nextDueForm = moment(nextDue).format("HH:mm");
        const timeDue = "<td>" + nextDueForm + "</td>";
        $("tbody").append(`<tr> ${trnName + dest + freq + timeDue + minsField} </tr>`);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


    // Calculate minutes until next train

    function nextTrain(start, freq) {
        // Set train start date a week in the past
        var began = moment(start, "HH:mm").subtract(1, "weeks");
        // Find difference between train start and now
        var diff = moment().diff(moment(began), "minutes");
        // Calculate remainder of difference divided by frequency
        var mstRecent = diff % freq;
        // Calculate minutes until next train 
        var next = freq - mstRecent;

        return next;
    };

    // Calculate time of next train
    function incoming(next) {
        var timeDue = moment().add(next, "minutes");

        return timeDue;
    }

}