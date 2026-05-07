// PART 1: Generate n x n grid

// Global variables: to copy from xword_gui_read_cfp.py
const blackCellIDs = [6, 11, 21, 26, 36, 41, 46, 47, 48, 69, 74, 75, 82, 83, 88, 89, 90, 94, 110, 111, 115, 116, 132, 136, 137, 138, 143, 144, 151, 152, 157, 178, 179, 180, 185, 190, 200, 205, 215, 220];
var acrossWordNums = [1, 6, 10, 14, 15, 16, 17, 18, 19, 20, 23, 26, 27, 28, 29, 30, 36, 38, 39, 40, 45, 46, 47, 49, 50, 52, 55, 56, 57, 61, 62, 63, 64, 65, 66];
var downWordNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24, 25, 28, 31, 32, 33, 34, 35, 37, 41, 42, 43, 44, 48, 49, 50, 51, 52, 53, 54, 58, 59, 60];
var acrossWordIDs = [1, 7, 12, 16, 22, 27, 31, 37, 42, 49, 61, 70, 76, 84, 91, 95, 106, 112, 117, 121, 133, 139, 145, 153, 158, 166, 181, 186, 191, 196, 201, 206, 211, 216, 221];
var downWordIDs = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14, 15, 51, 56, 61, 62, 63, 84, 97, 98, 103, 104, 105, 109, 125, 126, 130, 131, 147, 153, 158, 159, 166, 167, 172, 193, 194, 195];
var acrossClues = ['Case of emergency?', '.docx alternatives', 'Letters before Q?', 'Establish as fact', 'BrontÃ«\'s "Jane ___"', "Pupil's surrounding", 'Skedaddle', 'Plot', 'Demure', '[Milky, high, Broad; GPA, MPG, PPG]', 'Gradually substitute', 'Put in order', '"Game of Thrones" actress Clarke', 'Hindu spring festival', 'Owns', '[Kaepernick, Hawk, Hamm; Ponzi, Madoff, Delvey]', "Couture's Wintour", '"Lmao"', 'Patella place', '[0, 1, more cowbell; Ross, Marley, Dylan]', 'I.R.S. expert', 'The "B" of Roy G. Biv', 'Bona fide', 'Sonic the Hedgehog game company', 'Core rollers', '[cashew, pistachio, pecan; dead, lightning, Usain]', 'Dead lines?', '2021 film written in ASL and English', 'Novelist Calvino', 'Nevada slots city', 'Winners of a 1932 Australian "war"', 'Moth-repellent wood', 'Peeves', 'Shoulder muscle, briefly', 'Krispy ___'];
var downClues = ['Map app technology', 'Tolkien monster', '"Get off the stage!"', 'Declaration', 'Be rewarded, as for waiting tables', '"We don\'t have Coke, is ___ okay?"', 'Actor Sprouse of "The Suite Life on Deck"', 'Actress Drescher', 'Passes along', 'Poem with an AABBA rhyme scheme', 'Like Gatsby', 'Well, in both French and Spanish', 'Disapproving sounds', 'Twelve months', 'Go bad, in a way', '2006 Amy Winehouse hit', 'Muscat resident', "T'wasn't present?", 'Angel costume piece', 'Ye ___ Shoppe', 'Have a good cry', 'Perfectly timed', 'Only country with a nonrectangular flag', 'Makes watertight, say', 'The "snow" in "The Wizard of Oz" (1939)', 'It helps turn a pond green', 'Full of subtlety', 'Have a good cry', "Comic's gimmick", 'Employee at a game company', 'Reek', 'Kareem ___-Jabbar', "Toot one's own horn", 'Sushi wrapper', 'Lyft competitor', 'Part of a mosque, typically', 'End to lemon or lime', 'On the ___ (fleeing)', "It's not in your veins (but it is in mine)"];
var answers = "GOBAG.PDFS.LGBTPROVE.EYRE.IRISSCOOT.PLAN.MEEK...WAYSANDMEANSROTATEIN.SORT..EMILIA..HOLI...HAS.PROSANDCONSANNA..LOL..KNEEBITSANDBOBS.CPA...BLUE..ACTUAL..SEGA.ABWHEELSNUTSANDBOLTS...OBIT.CODA.ITALORENO.EMUS.CEDARIRKS.DELT.KREME";
var puzzleInfo = ['Pros and Cons', 'Tuesday Crossword, March 23, 2026', 'By Jaeda Woodruff / Edited by Jaeda Woodruff'];

