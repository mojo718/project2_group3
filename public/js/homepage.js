const winston = require('winston');
const path = require('path');

// Set up the Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logsFolderPath, 'lineup.log') })
    ]
});

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    // Get the button element
    var createLineupButton = document.getElementById('createLineup');

    // Add event listener for the button click
    createLineupButton.addEventListener('click', function () {
        // Log a message using Winston when the button is clicked
        logger.info("Creating new lineup...");

        loadLineupScript();
    });
});

// Function to dynamically load lineup.js file
function loadLineupScript() {
    var script = document.createElement('script');
    script.src = './js/lineup.js';
    document.body.appendChild(script);
}
