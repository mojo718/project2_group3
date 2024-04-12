document.addEventListener("DOMContentLoaded", function() {
    // Get references to the button and form
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