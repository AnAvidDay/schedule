// Check time every 1 seconds
setInterval(crap, 1000);

function crap() {
  alert('hello');
}
// Listen for form submit
document.getElementById('myForm').addEventListener('submit', saveEvent);

// Save event
function saveEvent(e){
  // Get form values
  var eventName = document.getElementById('eventName').value;
  var eventTime = document.getElementById('eventTime').value;
  var timeClass = document.getElementById('timeClass').value;

  if(!validateForm(eventName, eventTime)){
    return false;
  }

  var event = {
    name: eventName,
    time: eventTime,
    timeOf: timeClass
  }

  /*
    // Local Storage Test
    localStorage.setItem('test', 'Hello World');
    console.log(localStorage.getItem('test'));
    localStorage.removeItem('test');
    console.log(localStorage.getItem('test'));
  */

  // Test if events is null
  if(localStorage.getItem('events') === null){
    // Init array
    var events = [];
    // Add to array
    events.push(event);
    // Set to localStorage
    localStorage.setItem('events', JSON.stringify(events));
  } else {
    // Get events from localStorage
    var events = JSON.parse(localStorage.getItem('events'));
    // Add event to array
    events.push(event);
    // Re-set back to localStorage
    localStorage.setItem('events', JSON.stringify(events));
  }

  // Clear form
  document.getElementById('myForm').reset();

  // Re-fetch events
  fetchEvents();

  // Prevent form from submitting
  e.preventDefault();
}

// Delete event
function deleteEvent(time){
  // Get events from localStorage
  var events = JSON.parse(localStorage.getItem('events'));
  // Loop throught events
  for(var i =0;i < events.length;i++){
    if(events[i].time == time){
      // Remove from array
      events.splice(i, 1);
    }
  }
  // Re-set back to localStorage
  localStorage.setItem('events', JSON.stringify(events));

  // Re-fetch events
  fetchEvents();
}

// Fetch events
function fetchEvents() {
  // Get events from localStorage
  var events = JSON.parse(localStorage.getItem('events'));
  // Get output id
  var eventsResults = document.getElementById('eventsResults');

  // Create object with events in time order
  // 12AM-11:59AM........12PM-11:59PM
  // collect times in AM and PM seperatetly
  var timeAM = [];
  var timePM = [];
  for(var x = 0; x < events.length; x++) {
    if(events[x].timeOf == "AM") {
      var newTime = parseFloat(events[x].time.replace(":","."));
      timeAM.push(newTime);
    } else {
      var newTime = parseFloat(events[x].time.replace(":","."));
      timePM.push(newTime);
    }
  }

  // sort them from least to greatest
  timeAM.sort(function(a,b){return a-b});
  timePM.sort(function(a,b){return a-b});

  // put twelves in front for AM and PM
  // AM
  var twelveAM = [];
  for(var y = timeAM.length-1; y >= 0; y--) {
    if(timeAM[y] >= 12 && timeAM[y] < 12.6) {
      twelveAM.push(timeAM[y]);
      timeAM.splice(y, 1);
    }
  }

  if(twelveAM !== undefined) {
    twelveAM.sort(function(a,b){return a-b});
    timeAM = twelveAM.concat(timeAM);
  }

  // PM
  var twelvePM = [];
  for(var y = timePM.length-1; y >= 0; y--) {
    if(timePM[y] >= 12 && timePM[y] < 12.6) {
      twelvePM.push(timePM[y]);
      timePM.splice(y, 1);
    }
  }

  if(twelvePM !== undefined) {
    twelvePM.sort(function(a,b){return a-b});
    timePM = twelvePM.concat(timePM);
  }

  //console.log(events.findIndex("12:59"));
  //console.log(twelveAM);

  // combine two to create final ordered list
  var combinedTime = timeAM.concat(timePM);
  // Build output
  eventsResults.innerHTML = '';
  for(var i = 0; i < events.length; i++) {
    // search events array for elements in orderedTime array
    // then display it in that order

    // turn elements in combinedTime back into clock digits
    // then find index of it based on whether it is PM or AM
    if(i <= timeAM.length-1) {
      var stringed = combinedTime[i].toString();
      if(Math.round(combinedTime[i]) === combinedTime[i]) {
        var editStringed = stringed + ":00";
      } else {
        var editStringed = stringed.replace(".",":");
      }
      var index = events.findIndex(x => x.time==editStringed && x.timeOf=="AM");
    } else {
      var stringed = combinedTime[i].toString();
      if(Math.round(combinedTime[i]) === combinedTime[i]) {
        var editStringed = stringed + ":00";
      } else {
        var editStringed = stringed.replace(".",":");
      }
      var index = events.findIndex(x => x.time==editStringed && x.timeOf=="PM");
    }

    // Create html
    var name = events[index].name;
    var time = events[index].time;
    var timeOf = events[index].timeOf;
    eventsResults.innerHTML += '<div class="well">'+
                                  '<h3>'+time+' '+timeOf+'<h3>' +
                                  '<h3>'+name+'<h3>' +
                                  ' <a onclick="deleteEvent(\''+time+'\')" class="btn btn-danger" href="#">Delete</a> ' +

                                  '</div>';
  }
}

// Validate Form
function validateForm(eventName, eventTime){
  if(!eventName || !eventTime){
    alert('Please fill in the form');
    return false;
  }

  var expression = /^(10|11|12|[1-9]):[0-5][0-9]$/;
  var regex = new RegExp(expression);

  if(!eventTime.match(regex)){
    alert('Please use a valid time');
    return false;
  }

  return true;
}


function timeCheck() {
  var date = new Date();
  var digitalCount = date.toLocaleTimeString();
  // Remove AM/PM and Seconds for Timer
  if(digitalCount.indexOf("PM") > -1) {
  var digitalTime = digitalCount.replace(" PM", "");
  var remove = digitalTime.slice(digitalTime.length-3, digitalTime.length);
  var time = digitalTime.replace(remove, "");
  } else {
  var digitalTime = digitalCount.replace(" AM", "");
  var remove = digitalTime.slice(digitalTime.length-3, digitalTime.length);
  var time = digitalTime.replace(remove, "");
  }
  // grabbing whether it is AM or PM
  var realTimeAMPM = digitalCount.slice(-2);

  // Parse over event info
  var events = JSON.parse(localStorage.getItem('events'));
  // Loop through events to compare time and timeOf with Digital time
  for(var i =0;i < events.length;i++){
    // Make sure it only runs once then plays noise/notification
    if(events[i].time == time && remove == ":00" && events[i].timeOf == realTimeAMPM) {
      var audio = new Audio('ding.mp3');
      audio.play();
      alert('work?');
    }
  }
}