// Global variables
var i = 1;
var a = 0;
var b = 0;
var b_alt = 0;
var n = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--n'));
var activeCellID = null;
var autocheckOn = false;

/////////////////////////////////////

// PART 1: GENERATE PAGE INFO

// Set meta page name
document.getElementById("tabTitle").textContent = puzzleInfo[1];

// Set puzzle info
document.getElementById("puzzleTitle").textContent = puzzleInfo[0];
document.getElementById("puzzleDate").textContent = puzzleInfo[1];
document.getElementById("puzzleAuthor").textContent = puzzleInfo[2];

/////////////////////////////////////

// PART 2: GENERATE GRID

// Get elements
var newGrid = document.getElementById("grid");

// Create word start list
var wordStartList = Array.from(new Set(acrossWordIDs.concat(downWordIDs))).sort(function (a, b) {  return a - b;  });

// Create new cell elements
for (let x = 1; x < (n*n) + 1; x++) {

    // Update pointers
    if (acrossWordIDs.slice(1,acrossWordIDs.length).includes(x)) {
        a = a + 1;
    }
    if (downWordIDs.slice(1,downWordIDs.length).includes(x)) {
        b = b + 1;
    }
    else if (x != downWordIDs.slice(0,1) && !blackCellIDs.includes(x)) {
        b_alt = document.getElementById(x-n).classList[2];
    }

    // Create + label new cells
    const newCell = document.createElement("div");
    if (blackCellIDs.includes(x)) {
        newCell.classList.add("blackCell");
        newCell.setAttribute("id", x);
    }
    else {
        newCell.classList.add("cell");
        newCell.setAttribute("id", x.toString());
        if (wordStartList.includes(x)) {
            newCell.textContent = i;
            i = i + 1;
        }
        
        // Update across word labels
        newCell.classList.add(acrossWordNums[a].toString() + "across");
        
        // Update down word labels
        if (downWordIDs.slice(0,downWordIDs.length).includes(x)) {
            newCell.classList.add(downWordNums[b].toString() + "down");
        }
        else {
            newCell.classList.add(b_alt);
        }

        // Listen for clicks
        newCell.addEventListener("click", function(event) {
            
            // If single click, highlight word
            if (event.detail === 1) {
                handleCellClick(this.id);
            }

            // If double click, switch direction and highlight new word
            else if (event.detail === 2) {
                switchActiveDirection();
                handleCellClick(this.id);
            }

            // Save active cell ID
            activeCellID = this.id;

        });

    }

    // Add new cell elements to page
    newGrid.appendChild(newCell);

    // Create new fill element + add to page
    fillID = "fill_" + x.toString();
    const newCellFill = document.createElement("div");
    newCellFill.classList.add("userFill");
    newCellFill.setAttribute("id", fillID);
    newCell.appendChild(newCellFill);

}

/////////////////////////////////////

// PART 2: GENERATE CLUES

// Get elements
var newCluesBucket = document.getElementById("cluesBucket");

// Get across elements
var newAcrossCluesBucket = document.getElementById("acrossCluesBucket");
var newAcrossCluesHeader = document.getElementById("acrossCluesHeader");
var newAcrossClues = document.getElementById("acrossClues");

// Create across clues
for (let x = 1; x < acrossClues.length + 1; x++) {
    
    // Add boxes
    clueID = acrossWordNums[x-1].toString() + "acrossClue";
    var newClueBox = document.createElement("div");
    newClueBox.classList.add("clueBox");
    newClueBox.classList.add("acrossClueBox");
    newClueBox.setAttribute("id", clueID);

    // Add event listener for boxes
    newClueBox.addEventListener("click", function() {

        // Handle clue box click + save active cell ID
        activeCellID = handleClueBoxClick(this.id);
                
    });
    newAcrossClues.appendChild(newClueBox);

    // Add clue partial highlight
    var newClueIndicator = document.createElement("div");
    newClueIndicator.classList.add("clueIndicator");
    newClueIndicator.setAttribute("id", clueID + "_INDICATOR");
    newClueBox.appendChild(newClueIndicator);

    // Add clue numbers
    var newClueNum = document.createElement("div");
    newClueNum.textContent = acrossWordNums[x-1];
    newClueNum.classList.add("clueNum");
    newClueNum.setAttribute("id", clueID + "_NUM");
    newClueBox.appendChild(newClueNum);

    // Add clue text
    var newClueText = document.createElement("div");
    newClueText.textContent = acrossClues[x-1];
    newClueText.classList.add("clueText");
    newClueText.setAttribute("id", clueID + "_TEXT");
    newClueBox.appendChild(newClueText);

}

