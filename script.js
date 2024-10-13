
const classHallLocations = {
  "ARC": { latitude: 47.654595, longitude: -122.310874}, // Architecture Hall
  "CDH": { latitude: 47.656653, longitude: -122.316099}, // Condon Hall
  "CSE1": { latitude: 47.653218, longitude: -122.305877}, // Paul G. Allen Center
  "CSE2": { latitude: 47.652915, longitude: -122.304460}, // Bill & Melinda Gates Center
  "ECE": { latitude: 47.653176, longitude: -122.305583},  // Electrical Computer Engineering Building
  "MGH": { latitude: 47.654893, longitude: -122.307787},  // Mary Gates Hall
  "PAA": { latitude: 47.652958, longitude: -122.311011},  // Physics-Astronomy Auditorium
  "SAV": { latitude: 47.657186, longitude: -122.308388},  // Savery Hall
  "KNE": { latitude: 47.656646, longitude: -122.309322},  // Kane Hall
  "CMU": { latitude: 47.657033, longitude: -122.305346},  // Communications Building
  "BAG": { latitude: 47.653486, longitude: -122.308806},  // Bagley Hall
  "CHL": { latitude: 47.653759, longitude: -122.309960},  // Chemistry Library
  "MEB": { latitude: 47.653737, longitude: -122.304729},  // Mechanical Engineering Building
  "LOW": { latitude: 47.654293, longitude: -122.304564},  // Loew Hall
  "BEN": { latitude: 47.653038, longitude: -122.309568},  // Benson Hall
  "MLR": { latitude: 47.657255, longitude: -122.306317}, // Miller Hall
  "GUG": { latitude: 47.654280, longitude: -122.306287}, // Guggenheim
  "MOR": { latitude: 47.652514, longitude: -122.304836}, // More
};

let scheduleArray1 = [];
let scheduleArray2 = [];
let scheduleArray3 = [];

const timeMapping = {
  "08:30": 0, "09:00": 1, "09:30": 2, "10:00": 3, "10:30": 4,
  "11:00": 5, "11:30": 6, "12:00": 7, "12:30": 8, "13:00": 9,
  "13:30": 10, "14:00": 11, "14:30": 12, "15:00": 13, "15:30": 14,
  "16:00": 15, "16:30": 16, "17:00": 17, "17:30": 18
};

function parseSchedule(input) {
  const daysMap = { M: 1, T: 2, W: 3, Th: 4, F: 5 };

  // Splitting the input into individual classes
  const classes = input.split("Class:").slice(1); // Removes "Response 3: " part and splits by "Class:"

  classes.forEach((cls, idx) => {
    // Match class details: Class name, Times, Building
    const [className, times, building] = cls.match(/(.*?),\sTimes:\s(.*?),\sBuilding:\s(.*?),/).slice(1, 4);
    const [daysStr, timeRange] = times.split(' ');

    // Fix the day string to handle "TTh" as two separate days
    const dayIndices = daysStr.replace("Th", "H") // Temporary replacement for Th
                              .split('')
                              .map(day => day === 'H' ? daysMap['Th'] : daysMap[day]);

    // Convert time range to start and end indices
    const startEndTimes = timeRange.split('-');
    const startTimeIdx = timeMapping[startEndTimes[0]];
    const endTimeIdx = timeMapping[startEndTimes[1]] - 1; // Subtract 1 to fix the off-by-one error

    // Generate an array including both the start and one less than end time block
    const timeIndices = Array.from({ length: endTimeIdx - startTimeIdx + 1 }, (_, i) => startTimeIdx + i);

    // Output in the required format
    if (idx % 3 === 0) {
      scheduleArray1.push(timeIndices, dayIndices, [className.trim(), building.trim()]);
    } else if (idx % 3 === 1) {
      scheduleArray2.push(timeIndices, dayIndices, [className.trim(), building.trim()]);
    } else {
      scheduleArray3.push(timeIndices, dayIndices, [className.trim(), building.trim()]);
    }

    // Output in the required format
    console.log(`Class ${idx + 1}: ("${className.trim()}"), (${dayIndices.join(',')}), (${timeIndices.join(',')}), ("${building.trim()}")`);
  });
}

