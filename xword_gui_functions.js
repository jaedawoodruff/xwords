// Global variables
var wordClass = null;
var activeDirection = "across";
var inactiveDirection = "down";
var acrossWordClass = null;
var downWordClass = null;
var clueBoxID = null;
var inactiveClueBox = null;
var pencilOn = false;
var fillColor = "black";
var activeWordNum = null;
var nextWordNumIndex = null;
var i = null;
var endCellID = null;
var activeWordLength = null;
var correctLetter = null;
var userLetter = null;
var correct = null;
var firstLetter = null;
var tempID = null;
var fillCount = 0;
var activeClueBox = null;

////////////////////////////////////

// Hide element
function hideDiv(targetID) {
    document.getElementById(targetID).style.visibility = "hidden";
}

// Show element
function showDiv(targetID) {
    document.getElementById(targetID).style.visibility = "visible";
}

// Unhighlight all cells
function unhighlightCells() {
    const allCells = document.querySelectorAll(".cell");
    allCells.forEach(element => {
        element.style.backgroundColor = "white";
    });
}

// Unhighlight all clue boxes
function unhighlightClueBoxes() {

    // Unhighlight clue boxes
    const allClueBoxes = document.querySelectorAll(".clueBox");
    allClueBoxes.forEach(element => {
        element.style.backgroundColor = "white";
    });

    // Unhighlight clue indicators
    const allClueIndicators = document.querySelectorAll(".clueIndicator");
    allClueIndicators.forEach(element => {
        element.style.backgroundColor = "white";
    });

}

// Highlight word
function highlightWord(wordClass) {
    var wordCells = document.getElementsByClassName(wordClass);
    for (var i = 0; i < wordCells.length; i++) {
        wordCells[i].style.backgroundColor = "lightblue";
    }
}

// Highlight letter
function highlightLetter(activeCellID) {
    document.getElementById(activeCellID).style.backgroundColor = "yellow";
}

// Switch active direction
function switchActiveDirection() {
    if (activeDirection === "across") {
        activeDirection = "down";
    }
    else {
        activeDirection = "across";
    }
}

// Get active word length
function getActiveWordLength(activeCellID) {
    if (activeDirection === "across") {
        i = 1;
    }
    else {
        i = 2;
    }
    activeWordLength = document.getElementsByClassName(document.getElementById(activeCellID).classList[i]).length;
    return activeWordLength;
}

// Clear grid
function clearGrid() {
    const allWhiteCells = document.querySelectorAll(".userFill");
    allWhiteCells.forEach(element => {
        element.value = ""
    });
}

// Toggle pencil
function togglePencil() {
    if (pencilOn === false) {
        pencilOn = true;
        fillColor = "gray";
        document.getElementById("pencilButton").style.backgroundColor = "lightblue";
    }
    else {
        pencilOn = false;
        fillColor = "black";
        document.getElementById("pencilButton").style.backgroundColor = "white";
    }
}

////////////////////////////////////

// Handle cell click
function handleCellClick(activeCellID) {

    // Unhighlight all cells + clue boxes
    unhighlightCells();
    unhighlightClueBoxes();

    // Get across and down word classes
    acrossWordClass = document.getElementById(activeCellID).classList[1];
    downWordClass = document.getElementById(activeCellID).classList[2];

    // Choose active word direction
    if (activeDirection === "across") {
        activeWordClass = acrossWordClass;
        inactiveDirection = "down";
        inactiveWordClass = downWordClass;
    }
    else {
        activeWordClass = downWordClass;
        inactiveDirection = "across";
        inactiveWordClass = acrossWordClass;
    }

    // Highlight word and letter
    highlightWord(activeWordClass);
    highlightLetter(activeCellID);

    // Highlight active direction cluebox
    activeClueBox = activeWordClass.match(/^[^a-zA-Z]*/)[0] + activeDirection + "Clue";
    document.getElementById(activeClueBox).style.backgroundColor = "lightblue";
    document.getElementById(activeClueBox + "_INDICATOR").style.backgroundColor = "lightblue";

    // Highlight other direction cluebox
    inactiveClueBox = inactiveWordClass.match(/^[^a-zA-Z]*/)[0] + inactiveDirection + "Clue";
    document.getElementById(inactiveClueBox + "_INDICATOR").style.backgroundColor = "lightblue";

    // Move selected clue to top
    if (window.matchMedia("(min-width: 450px)").matches) {
        document.getElementById(activeDirection + "Clues").scrollTop = document.getElementById(activeClueBox).offsetTop;
    }
    else {
        document.getElementById("activeClueNum").textContent = document.getElementById(activeClueBox + "_NUM").textContent + activeDirection[0].toUpperCase();
        document.getElementById("activeClueText").textContent = document.getElementById(activeClueBox + "_TEXT").textContent;
    }

}