// Get down elements
var newDownCluesBucket = document.getElementById("downCluesBucket");
var newDownCluesHeader = document.getElementById("downCluesHeader");
var newDownClues = document.getElementById("downClues");

// Create down clues
for (let x = 1; x < downClues.length + 1; x++) {
    
    // Add boxes
    clueID = downWordNums[x-1].toString() + "downClue";
    var newClueBox = document.createElement("div");
    newClueBox.classList.add("clueBox");
    newClueBox.classList.add("downClueBox");
    newClueBox.setAttribute("id", clueID);

    // Add event listener for boxes
    newClueBox.addEventListener("click", function() {
        handleClueBoxClick(this.id);
    });
    newDownClues.appendChild(newClueBox);

    // Add clue partial highlight
    var newClueIndicator = document.createElement("div");
    newClueIndicator.classList.add("clueIndicator");
    newClueIndicator.setAttribute("id", clueID + "_INDICATOR");
    newClueBox.appendChild(newClueIndicator);

    // Add clue numbers
    var newClueNum = document.createElement("div");
    newClueNum.textContent = downWordNums[x-1];
    newClueNum.classList.add("clueNum");
    newClueNum.setAttribute("id", clueID + "_NUM");
    newClueBox.appendChild(newClueNum);

    // Add clue text
    var newClueText = document.createElement("div");
    newClueText.textContent = downClues[x-1];
    newClueText.classList.add("clueText");
    newClueText.setAttribute("id", clueID + "_TEXT");
    newClueBox.appendChild(newClueText);

}

/////////////////////////////////////

// PART 4: KEYSTROKES

// Listen for keystrokes
document.addEventListener("keydown", function(event) {

    // Move right
    if (event.key === "ArrowRight") {
        event.preventDefault();
        if (activeDirection === "across") {
            activeCellID = moveRight(activeCellID);
            handleCellClick(activeCellID);
        }
        else {
            switchActiveDirection();
            activeCellID = moveLeft(activeCellID);
        }
    }

    // Move left
    else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (activeDirection === "across") {
            activeCellID = moveLeft(activeCellID);
            handleCellClick(activeCellID);
        }
        else {
            switchActiveDirection();
            activeCellID = moveRight(activeCellID);
        }
    }

    // Move up
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (activeDirection === "down") {
            activeCellID = moveUp(activeCellID);
            handleCellClick(activeCellID);
        }
        else {
            switchActiveDirection();
            activeCellID = moveDown(activeCellID);
        }
    }

    // Move down
    else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (activeDirection === "down") {
            activeCellID = moveDown(activeCellID);
            handleCellClick(activeCellID);
        }
        else {
            switchActiveDirection();
            activeCellID = moveUp(activeCellID);
        }
    }

    // If click backspace, clear cell and move back a space
    else if (event.key === "Backspace") {

        // Fill cell with blank
        document.getElementById("fill_" + activeCellID).textContent = "";
        
        // Move back
        if (activeDirection === "across") {
            activeCellID = moveLeft(activeCellID);
        }
        else {
            activeCellID = previousDownLetter(activeCellID, downWordNums, downWordIDs);//previousDownLetter(activeCellID);
        }

        // Handle cell click
        handleCellClick(activeCellID);
    }

    // If it's enter or tab, move to next word
    else if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        activeCellID = nextWord(activeCellID, downWordNums, downWordIDs);
        handleCellClick(activeCellID);
    }

    // If it's a spacebar, do not autoscroll
    else if (event.key === " ") {
        event.preventDefault();
        activeCellID = fillCell(activeCellID, event.key, downWordNums, downWordIDs);
        handleCellClick(activeCellID);
    }

    // If it's a letter/digit key, fill cell
    else if (event.key.length === 1) {

        // Fill cell
        var initialActiveCellID = activeCellID;
        activeCellID = fillCell(activeCellID, event.key, downWordNums, downWordIDs);
        handleCellClick(activeCellID);

        // Autocheck if on!
        if (autocheckOn === true) {
            checkGrid(answers);
        }

        // Update gray cells
        grayClues(initialActiveCellID, activeDirection);

    }

});

