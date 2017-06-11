// Initialize Firebase
var config = {
  apiKey: "AIzaSyCGfU61azB0sJ91HbaKja7-jwXWauH7VKQ",
  authDomain: "train-scheduler-6ca04.firebaseapp.com",
  databaseURL: "https://train-scheduler-6ca04.firebaseio.com",
  projectId: "train-scheduler-6ca04",
  storageBucket: "train-scheduler-6ca04.appspot.com",
  messagingSenderId: "166740831409"
};

firebase.initializeApp(config);

//-----Global Variables----

var database = firebase.database();
var trainName = "";
var destination = "";
var time = 0;
var trainFrequency = 0;

//---Functions Go Here---------


//---On the click submit button event
$("#submit-train").on("click", function(event){
    //--prevent form from submitting
    event.preventDefault();
    //--get input values
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    time = $("#first-train-time").val().trim();
    trainFrequency = $("#frequency").val().trim(); 

    //--populate database with the value submitted
    database.ref().push({
        trainName: trainName,
        destination: destination,
        time: time,
        trainFrequency: trainFrequency
    });

    //--empty the input field after submitting
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");

    console.log(trainName+" "+ destination+" "+time+" "+trainFrequency);
});

//-----Display the database onscreen---------------
database.ref().on("child_added", function(childSnapshot){
    // Console to make the the function is working if not give error code
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().time);
    console.log(childSnapshot.val().trainFrequency);


    //--Write the logic needed to determine when next train will arrive
    // determine when the first train will be scheduled to arraive
    //var firstTrainArrivesAt = "06:00";

    var timeFrequency = childSnapshot.val().trainFrequency;
    console.log("Train Time Frequency: " + timeFrequency);

    //Store the time
    var trainTime = childSnapshot.val().time;
    console.log("Train Time: " + trainTime);

    // first time
    timeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    console.log("time converted: " + timeConverted);

    //current time
    currentTime = moment();
    console.log("Current time: " + moment(currentTime).format("hh:mm"));

    //difference between times
    differenceInTime = moment().diff(moment(timeConverted), "minutes");
    console.log('Difference In Time: ' + differenceInTime);


    //Time apart
    timeRemainder = differenceInTime % childSnapshot.val().trainFrequency;
    console.log("Time Remainder: " +timeRemainder);

    //Minutes until train
    var timeMinutesTillTrain = timeFrequency - timeRemainder;
    console.log("Minutes Till Next Train: " + moment(timeMinutesTillTrain, "minutes"));

    //Next Train
    var nextTrain = moment().add(timeMinutesTillTrain, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));


    // display the information on screen 
    $("#display-train-info").append(
            "<tr>" +
                "<th>" + childSnapshot.val().trainName +"</th>"+
                "<th>" + childSnapshot.val().destination+"</th>"+
                "<th>" + childSnapshot.val().trainFrequency + "</th>"+
                "<th>" + moment(nextTrain).format("hh:mm") + "</th>" + 
                "<th>" + timeMinutesTillTrain + "</th>" +      
            "</tr>" 
        // "<tr><th> " + childSnapshot.val().trainName +
        // " </th><th id=‘Role’> " + childSnapshot.val().destination +
        // " </th><th id=‘StartDate’> " + childSnapshot.val().time +
        // " </th><th id=‘MonthlyRate’> " + childSnapshot.val().trainFrequency + " </th></tr>"
        )
    }, function(errorObject){
        console.log("Errors handled: " + errorObject.code);
});



