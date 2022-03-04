/*Outline for necessary AI components...
 *
 *	Placing ships...
 *	-Using a looping function to iterate through total number of ships selected
 *	-For each random ship placement...
 *		-Generate 2 random numbers, one corresponding to a column value and the other corresponding to a row value, record this as ship location
 *			-Ex. can use JS function Math.floor(Math.random() * 10) -> this would generate a random integer from 0 to 9
 *		-Check to see if this is a valid location (using previous groups existing functionality)
 *		-For horizontal/vertical orientation -> can just go by whether one of the randomly generated numbers is even (H) or odd (V)
 *		-Check to see if this orientation will result in a valid location...
 *		-Will continue this process until the ship is placed in a valid location.
 *		-Exit the loop when all ships are placed.
 *
 *	Easy (fires randomly ever turn)...
 *	-Generate 2 random numbers using previously described method
 *	-Check to see if this is a valid place to fire (i.e. can't have a hit there already or have previously tried at this spot)
 *	-Hit
 *
 *	Medium (fires randomly until it hits a ship, then fires orthogonally in adjacent spaces until finds other hits or ship is sunk))...
 *	-Starts the same way as easy...
 *		-Generate 2 random numbers using previously described method
 *		-Check to see if this is a valid place to fire, if it is then fire
 *		-Continue until a hit occurs.
 *	-Once a hit occurs...
 *		-For next turns, mazewalk around the hit location (i.e. look up, then look right, then look down, then look left) using recursion.
 *		-Continue until hit occurs, continually for each successive turn, until the ship in question is sunk.
 *		-Then go back to easy mode (firing randomly)
 *
 *	Hard (knows where all ships are a lands a hit every turn)...
 *	-Access other player's placedGrid
 *	-Cycle through where ships are located and just hits until the ships are sunk
 *	-Should probably put in a check to ensure a hit ship is sunk until moving on to next ship (this would be the most efficient/skilled AI version of a player)
 *
 */
let orient = "up";
let offset = 1;

function setDifficulty(mode) {
    if (mode == "easy") {
        easyAI();
    }
    if (mode == "medium") {
        mediumAI();
    }
    if (mode == "medium") {
        //hardAI();
    }
}


function easyAI() {
    let cell = generateCell();

    while (isGuessed(cell)) {
        cell = generateCell();
    }
    guessCell(cell); //process the tile, placing it into board. 
}

function mediumAI() {
    if (p2Hits == 0 || targetShip == 0) { //accounts for nothing being hit or nothing being sunk
        easyAI();
    }
    else {
        let nextCell = guess4d();
        while(isGuessed(nextCell)) {
            nextCell = guess4d();
        }
        guessCell(nextCell);
    }

}

//helper to mediumAI, finding next cell to shoot by going up, left, down, or right
function guess4d() {
    let nextCell;
    let row = targetLoci[0]; //-'a';
    let col = targetLoci[1] + targetLoci[2];
    console.log(col);

    //ex b02 --> a02
    if (orient == "up") {
        let rowNum = row.charCodeAt(0) - 97;

        if (rowNum - offset >= 0) {
            rowNum = rowNum - offset;
            nextCell = String.fromCharCode(rowNum + 97) + col;
            offset++;
            console.log(nextCell);
            return nextCell;
        }
        else { // reached border, change orientation and reset offset
            orient = "right";
            offset = 1;
            guess4d();
        }

        // if(!isGuessed(nextCell)){
        //     guessCell(nextCell);
        //     offset++;
        //     return;
        // }
    }

    //ex b02--> b03
    if (orient == "right") {
        //process the column into an integer
        if (targetLoci[1] == "0") {
            col = targetLoci[2].charCodeAt(0) - 48; //convert to int version of num
        }
        else {
            col = 10 * (targetLoci[1].charCodeAt(1) - 48) + targetLoci[1].charCodeAt(2);
        }
        if (col < 10) {
            nextCell = col + offset;
            if (nextCell < 10) {
                nextCell = row + '0' + nextCell.toString();
            } else {
                nextCell = row + '10';
            }
            offset++;
            console.log(nextCell);
            return nextCell;
        }
        else {
            orient = "down";
            offset = 1;
            guess4d();
        }
        // if(!isGuessed(nextCell)){
        //     guessCell(nextCell);
        //     offset++;
        //     return;
        // }
    }

    //ex b02--> c02
    if (orient == "down") {
        
        col = targetLoci[1] + targetLoci[2];
        let rowNum = row.charCodeAt(0) - 97;
        //console.log(rowNum);

        if ((rowNum + offset) <= 10) {
            rowNum = rowNum + offset;
            nextCell = String.fromCharCode(rowNum + 97) + col.toString();
            offset++;
            console.log(nextCell);
            return nextCell;
        }
        else {
            orient == "left";
            offset = 1;
            guess4d();
        }

        // if(!isGuessed(nextCell)){
        //     guessCell(nextCell);
        //     offset++;
        //     return;
        // }
    }

    //ex b02--> b01
    if (orient == "left") {
        //process the column into an integer
        if (targetLoci[1] == "0") {
            col = targetLoci[2].charCodeAt(0) - 48; //convert to int version of num
        }
        else {
            col = 10;
        }
        //console.log(col);
        //recreate cell string
        if (col > 0) {
            col = col - 1;
            if (col < 10) {
                nextCell = row + '0' + col.toString();
            }
            else {
                nextCell = row + col.toString();
            }
            offset++;
            console.log(nextCell);
            return nextCell;
        }
        else {
            orient = "up";
            offset = 1;
            guess4d();
        }


    }
}

function randomInt(min = 1, max = 10) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateCell() {
    let row =  randomInt();
    if (row < 10) {
        row = '0' + row.toString();
    }

    const col = String.fromCharCode(randomInt() + 97); //lowercase alphabet begins at ASCII 97

    const cell = col + row.toString();
    return cell;

}