// Handle cluebox click
function handleClueBoxClick(activeClueBox) {

    // Unhighlight all cells + clue boxes
    unhighlightCells();
    unhighlightClueBoxes();

    // Get active word class
    activeWordClass = activeClueBox.match(/^[^A-Z]*/)[0];

    // Get active cell ID
    activeCellID = document.getElementsByClassName(activeWordClass)[0].id;
    
    // Highlight word and first letter in word
    highlightWord(activeWordClass);
    highlightLetter(activeCellID);

    // Get across and down word classes
    acrossWordClass = document.getElementById(activeCellID).classList[1];
    downWordClass = document.getElementById(activeCellID).classList[2];

    // Choose active word direction
    if (activeWordClass.includes("across")) {
        activeDirection = "across";
        inactiveDirection = "down";
        inactiveWordClass = downWordClass;
    }
    else {
        activeDirection = "down";
        inactiveDirection = "across";
        inactiveWordClass = acrossWordClass;
    }

    // Highlight active direction cluebox
    document.getElementById(activeClueBox).style.backgroundColor = "lightblue";
    document.getElementById(activeClueBox + "_INDICATOR").style.backgroundColor = "lightblue";

    // Highlight other direction cluebox
    inactiveClueBox = inactiveWordClass.match(/^[^a-zA-Z]*/)[0] + inactiveDirection + "Clue";
    document.getElementById(inactiveClueBox + "_INDICATOR").style.backgroundColor = "lightblue";
    
    // Move selected clue to top
    document.getElementById(activeDirection + "Clues").scrollTop = document.getElementById(activeClueBox).offsetTop;
    
    return activeCellID;
}

////////////////////////////////////

// Move right
function moveRight(activeCellID) {
    
    // Get ID of cell to the right (with wraparound)
    nextCell = parseInt(activeCellID) + 1;
    if (nextCell === ((n*n) + 1)) {
        nextCell = 1;
    }

    // If it's a black cell, get next ID until it's not (with wraparound)
    while (document.getElementById(nextCell.toString()).className === "blackCell") {
        nextCell = nextCell + 1;
        if (nextCell === ((n*n) + 1)) {
            nextCell = 1;
        }
    }

    return nextCell.toString();
}

// Move left
function moveLeft(activeCellID) {
    
    // Get ID of cell to the left (with wraparound)
    nextCell = parseInt(activeCellID) - 1;
    if (nextCell === 0) {
        nextCell = (n*n);
    }

    // If it's a black cell, get next ID until it's not (with wraparound)
    while (document.getElementById(nextCell.toString()).className === "blackCell") {
        nextCell = nextCell - 1;
        if (nextCell === 0) {
            nextCell = (n*n);
        }
    }

    return nextCell.toString();
}

// Move up
function moveUp(currentCell) {
    
    // Get ID of cell above (with wraparound)
    nextCell = parseInt(currentCell) - n;
    if (nextCell === (1 - n)) {
        nextCell = (n*n);
    }
    else if (nextCell <= 0) {
        nextCell = nextCell + ((n*n) - 1);
    }

    // If it's a black cell, get next ID until it's not (with wraparound)
    while (document.getElementById(nextCell.toString()).className === "blackCell") {
        nextCell = nextCell - n;
        if (nextCell === (1 - n)) {
            nextCell = (n*n);
        }
        else if (nextCell <= 0) {
            nextCell = nextCell + ((n*n) - 1);
        }
    }
    
    return nextCell.toString();
    
}

// Move down
function moveDown(activeCellID) {
    
    // Get ID of cell below (with wraparound)
    nextCell = parseInt(activeCellID) + n;
    if (nextCell === ((n*n) + n)) {
        nextCell = 1;
    }
    else if (nextCell >= ((n*n) + 1)) {
        nextCell = nextCell - ((n*n) - 1);
    }

    // If it's a black cell, get next ID until it's not (with wraparound)
    while (document.getElementById(nextCell.toString()).className === "blackCell") {
        nextCell = nextCell + n;
        if (nextCell === ((n*n) + n)) {
            nextCell = 1;
        }
        else if (nextCell >= ((n*n) + 1)) {
            nextCell = nextCell - ((n*n) - 1);
        }
    }
    
    return nextCell.toString();
    
}

// Move to next down letter
function nextDownLetter(activeCellID, downWordNums, downWordIDs) {

    // Get ID of next down cell
    nextCell = parseInt(activeCellID) + n;
    if (nextCell === ((n*n) + n)) {
        nextCell = 1;
    }

    // If it's end of grid OR a black cell, move to start of next sequential down word
    else if ((nextCell >= ((n*n) + 1)) || (document.getElementById(nextCell.toString()).className === "blackCell")) {
        activeWordNum = parseInt(document.getElementById(activeCellID).classList[2]);
        nextWordNumIndex = downWordNums.indexOf(activeWordNum) + 1;
        nextCell = downWordIDs[nextWordNumIndex];
    }

    return nextCell.toString();

}