const input = `Response 1:
Class: CSE 310, Times: TTh 09:00-10:00, Building: GUG 220, Prerequisites: CSE 143
Class: CSE 320, Times: MWF 11:00-12:00, Building: MOR 225, Prerequisites: CSE 311
Class: CSE 420, Times: TTh 10:00-11:30, Building: SAV 168, Prerequisites: CSE 312, CSE 332
Reponse 2:
Class: CSE 446, Times: MWF 10:00-11:00, Building: GUG 310, Prerequisites: CSE 332, STAT 390
Class: CSE 461, Times: TTh 11:00-12:30, Building: MGH 241, Prerequisites: CSE 451
Class: CSE 421, Times: TTh 13:00-14:30, Building: SAV 168, Prerequisites: CSE 312, CSE 332
Response 3:
Class: CSE 311, Times: TTh 09:00-10:30, Building: GUG 220, Prerequisites: CSE 143
Class: CSE 321, Times: MWF 11:00-12:00, Building: MOR 225, Prerequisites: CSE 311
Class: CSE 463, Times: TTh 11:00-12:30, Building: MGH 241, Prerequisites: CSE 451`;

parseSchedule(input);

console.log("Schedule Array 1:", scheduleArray1);
console.log("Schedule Array 2:", scheduleArray2);
console.log("Schedule Array 3:", scheduleArray3);

document.getElementById('clear').addEventListener('click', function() {
  const cells = document.querySelectorAll('#schedule tbody td');

    clearFilledCells()

    console.log('All cells cleared');
});

