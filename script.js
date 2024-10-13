const classHallLocations = {
  "ARC": { latitude: 47.654595, longitude: -122.305649}, // Architecture Hall
  "CDH": { latitude: 47.656653, longitude: -122.316099}, // Condon Hall
  "CSE1": { latitude: 47.653434, longitude: -122.305649}, // Paul G. Allen Center
  "CSE2": { latitude: 47.654302, longitude: -122.306524}, // Bill & Melinda Gates Center
  "ECE": { latitude: 47.653176, longitude: -122.305583},  // Electrical Computer Engineering Building
  "EEC": { latitude: 47.653215, longitude: -122.306768},  // Electrical Engineering Building
  "MGH": { latitude: 47.656977, longitude: -122.309724},  // Mary Gates Hall
  "PAA": { latitude: 47.653816, longitude: -122.304836},  // Physics-Astronomy Auditorium
  "SAV": { latitude: 47.656295, longitude: -122.311968},  // Savery Hall
  "KNE": { latitude: 47.656607, longitude: -122.312077},  // Kane Hall
  "CMU": { latitude: 47.655998, longitude: -122.308266},  // Communications Building
  "BAG": { latitude: 47.657176, longitude: -122.308947},  // Bagley Hall
  "CHL": { latitude: 47.655259, longitude: -122.307634},  // Chemistry Library
  "MEB": { latitude: 47.653980, longitude: -122.306167},  // Mechanical Engineering Building
  "LOW": { latitude: 47.655983, longitude: -122.305853},  // Loew Hall
  "BEN": { latitude: 47.653162, longitude: -122.307787},  // Benson Hall
  // each line should follow this syntax
};

document.getElementById('clear').addEventListener('click', function() {
  alert('clear');
});

document.getElementById('subtract').addEventListener('click', function() {
  alert('add');
});

document.getElementById('add').addEventListener('click', function() {
  alert('subtract');
});

document.getElementById('sendButton').addEventListener('click', function() {
  const userMessage = document.getElementById('textPrompt').value;
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
      botMessageElement.textContent = 'Bot: LLM RESPONSE';
      chatHistory.appendChild(botMessageElement);

      // Scroll to the bottom of the chat history
      chatHistory.scrollTop = chatHistory.scrollHeight;

      // Clear the text area
      document.getElementById('textPrompt').value = '';
  } else {
      alert('Please enter a message.');
  }
});

// // Highlight the selected schedule
// const tabs = document.querySelectorAll('.tab');
// tabs.forEach(tab => {
//   tab.addEventListener('click', function() {
//       // Remove the active class from all tabs
//       tabs.forEach(t => t.classList.remove('active'));
//       // Add the active class to the clicked tab
//       this.classList.add('active');
//   });
// });

let map;
let showingLocations = false;

// Function to initialize the map with three locations
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 47.6559, lng: -122.30783}, // Centered on Seattle
        zoom: 15
    });

    // Add markers for three locations
    Object.keys(classHallLocations).forEach(key => {
      const location = classHallLocations[key];
      new google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
          title: location.title
      });
  });
}

// Function to toggle between schedule and map
document.getElementById('toggleLocations').addEventListener('click', function () {
  const schedule = document.getElementById('schedule');
  const mapDiv = document.getElementById('map');
  const toggleButton = document.getElementById('toggleLocations');
  const weekdayMenu = document.getElementById('weekdayMenu');

  if (showingLocations) {
      // Show the schedule and hide the map and weekday menu
      schedule.style.display = 'block';
      mapDiv.style.display = 'none';
      weekdayMenu.style.display = 'none';
      toggleButton.textContent = 'Show Locations';
  } else {
      // Hide the schedule, show the map and weekday menu
      schedule.style.display = 'none';
      mapDiv.style.display = 'block';
      weekdayMenu.style.display = 'flex'; // Display weekdays as a flexbox
      initMap(); // Initialize the map when locations are shown
      toggleButton.textContent = 'Show Schedule';
  }

  showingLocations = !showingLocations;
});

const scheduleTabs = document.querySelectorAll('.schedule-tab');
scheduleTabs.forEach(tab => {
  tab.addEventListener('click', function () {
      scheduleTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
  });
});

const weekdayTabs = document.querySelectorAll('.weekday-tab');
weekdayTabs.forEach(tab => {
  tab.addEventListener('click', function () {
      weekdayTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
  });
});