// Move to previous down letter
function previousDownLetter(activeCellID, downWordNums, downWordIDs) {

    // Get ID of cell above
    nextCell = parseInt(activeCellID) - n;
    if (nextCell === (1 - n)) {
        nextCell = (n*n);
    }
    
    // If it's top of grid OR a black cell, move to start of next sequential down word
    else if ((nextCell <= 0) || (document.getElementById(nextCell.toString()).className === "blackCell")) {
        activeWordNum = parseInt(document.getElementById(activeCellID).classList[2]);
        nextWordNumIndex = downWordNums.indexOf(activeWordNum) - 1;
        var previousWordLength = document.getElementsByClassName(document.getElementById(downWordIDs[nextWordNumIndex]).classList[2]).length;
        nextCell = downWordIDs[nextWordNumIndex] + (n * (previousWordLength - 1));
    }

    return nextCell.toString();

}

// Move to next word
function nextWord(activeCellID, downWordNums, downWordIDs) {
    if (activeDirection === "across") {
        currentWordClass = document.getElementById(activeCellID).classList[1].toString();
        do {
            activeCellID = moveRight(activeCellID);
        } while (document.getElementById(activeCellID).classList.contains(currentWordClass));
    }
    else {
        currentWordClass = document.getElementById(activeCellID).classList[2].toString();
        do {
            activeCellID = nextDownLetter(activeCellID, downWordNums, downWordIDs);
        } while (document.getElementById(activeCellID).classList.contains(currentWordClass));
    }

    return activeCellID;

}

// Move to previous word
function previousWord(activeCellID, downWordNums, downWordIDs) {
    if (activeDirection === "across") {
        currentWordClass = document.getElementById(activeCellID).classList[1].toString();
        do {
            activeCellID = moveLeft(activeCellID);
        } while (document.getElementById(activeCellID).classList.contains(currentWordClass));
    }
    else {
        currentWordClass = document.getElementById(activeCellID).classList[2].toString();
        do {
            activeCellID = previousDownLetter(activeCellID, downWordNums, downWordIDs);
        } while (document.getElementById(activeCellID).classList.contains(currentWordClass));
    }

    return activeCellID;

}

/////////////////////////////////

// Check current cell
function checkCell(activeCellID, answers) {

    // Check if it's correct
    correctLetter = answers[parseInt(activeCellID) - 1];
    userLetter = document.getElementById("fill_" + activeCellID).value.toUpperCase();
    correct = correctLetter === userLetter;

    // Mark incorrect cells
    if (!correct) {
        document.getElementById("fill_" + activeCellID).style.color = "red";
    }

}

// Check current word
function checkWord(activeCellID, answers) {
    activeWordLength = getActiveWordLength(activeCellID);
    if (activeDirection === "across") {
        firstLetter = document.getElementsByClassName(document.getElementById(activeCellID).classList[1])[0].id;
        for (let i = 0; i < activeWordLength; i++) {
            endCellID = (parseInt(firstLetter) + i).toString();
            checkCell(endCellID, answers);
        }
    }
    else {
        firstLetter = document.getElementsByClassName(document.getElementById(activeCellID).classList[2])[0].id;
        for (let i = 0; i < activeWordLength; i++) {
            endCellID = (parseInt(firstLetter) + (i*n)).toString();
            checkCell(endCellID, answers);
        }
    }
}

// Check grid
function checkGrid(answers) {
    for (let i = 1; i < (n*n) + 1; i++) {
        checkCell(i.toString(), answers);
    }
}

/////////////////////////////////

// Pad digits
function pad(m) {
    if (m <= 9) {
        return "0" + m;
    }
    else {
        return m;
    }
}

// Increment timer
var timerBucket = setInterval(incrementTimer, 1000);
var totalSeconds = -1;
var totalMinutes = 0;
var totalHours = 0;
var totalDays = 0;
var timeToShow = null;
function incrementTimer() {

    if (timerPaused === false) {

        // Count secs/mins/hours/days
        if (totalSeconds === 59) {
            totalSeconds = -1;
            totalMinutes = totalMinutes + 1;
        }
        if (totalMinutes === 60) {
            totalMinutes = 0;
            totalHours = totalHours + 1;
        }
        if (totalHours === 24) {
            totalHours = 0;
            totalDays = totalDays + 1;
        }
        totalSeconds = totalSeconds + 1;

        // Adjust visible digits
        timeToShow = pad(totalMinutes) + ":" + pad(totalSeconds);
        if (totalDays === 365) {
            totalSeconds = totalMinutes = totalHours = totalDays = 0;
        }
        else if (totalDays > 0) {
            timeToShow = pad(totalDays) + ":" +  pad(totalHours) + ":" + timeToShow;
        }
        else if (totalHours > 0) {
            timeToShow = pad(totalHours) + ":" + timeToShow;
        }
        document.getElementById("timer").textContent = timeToShow;
    
    }
}