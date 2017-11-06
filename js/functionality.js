var player = 1;
var matrix = [];
var canClick = false;


generateEmptyTable();
load();


$("#mainBoard").on("click", "td", function () {
    var td = $(this);

    if (td.find('.piesa').length === 0) { //if the clicked cell is empty then put a piece

        checkNeighbours(this.parentNode.rowIndex, this.cellIndex);
        if (canClick) {
            // if there are oponent pieces bound by the player

            //write in the matrix
            matrix[this.parentNode.rowIndex][this.cellIndex] = player;

            //display on the screen
            td.append('<div class="piesa player' + player + '"></div>');

            player = -player;
            $("#notifications").html("It's " + (player === 1 ? 'white' : 'black') + " player's turn");
            $("#notifications").append('<div class="piesa player' + player + '"></div>');
            canClick = false;

            saveData(player, matrix);
        } else {
            console.log("I'm sorry, you can not click here! Please try somewhere else!")
        }

    } else { //if the clicked cell is busy
        console.log("Cell Busy!");
    }

});

function generateEmptyTable() {
    var list = [];
    for (var i = 0; i < 8; i++) {
        list.push('<tr>');
        for (var j = 0; j < 8; j++) {
            var colorata = i % 2 ? j % 2 : ((j + 1) % 2);
            list.push('<td class="square ' + (colorata ? 'color' : '') + ' "></td>');
        }
        list.push('</tr>');
    }
    $('#mainBoard').html(list.join(''));
}

function load() {
    $.ajax('read.php', {
        cache: false,
        dataType: 'json'
    }).done(function (raspuns) {
        console.debug('contacts loaded', raspuns);
        matrix = raspuns.table;
        // fixing "-1/1" as string
        raspuns.player *= 1;
        player = raspuns.player;
        $("#notifications").html("It's " + (player === 1 ? 'white' : 'black') + " player's turn");
        $("#notifications").append('<div class="piesa player' + player + '"></div>');
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                // fixing "0" as string
                matrix[i][j] *= 1;
                var piesa = matrix[i][j];
                if (piesa) {
                    var td = $('#mainBoard tr').eq(i).find('td').eq(j);
                    td.append('<div class="piesa player' + piesa + '"></div>');
                }
            }
        }
    });

}

var arrayOfChanged = [];

function checkIfBound(rowIndex, cellIndex, num1, num2) {

    // num1 and num2 specify the direction
    // going the specified direction
    rowIndex = rowIndex + num1;
    cellIndex = cellIndex + num2;

    if (rowIndex >= 8 || rowIndex < 0 || cellIndex >= 8 || cellIndex < 0) {
        //nothing to look for in this direction
        arrayOfChanged=[];
    } else {
        if (matrix[rowIndex][cellIndex] === -player) {

            arrayOfChanged.push([rowIndex, cellIndex]);
            checkIfBound(rowIndex, cellIndex, num1, num2);

        } else if (matrix[rowIndex][cellIndex] === player && arrayOfChanged.length > 0) {
            //found the bound
            canClick = true;

            //change colors
            arrayOfChanged.forEach(function (t) {
                var row = t[0];
                var col = t[1];

                matrix[row][col] = player;

                $('#mainBoard tr').eq(row).find('td').eq(col).html('<div class="piesa player' + player + '"></div>');
            });

            //discard arrayOfChanged
            arrayOfChanged = [];
        } else {
            //not bound
            arrayOfChanged = [];
        }
    }
};

function checkNeighbours(rowIndex, cellIndex) {
    //direction top-left (-1, -1)
    checkIfBound(rowIndex, cellIndex, -1, -1);

    //direction top (-1, 0)
    checkIfBound(rowIndex, cellIndex, -1, 0);

    //direction top-right (-1, +1)
    checkIfBound(rowIndex, cellIndex, -1, 1);

    //direction right (0, +1)
    checkIfBound(rowIndex, cellIndex, 0, 1);

    //direction bottom-right (+1, +1)
    checkIfBound(rowIndex, cellIndex, 1, 1);

    //direction bottom (+1, 0)
    checkIfBound(rowIndex, cellIndex, 1, 0);

    //direction bottom-left (+1, -1)
    checkIfBound(rowIndex, cellIndex, +1, -1);

    //direction left (0, -1)
    checkIfBound(rowIndex, cellIndex, 0, -1);
}


function saveData(player, table) {
    return $.ajax('save.php', {
        dataType: 'json',
        method: 'POST',
        data: {
            player: player,
            table: table
        }
    });
}

function resetGame() {
    saveData(1, [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, -1, 0, 0, 0],
        [0, 0, 0, -1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]).always(function () {
        location.reload();
    });
}