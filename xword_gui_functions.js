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
function clearGrid(n) {

    // Clear grid
    const allWhiteCells = document.querySelectorAll(".userFill");
    allWhiteCells.forEach(element => {
        element.value = ""
    });

    // Update userfill
    userfill = ".".repeat(n*n);
    localStorage.setItem(puzzleUserfillID, JSON.stringify(userfill));

    // Update userfill colors
    userfillColors = Array(n*n).fill("black");
    localStorage.setItem(puzzleUserfillColorsID, JSON.stringify(userfillColors));

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

// Toggle keyboard
function toggleKeyboard() {
    if (keyboardOn === false) {
        keyboardOn = true;
        showDiv("phoneCluesBucket");
        document.getElementById("phoneCluesBucket").style.display = "block";
        document.getElementById("showKeyboardButton").style.backgroundColor = "lightblue";

        if (window.matchMedia("(max-width: 500px)").matches) {
            document.getElementById("cluesBucket").style.display = "none";
        }
    }
    else {
        keyboardOn = false;
        hideDiv("phoneCluesBucket");
        document.getElementById("phoneCluesBucket").style.display = "none";
        document.getElementById("showKeyboardButton").style.backgroundColor = "white";

        if (window.matchMedia("(max-width: 500px)").matches && !window.matchMedia("(pointer: coarse)").matches) {
            document.getElementById("cluesBucket").style.display = "flex";
        }
    }
}

////////////////////////////////////

// Congrats message
function congrats(answers) {

    // If userfill is 100% correct
    if (userfill === answers) {
        // Pause timer
        timerPaused = true;

        // Show congrats message
        showDiv("yayPageMainBlur");
        finalTime = document.getElementById("timer").textContent;
        document.getElementById("yayPopupQuestion").innerHTML = "Yowza!<br>Final Time: <b>" + finalTime + "<b>";
        document.getElementById("yayView").innerHTML = "See Puzzle";

        // Mark puzzle as complete
        puzzleComplete = true;
    }
    else {
        timerPaused = false;
        puzzleComplete = false;
    }

    // Save puzzle completeness status to local storage
    localStorage.setItem(puzzleCompletenessID, JSON.stringify(puzzleComplete));

}

// Handle cell click
function handleCellClick(activeCellID, newAcrossCluesHeader, newAcrossClues, newDownCluesHeader, newDownClues) {

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

    // Switch visible clues if needed
    if (window.matchMedia("(max-width: 500px)").matches) {
        switchVisibleClues(newAcrossCluesHeader, newAcrossClues, newDownCluesHeader, newDownClues);
    }

    // Move selected clue to top
    if (!window.matchMedia("(pointer: coarse)").matches) {
        document.getElementById(activeDirection + "Clues").scrollTop = document.getElementById(activeClueBox).offsetTop;
    }

    // Update mobile cluebar if needed
    if (document.getElementById("phoneClueFeature").style.display !== "none") {
        document.getElementById("activeClueNum").textContent = document.getElementById(activeClueBox + "_NUM").textContent + activeDirection[0].toUpperCase();
        document.getElementById("activeClueText").textContent = document.getElementById(activeClueBox + "_TEXT").textContent;
    }

}

// Handle cluebox click
function handleClueBoxClick(activeClueBox, newAcrossCluesHeader, newAcrossClues, newDownCluesHeader, newDownClues) {

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
var i = null;
function checkCell(activeCellID, answers) {

    i = parseInt(activeCellID) - 1;

    // Check if it's correct
    correctLetter = answers[i];
    userLetter = document.getElementById("fill_" + activeCellID).value.toUpperCase();
    correct = correctLetter === userLetter;

    // Mark incorrect cells
    if (!correct) {
        document.getElementById("fill_" + activeCellID).style.color = "red";
        userfillColors[i] = "red";
    }
    // Mark correct cells
    else {
        if (document.getElementById(activeCellID).classList[0] === "blackCell") {
            document.getElementById("fill_" + activeCellID).style.color = "black";
            userfillColors[i] = "black";
        }
        else {
            document.getElementById("fill_" + activeCellID).style.color = "darkblue";
            userfillColors[i] = "darkblue";
        }
    }

    localStorage.setItem(puzzleUserfillColorsID, JSON.stringify(userfillColors));

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

// Reveal current cell
function revealCell(activeCellID, answers, userfill, puzzleUserfillID) {

    j = parseInt(activeCellID) - 1;

    // Get correct answer
    correctLetter = answers[j];

    // Fill cell with correct answer
    document.getElementById("fill_" + activeCellID).value = correctLetter;
    if (document.getElementById(activeCellID).classList[0] === "blackCell") {
        document.getElementById("fill_" + activeCellID).style.color = "black";
    }
    else {
        document.getElementById("fill_" + activeCellID).style.color = "darkblue";
    }

    // Update userfill
    userfill = userfill.substring(0,j) + correctLetter + userfill.substring(parseInt(activeCellID));
    localStorage.setItem(puzzleUserfillID, JSON.stringify(userfill));
    
    // Update userfill colors
    if (document.getElementById(activeCellID).classList[0] === "blackCell") {
        userfillColors[j] = "black";
    }
    else {
        userfillColors[j] = "darkblue";
    }
    localStorage.setItem(puzzleUserfillColorsID, JSON.stringify(userfillColors));

    return [userfill, userfillColors];
}

// Reveal current word
function revealWord(activeCellID, answers, userfill, puzzleUserfillID) {

    // Reveal current word
    activeWordLength = getActiveWordLength(activeCellID);
    if (activeDirection === "across") {
        firstLetter = document.getElementsByClassName(document.getElementById(activeCellID).classList[1])[0].id;
        for (let i = 0; i < activeWordLength; i++) {
            endCellID = (parseInt(firstLetter) + i).toString();
            [userfill, userfillColors] = revealCell(endCellID, answers, userfill, puzzleUserfillID);
        }
    }
    else {
        firstLetter = document.getElementsByClassName(document.getElementById(activeCellID).classList[2])[0].id;
        for (let i = 0; i < activeWordLength; i++) {
            endCellID = (parseInt(firstLetter) + (i*n)).toString();
            [userfill, userfillColors] = revealCell(endCellID, answers, userfill, puzzleUserfillID);
        }
    }

    return [userfill, userfillColors];

}

// Reveal grid
function revealGrid(answers, puzzleUserfillID) {

    // Reveal grid
    for (let i = 1; i < (n*n) + 1; i++) {
        [userfill, userfillColors] = revealCell(i.toString(), answers, userfill, puzzleUserfillID);
    }

    return [userfill, userfillColors];

}

/////////////////////////////////

// Pad digits
function pad(m) {
    if (parseInt(m) <= 9) {
        return "0" + m;
    }
    else {
        return m;
    }
}

// Increment timer
function incrementTimer(puzzleTimeID) {

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
        var timeToShow = pad(totalMinutes) + ":" + pad(totalSeconds);
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

        // Save current time bits to local storage
        var timeToSave = [timeToShow, totalSeconds, totalMinutes, totalHours, totalDays].join("_");
        localStorage.setItem(puzzleTimeID, JSON.stringify(timeToSave));
        
    }
    
}

/////////////////////////////////

// Update clue header visibility
function updateClueHeaders(activeHeader, activeClues, inactiveHeader, inactiveClues) {
    // Update active clue style
    activeHeader.style.color = "black";
    activeClues.style.display = "block";
    activeClues.style.visibility = "visible";

    // Update inactive clue style
    inactiveHeader.style.color = "gray";
    inactiveClues.style.display = "none";
    inactiveClues.style.visibility = "hidden";
}

// Switch visible clue direction if no keyboard and vertical stacked grid/cluebox
function switchVisibleClues(newAcrossCluesHeader, newAcrossClues, newDownCluesHeader, newDownClues) {
    if (activeDirection === "down") {
        updateClueHeaders(newDownCluesHeader, newDownClues, newAcrossCluesHeader, newAcrossClues);
    }
    else {
        activeDirection = "across";
        updateClueHeaders(newAcrossCluesHeader, newAcrossClues, newDownCluesHeader, newDownClues);
    }
}