/////////////////////////////////////

// PART 5: OTHER EVENT LISTENERS

// Get elements
var newTimerButton = document.getElementById("timer");
var newPencilButton = document.getElementById("pencilButton");
var newClearButton = document.getElementById("clearButton");
var newSTStart = document.getElementById("stStart");
var newTMPopupQuestion = document.getElementById("tmPopupQuestion");
var newTMContinue = document.getElementById("tmContinue");
var newCCPopupQuestion = document.getElementById("ccPopupQuestion");
var newCCClear = document.getElementById("ccClear");
var newCCCancel = document.getElementById("ccCancel");
var newCheckButton = document.getElementById("checkButton");
var newCheckMenu = document.getElementById("checkMenu");
var newCheckLetterButton = document.getElementById("checkLetterButton");
var newCheckWordButton = document.getElementById("checkWordButton");
var newCheckGridButton = document.getElementById("checkGridButton");
var newAutoCheckButton = document.getElementById("autocheckButton");
var timerPaused = true;

// Start puzzle popup
newSTStart.addEventListener("click", function () {
    hideDiv("stPageMainBlur");
    hideDiv("stStart");
    timerPaused = false;
});

// Start timer
incrementTimer();

// Timer button
newTimerButton.addEventListener("click", function () {
    if (timerPaused === false) {
        // Show new popup
        showDiv("tmPageMainBlur");
        showDiv("tmContinue");
        newTMPopupQuestion.textContent = "Timer paused. Want to continue?";
        // Hide old popups
        hideDiv("ccPageMainBlur");
        hideDiv("ccButtonsBox");
        timerPaused = true;
    }
});
newTMContinue.addEventListener("click", function () {
    hideDiv("tmPageMainBlur");
    hideDiv("tmContinue");
    timerPaused = false;
});

// Pencil button
newPencilButton.addEventListener("click", function () {
    togglePencil();
});

// Clear button
newClearButton.addEventListener("click", function () {
    if (timerPaused === false) {
        // Show new popup
        showDiv("ccPageMainBlur");
        showDiv("ccButtonsBox");
        newCCPopupQuestion.textContent = "Are you sure you want to clear the puzzle?";
        // Hide old popups
        hideDiv("tmPageMainBlur");
        hideDiv("tmContinue");
    }
});
// Confirm clear
newCCClear.addEventListener("click", function () {
    clearGrid();
    hideDiv("ccPageMainBlur");
    hideDiv("ccButtonsBox");
});
// Confirm clear cancel
newCCCancel.addEventListener("click", function () {
    hideDiv("ccPageMainBlur");
    hideDiv("ccButtonsBox");
});

// Check button
newCheckButton.addEventListener("mouseenter", function () {
    showDiv("checkMenu");
});
newCheckButton.addEventListener("mouseleave", function () {
    hideDiv("checkMenu");
});
// Check menu
newCheckMenu.addEventListener("mouseenter", function () {
    showDiv("checkMenu");
});
newCheckMenu.addEventListener("mouseleave", function () {
    hideDiv("checkMenu");
});

// Check letter
newCheckLetterButton.addEventListener("click", function () {
    checkCell(activeCellID, answers);
});
// Check word
newCheckWordButton.addEventListener("click", function () {
    checkWord(activeCellID, answers);
});
// Check grid
newCheckGridButton.addEventListener("click", function () {
    checkGrid(answers);
});

// Autocheck command (click)
newAutoCheckButton.addEventListener("click", function () {
    if (autocheckOn === false) {
        autocheckOn = true;
        newAutoCheckButton.style.backgroundColor = "lightblue";
        checkGrid(answers);
    }
    else {
        autocheckOn = false;
        newAutoCheckButton.style.backgroundColor = "transparent";
    }
});
// Autocheck command (hover)
newAutoCheckButton.addEventListener("mouseenter", function () {
    newAutoCheckButton.style.backgroundColor = "lightgray";
});
newAutoCheckButton.addEventListener("mouseleave", function () {
    if (autocheckOn === true) {
        newAutoCheckButton.style.backgroundColor = "lightblue";
    }
    else {
        newAutoCheckButton.style.backgroundColor = "transparent";
    }
});