function clearFilledCells() {
  filledCells.forEach(({ row, col }) => {
    // Select the correct cell (assuming the first column is time and we want the second column onwards for the schedule)
    const cell = document.querySelector(`#schedule tbody tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    
    if (cell) {
      // Clear background color and content of the cell
      cell.style.backgroundColor = '';
      cell.innerHTML = ''; // Clears any HTML content (including text)
    }
  });

  // Filter out the cells that have been cleared
  filledCells = filledCells.filter(({ row, col }) => {
    const cell = document.querySelector(`#schedule tbody tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
    return cell && cell.style.backgroundColor !== ''; // Keep only cells that still have a background color
  });
}

document.getElementById('sendButton').addEventListener('click', function() {
  const userMessage = document.getElementById('textPrompt').value;
});

const scheduleButtons = document.querySelectorAll('.schedule-tab');
scheduleButtons.forEach(button => {
    button.disabled = true;
});

document.getElementById('sendButton').addEventListener('click', function() {
  const userMessage = document.getElementById('textPrompt').value;
  if (userMessage.trim() !== '') {
    // Display user's message
    const chatHistory = document.getElementById('chatHistory');
    const userMessageElement = document.createElement('div');
    userMessageElement.classList.add('user-message');
    userMessageElement.textContent = `User: ${userMessage}`;
    chatHistory.appendChild(userMessageElement);
    
    // Simulate bot response
    const botMessageElement = document.createElement('div');
    botMessageElement.classList.add('bot-message');
    botMessageElement.textContent = 'Certainly!';
    chatHistory.appendChild(botMessageElement);

    // Scroll to the bottom of the chat history
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Clear the text area
    document.getElementById('textPrompt').value = '';
  } else {
      alert('Please enter a message.');
  }
  scheduleButtons.forEach(button => {
    button.disabled = false;
  });
});

let map;
let showingLocations = false;
let mode = '';
let filledCells = [];

let schedule1 = [];
let schedule2 = [];
let schedule3 = [];

for (let i = 0; i < scheduleArray1[0].length; i++) {
  for (let j = 0; j < scheduleArray1[1].length; j++) {
    let rowy = scheduleArray1[0][i];
    let coly = scheduleArray1[1][j];
    let coursey = scheduleArray1[2][0];
    let locationy = scheduleArray1[2][1];
    schedule1.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let k = 0; k < scheduleArray1[3].length; k++) {
  for (let l = 0; l < scheduleArray1[4].length; l++) {
    let rowy = scheduleArray1[3][k];
    let coly = scheduleArray1[4][l];
    let coursey = scheduleArray1[5][0];
    let locationy = scheduleArray1[5][1];
    schedule2.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let m = 0; m < scheduleArray1[6].length; m++) {
  for (let n = 0; n < scheduleArray1[7].length; n++) {
    let rowy = scheduleArray1[6][m];
    let coly = scheduleArray1[7][n];
    let coursey = scheduleArray1[8][0];
    let locationy = scheduleArray1[8][1];
    schedule3.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let o = 0; o < scheduleArray2[0].length; o++) {
  for (let p = 0; p < scheduleArray2[1].length; p++) {
    let rowy = scheduleArray2[0][o];
    let coly = scheduleArray2[1][p];
    let coursey = scheduleArray2[2][0];
    let locationy = scheduleArray2[2][1];
    schedule1.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let q = 0; q < scheduleArray2[3].length; q++) {
  for (let r = 0; r < scheduleArray2[4].length; r++) {
    let rowy = scheduleArray2[3][q];
    let coly = scheduleArray2[4][r];
    let coursey = scheduleArray2[5][0];
    let locationy = scheduleArray2[5][1];
    schedule2.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let s = 0; s < scheduleArray2[6].length; s++) {
  for (let t = 0; t < scheduleArray2[7].length; t++) {
    let rowy = scheduleArray2[6][s];
    let coly = scheduleArray2[7][t];
    let coursey = scheduleArray2[8][0];
    let locationy = scheduleArray2[8][1];
    schedule3.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let u = 0; u < scheduleArray3[0].length; u++) {
  for (let v = 0; v < scheduleArray3[1].length; v++) {
    let rowy = scheduleArray3[0][u];
    let coly = scheduleArray3[1][v];
    let coursey = scheduleArray3[2][0];
    let locationy = scheduleArray3[2][1];
    schedule1.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let w = 0; w < scheduleArray3[3].length; w++) {
  for (let x = 0; x < scheduleArray3[4].length; x++) {
    let rowy = scheduleArray3[3][w];
    let coly = scheduleArray3[4][x];
    let coursey = scheduleArray3[5][0];
    let locationy = scheduleArray3[5][1];
    schedule2.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

for (let y = 0; y < scheduleArray3[6].length; y++) {
  for (let z = 0; z < scheduleArray3[7].length; z++) {
    let rowy = scheduleArray3[6][y];
    let coly = scheduleArray3[7][z];
    let coursey = scheduleArray3[8][0];
    let locationy = scheduleArray3[8][1];
    schedule3.push({ row: rowy, col: coly, course: coursey, location: locationy});
  }
}

console.log(schedule1);
console.log(schedule2);
console.log(schedule3);

function fillSchedule(scheduleArray) {
  scheduleArray.forEach(({ row, col, course, location }) => {
      const cell = document.querySelector(`#schedule tbody tr:nth-child(${row + 1}) td:nth-child(${col + 1})`);
      if (cell) {
          cell.style.backgroundColor = 'yellow'; // Fill background with yellow
          cell.innerHTML = `${course}<br>(${location})`; // Add course name and building location
          filledCells.push({ row, col, course, location }); // Add to filledCells array
      }
  });
}

let markers = [];

// Function to initialize the map with three locations
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 47.6559, lng: -122.30783}, // Centered on Seattle
      zoom: 15
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function addMarker(locationData, locationName) {
  const marker = new google.maps.Marker({
    position: { lat: locationData.latitude, lng: locationData.longitude },
    map: map,
    title: locationName,
  });

  markers.push(marker);
}

// Function to toggle between schedule and map
document.getElementById('toggleLocations').addEventListener('click', function () {
  const schedule = document.getElementById('schedule');
  const mapDiv = document.getElementById('map');
  const toggleButton = document.getElementById('toggleLocations');
  const weekdayMenu = document.getElementById('weekdayMenu');
  const alterButtons = document.querySelector('.alter');

  if (showingLocations) {
      // Show the schedule and hide the map and weekday menu
      schedule.style.display = 'block';
      mapDiv.style.display = 'none';
      weekdayMenu.style.display = 'none';
      toggleButton.textContent = 'Show Locations';
      alterButtons.style.display = 'flex';
  } else {
      // Hide the schedule, show the map and weekday menu
      schedule.style.display = 'none';
      mapDiv.style.display = 'block';
      weekdayMenu.style.display = 'flex'; // Display weekdays as a flexbox
      initMap(); // Initialize the map when locations are shown
      toggleButton.textContent = 'Show Schedule';
      alterButtons.style.display = 'none';
  }

  showingLocations = !showingLocations;
});

// Set mode to 'add' when the add button is clicked
document.getElementById('add').addEventListener('click', function () {
  mode = 'add';
  alert('Click on any cell to fill it gray.');
});

// Set mode to 'subtract' when the subtract button is clicked
document.getElementById('subtract').addEventListener('click', function () {
  mode = 'subtract';
  alert('Click on any gray cell to remove the fill.');
});

const scheduleTabs = document.querySelectorAll('.schedule-tab');
scheduleTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        // Remove the active class from all tabs
        scheduleTabs.forEach(t => t.classList.remove('active'));
        // Add the active class to the clicked tab
        this.classList.add('active');

        clearFilledCells();

        // Fill cells according to the selected schedule
        if (this.id === 'schedule1') {
            currentSchedule = 'schedule1';
            fillSchedule(schedule1);
        } else if (this.id === 'schedule2') {
            currentSchedule = 'schedule2';
            fillSchedule(schedule2);
        } else if (this.id === 'schedule3') {
            currentSchedule = 'schedule3';
            fillSchedule(schedule3);
        }
    });
});

// Add event listeners to all table cells
const cells = document.querySelectorAll('#schedule tbody td');
cells.forEach((cell, index) => {
    const totalColumns = 6; // 1 time column + 5 weekday columns
    const row = Math.floor(index / totalColumns); // Calculate row index
    const col = index % totalColumns; // Calculate column index

    // Skip the first column (time column)
    if (col === 0) return;

    // Add click event listener for valid cells (weekday columns)
    cell.addEventListener('click', function () {
        if (mode === 'add') {
            // Fill the cell with gray and add it to the filledCells array if it's not already filled
            if (!filledCells.some(item => item.row === row && item.col === col)) {
                this.style.backgroundColor = 'gray';
                filledCells.push({ row: row, col: col });
                console.log(filledCells); // Log filledCells array to see updates
            }
        } else if (mode === 'subtract') {
            // Remove the gray fill and update the filledCells array
            if (this.style.backgroundColor === 'gray') {
                this.style.backgroundColor = '';
                filledCells = filledCells.filter(item => !(item.row === row && item.col === col));
                console.log(filledCells); // Log filledCells array to see updates
            }
        }
    });
});

const weekdayTabs = document.querySelectorAll('.weekday-tab');
weekdayTabs.forEach(tab => {
  tab.addEventListener('click', function () {
    // Remove the active class from all weekday tabs
    weekdayTabs.forEach(t => t.classList.remove('active'));
    // Add the active class to the clicked tab
    this.classList.add('active');

    const selectedWeekday = parseInt(this.getAttribute('data-day')); // Get the selected weekday index

    // Get the active schedule array
    let activeSchedule = [];
    if (currentSchedule === 'schedule1') {
      activeSchedule = schedule1;
    } else if (currentSchedule === 'schedule2') {
      activeSchedule = schedule2;
    } else if (currentSchedule === 'schedule3') {
      activeSchedule = schedule3;
    }

    // Clear previous console logs for easier debugging
    clearMarkers();

    // Filter the active schedule for the selected weekday and print locations
    activeSchedule.forEach(({ col, location }) => {
      if (col === selectedWeekday) { // Match weekday column index
        const locationKey = location.slice(0, 3); // Extract the first 3 characters of the location
        const locationData = classHallLocations[locationKey]; // Use the first 3 characters to find the location

        if (locationData) {
          addMarker(locationData, location); // Add marker to the map
        } else {
          console.log(`Location data for ${locationKey} not found.`);
        }
      }
    });
  });
});