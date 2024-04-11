document.addEventListener("DOMContentLoaded", function() {
  var addPlayerButton = document.getElementById("addPlayerButton");
  var deleteAccountButton = document.getElementById("deleteAccountButton");
  var playerForm = document.getElementById("playerForm");
  var playerList = document.getElementById("playerList");

  // Function to toggle the visibility of an element
  function toggleVisibility(element) {
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  // Function to create an input field
  function createInputField(type, value) {
    var input = document.createElement("input");
    input.type = type;
    input.value = value;
    return input;
  }

  // Function to handle errors
  function handleError(error) {
    console.error('Error:', error);
    // Handle errors here, e.g., display an error message to the user
  }

  // Function to send a fetch request
  async function sendFetchRequest(url, method, body) {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      return response;
    } catch (error) {
      handleError(error);
    }
  }

  // Function to delete manager account
  async function deleteManagerAccount() {
    try {
      const confirmed = confirm('Are you sure you want to delete your account?');
      if (!confirmed) return;
      
      const response = await sendFetchRequest(`/managers/${managerId}`, 'DELETE');
      
      if (response.ok) {
        console.log('Manager account deleted successfully');
        // Optionally, you can reload the page or perform any other action upon successful deletion
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete manager account: ${errorMessage}`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  // Function to handle form submission
  async function handleFormSubmission(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form input values
    var playerName = document.getElementById("addName").value;
    var playerPosition = document.getElementById("addPosition").value;
    var playerBattingAvg = document.getElementById("addBattingAverage").value;
    var playerHomeRuns = document.getElementById("addHomeRuns").value;
    var playerHits = document.getElementById("addHits").value;
    var playerRBIs = document.getElementById("addRBIs").value;

    // Create a new player object with form input values
    var newPlayer = {
      name: playerName,
      position: playerPosition,
      battingAverage: playerBattingAvg,
      homeRuns: playerHomeRuns,
      hits: playerHits,
      rbis: playerRBIs
    };

    try {
      const response = await sendFetchRequest('/api/players', 'POST', newPlayer);

      if (response.ok) {
        const data = await response.json();
        // Add the new player to the list
        addPlayerToList(data);
        // Clear the form input fields
        playerForm.reset();
        // Hide the form after submission
        toggleVisibility(playerForm);
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to add new player: ${errorMessage}`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  // Function to refresh the player list
  async function refreshPlayerList() {
    try {
      // Clear the player list
      playerList.innerHTML = "";
      
      // Fetch updated player data and re-render the list
      const response = await fetch('/api/players');
      const data = await response.json();
      
      data.forEach(player => {
        addPlayerToList(player);
      });
    } catch (error) {
      handleError(error);
    }
  }

  // Function to add a new player to the list
  function addPlayerToList(playerData) {
    // Create a new div element for the player
    var playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    playerDiv.setAttribute("data-player-id", playerData.id);

    // Populate the player div with player data
    playerDiv.innerHTML = `
      <p>Name: ${playerData.name}</p>
      <p>Position: ${playerData.position}</p>
      <p>Batting Average: ${playerData.battingAverage}</p>
      <p>Home Runs: ${playerData.homeRuns}</p>
      <p>Hits: ${playerData.hits}</p>
      <p>RBIs: ${playerData.rbis}</p>
    `;

    // Add click event listener to each player element
    playerDiv.addEventListener("click", function() {
      // Call function to make the player element editable
      makePlayerEditable(playerDiv, playerData);
    });

    // Append the player div to the player list
    playerList.appendChild(playerDiv);
  }

  // Function to make a player element editable
  function makePlayerEditable(playerDiv, playerData) {
    // Create input fields for each attribute
    var nameInput = createInputField("text", playerData.name);
    var positionInput = createInputField("text", playerData.position);
    var battingAverageInput = createInputField("text", playerData.battingAverage);
    var homeRunsInput = createInputField("text", playerData.homeRuns);
    var hitsInput = createInputField("text", playerData.hits);
    var rbisInput = createInputField("text", playerData.rbis);

    // Add event listener to prevent event propagation when clicking on input fields
    [nameInput, positionInput, battingAverageInput, homeRunsInput, hitsInput, rbisInput].forEach(input => {
      input.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent event from bubbling up to the parent player element
      });
    });

    // Replace the content of playerDiv with input fields
    playerDiv.innerHTML = "";
    playerDiv.appendChild(nameInput);
    playerDiv.appendChild(positionInput);
    playerDiv.appendChild(battingAverageInput);
    playerDiv.appendChild(homeRunsInput);
    playerDiv.appendChild(hitsInput);
    playerDiv.appendChild(rbisInput);

    // Add event listener to save changes on Enter key press
    playerDiv.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        // Call function to save changes
        savePlayerChanges(playerData.id, {
          name: nameInput.value,
          position: positionInput.value,
          battingAverage: battingAverageInput.value,
          homeRuns: homeRunsInput.value,
          hits: hitsInput.value,
          rbis: rbisInput.value
        });
      }
    });
  }

  // Function to save changes to a player
  async function savePlayerChanges(playerId, updatedData) {
    try {
      const response = await sendFetchRequest(`/api/players/${playerId}`, 'PUT', updatedData);
      
      if (response.ok) {
        // Refresh the player list after saving changes
        refreshPlayerList();
      } else {
        const errorMessage = await response.text();
        throw new Error(`Failed to save player changes: ${errorMessage}`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  // Event listener for the delete account button
  deleteAccountButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account?')) {
      await deleteManagerAccount();
    }
  });

  // Add event listener to the button to toggle form visibility
  addPlayerButton.addEventListener("click", function(event) {
    toggleVisibility(playerForm);
  });

  // Add event listener to the form submit event
  playerForm.addEventListener("submit", handleFormSubmission);

  // Initial load: Fetch player data and render the list
  refreshPlayerList();

  // Lineup-related code starts here

  var showFormButton = document.getElementById("showFormButton");
  var lineupForm = document.getElementById("lineupForm");
  var lineupList = document.getElementById("lineupList");

  // Function to toggle the visibility of the form
  function toggleFormVisibility() {
    if (lineupForm.style.display === "none") {
      lineupForm.style.display = "block";
    } else {
      lineupForm.style.display = "none";
    }
  }

  // Add event listener to the button to toggle form visibility
  showFormButton.addEventListener("click", function(event) {
    toggleFormVisibility();
  });

  // Add event listener to the form submit event
  lineupForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    var formData = new FormData(lineupForm);

    // Make a POST request to your API endpoint
    fetch("/api/lineups", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // assuming API returns JSON
      })
      .then(data => {
        // Handle successful response here
        console.log("Lineup saved successfully:", data);
        // Hide the form
        toggleFormVisibility();

        // Update the lineup list with the new lineup data
        var lineups = data.lineups; // Assuming 'lineups' is the array of lineups in the response
        var lineupList = document.getElementById("lineupList");

        // Clear existing lineup list
        lineupList.innerHTML = "";

        // Append each lineup to the lineup list
        lineups.forEach(function(lineup) {
          var lineupElement = document.createElement("div");
          lineupElement.classList.add("lineup");
          lineupElement.setAttribute("data-lineup-id", lineup.id);
          lineupElement.innerHTML = "<p>" + lineup.date + "</p>";
          lineupList.appendChild(lineupElement);
        });
      });
  });

  // Add event listener to the lineup list
  lineupList.addEventListener("click", function(event) {
    // Check if a lineup element is clicked
    var clickedElement = event.target;
    if (clickedElement.classList.contains("lineup")) {
      var lineupId = clickedElement.getAttribute("data-lineup-id");
      // Fetch lineup details by ID
      fetch(`/api/lineups/${lineupId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // assuming API returns JSON
        })
        .then(data => {
          // Display lineup details
          displayLineupDetails(data);
        })
        .catch(error => {
          // Handle error
          console.error("Error fetching lineup details:", error);
          // Optionally, display an error message to the user
        });
    }
  });

  // Function to display lineup details
  function displayLineupDetails(lineupDetails) {
    // Update lineup details in the DOM
    var detailsManagerName = document.getElementById("detailsManagerName");
    var detailsGameDate = document.getElementById("detailsGameDate");
    var detailsPlayers = document.getElementById("detailsPlayers");

    detailsManagerName.textContent = lineupDetails.managerName;
    detailsGameDate.textContent = lineupDetails.gameDate;

    // Clear existing players list
    detailsPlayers.innerHTML = "";

    // Append each player to the players list
    lineupDetails.players.forEach(function(player) {
      var playerItem = document.createElement("li");
      playerItem.textContent = player.name;
      detailsPlayers.appendChild(playerItem);
    });

    // Show lineup details container
    document.getElementById("lineupDetails").style.display = "block";
  }

  // Add event listener to the form submit event
  lineupForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form data
    var formData = new FormData(lineupForm);

    // Make a PUT request to your API endpoint
    fetch("/api/lineups", {
        method: "PUT",
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // assuming API returns JSON
      })
      .then(data => {
        // Handle successful response here
        console.log("Lineup updated successfully:", data);

        // Optionally, you can update the lineup list with the updated lineup data
        updateLineupList(data.lineups);

        // Hide the form
        toggleFormVisibility();
      })
      .catch(error => {
        // Handle error
        console.error("Error updating lineup:", error);
        // Optionally, display an error message to the user
      });
  });

  // Function to update the lineup list with new lineup data
  function updateLineupList(lineups) {
    // Clear existing lineup list
    lineupList.innerHTML = "";

    // Append each lineup to the lineup list
    lineups.forEach(function(lineup) {
      var lineupElement = document.createElement("div");
      lineupElement.classList.add("lineup");
      lineupElement.setAttribute("data-lineup-id", lineup.id);
      lineupElement.innerHTML = "<p>" + lineup.date + "</p>";
      lineupList.appendChild(lineupElement);
    });
  }
});


//   if (name && needed_funding && description) {
//     const response = await fetch(`/api/projects`, {
//       method: 'POST',
//       body: JSON.stringify({ name, needed_funding, description }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       document.location.replace('/profile');
//     } else {
//       alert('Failed to create project');
//     }
//   }

// const delButtonHandler = async (event) => {
//   if (event.target.hasAttribute('data-id')) {
//     const id = event.target.getAttribute('data-id');

//     const response = await fetch(`/api/projects/${id}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       document.location.replace('/profile');
//     } else {
//       alert('Failed to delete project');
//     }
//   }
// };

// document
//   .querySelector('.new-project-form')
//   .addEventListener('submit', newFormHandler);

// document
//   .querySelector('.project-list')
//   .addEventListener('click', delButtonHandler);
