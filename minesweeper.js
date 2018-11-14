//startTimer() starts the timer function in seconds
//endTimer() ends timer and returns what time it ended on. 
//restart() on pic click. calls addBombs(), endTimer(), bombsRemain()
//tileClick() if shift-left click then flags and calls bombsRemain() else reveals value. if value is bomb then call endGame(). if space reveal those around else just that tile.  
//endGame() endTimer(), freezes clickablility, if all bombs are flagged then update high score with time. else flip face to dead. 
//check input field values aren't beyond max

//set to true once someone clicks on a tile for first time and then back to false when timer is over. 
var r = 8;
var c = 8;
var highscore = 10000000000;

//createGameBoard() create game board and add bombs to game board. Then calculate distances.
function createGameBoard(rows, cols){
    var timer;
    $('#face').attr("src", "SmilingFace.png")
    var correctFlags = 0;
    var gameBoard = "";
    var arr = [[],[]]
    let bombs = Math.floor(Math.random() * (rows*cols - 1)) + 1;
    let placedBombs = 0;
    var flaggedBombs = 0;
    $('#board').empty();
    for(i =1; i<= rows; i++){
        for(j=1; j <= cols; j++){
            $('#board').append('<div class="space" data-row="' + i + '" data-col="' + j + '">&nbsp;</div>');
        }
        $('#board').append('<br>');
    }
    $(".space").css("pointer-events", "auto")

    while(placedBombs < bombs){
        x = Math.floor(Math.random()* rows) +1;
        y = Math.floor(Math.random() * cols) + 1;
        if($('[data-row=' + x+ '][data-col='+ y+']').hasClass("bomb") != true){
            $('[data-row=' + x+ '][data-col='+ y+']').addClass("bomb");
            placedBombs++;
        }
    }
    $("#BombsRemaing").text(placedBombs-flaggedBombs);
    for(i =1; i <= rows; i++){
        for(j = 1; j <= cols; j++){
            let c = 0;
            if($('[data-row=' + i+ '][data-col='+ j+']').hasClass("bomb")){
                c=-1;
            }else{
                if($('[data-row=' + i+ '][data-col='+ (j+1)+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + (i-1)+ '][data-col='+ (j+1)+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + (i+1)+ '][data-col='+ (j+1)+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + i+ '][data-col='+ (j-1)+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + (i-1)+ '][data-col='+ (j-1)+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + (i+1)+ '][data-col='+ (j-1)+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + (i-1)+ '][data-col='+ j+']').hasClass("bomb")){
                    c++;
                }
                if($('[data-row=' + (i+1)+ '][data-col='+ j+']').hasClass("bomb")){
                    c++;
                }
            }
            $('[data-row=' + i+ '][data-col='+ j+']').attr('data-distance', c);
        }
    }
    $('.space').on('click',function(e) {
        if(timer){
            
        }else{
            startTimer();
            timer = true;
        }
        let target = event.target
        if($(target).hasClass("visited")){
            return
        }
        if(e.shiftKey){
            if($(target).hasClass("flagged")){
                $(target).empty();
                $(target).append("&nbsp;")
                $(target).removeClass("flagged")
                if($(target).hasClass("bomb")){
                    correctFlags--;
                }
                flaggedBombs--
                $("#BombsRemaing").text(placedBombs-flaggedBombs);
            }
            else{
                $(target).append("<i class='fa fa-flag' aria-hidden='true'></i>")
                flaggedBombs++;
                $(target).addClass("flagged")
                $("#BombsRemaing").text(placedBombs-flaggedBombs);
                if($(target).hasClass("bomb")){
                    correctFlags++;
                }
                if(correctFlags == placedBombs && flaggedBombs == correctFlags){
                    gameOver(true)
                }
            }
        }
        else{
            if($(target).hasClass("flagged")){

            }
            else if($(target).hasClass("bomb")){
                $(target).addClass("visited")
                gameOver(false)
            }else{
                if($(target).hasClass("visited")){
                }else{
                    $(target).addClass("visited")
                    $(target).text($(target).data("distance"))
                    if($(target).data("distance")== 0){
                        reveal(target)
                    }
                }
            }
        }
        
      });
}
function startTimer(){
    var sec = 0;
    function pad ( val ) { return val > 9 ? val : "0" + val; }
    clock = setInterval( function(){
        $("#seconds").html(pad(++sec%60));
        $("#minutes").html(pad(parseInt(sec/60,10)));
    }, 1000);
}

function gameOver(win){
    clearInterval(clock)
    timer = false;
    $(".space").css("pointer-events", "none")
    if(win){
        secondsInWin = parseInt($('#seconds').text(), 10)
        minutesInWin = parseInt($('#minutes').text(), 10)
        secondsInWin = secondsInWin + (minutesInWin * 60)
        if(secondsInWin < highscore){
            highscore = secondsInWin;
            alert("Congratulations You Won With A New Highscore!")
            $("#HighScore").html(secondsInWin + " Seconds")
        }else{
            alert("Congratulations You Won!")
        }
    }else{
        for(i = 1; i<= r; i++){
            for(j = 1; j <= c; j++){
                $(".fa-flag").remove()
                if($('[data-row=' + i+ '][data-col='+ j+']').hasClass("bomb")){
                    $('[data-row=' + i+ '][data-col='+ j+']').css("background-color","red");
                    $('[data-row=' + i+ '][data-col='+ j+']').append("<i class='fa fa-bomb' aria-hidden='true'></i>")
                }else{
                    $('[data-row=' + i+ '][data-col='+ j+']').text($('[data-row=' + i+ '][data-col='+ j+']').data("distance"))
                    $('[data-row=' + i+ '][data-col='+ j+']').addClass("visited")
                }
            }
        }
        alert("You Lost!")
        $('#face').attr("src", "DeadFace.png")
    }
}
function restart(a,b){
    $('#minutes').text("00")
    $('#seconds').text("00")
    r = a || r;
    c = b || c;
    createGameBoard(r, c);
    clearInterval(clock);
    timer = false;
}
function tryCreate(){
    if ($('#rows').val() > 30 || $('#rows').val() < 8){
        alert("Must have between 8 and 30 rows!")
    }
    else if ($('#columns').val() > 40 || $('#columns').val() < 8){
        alert("Must have between 8 and 40 columns!")
    }else{
        r = $('#rows').val()
        c = $('#columns').val()
        createGameBoard(r, c)
    }

}
function reveal(target){
    let arr = []
    arr.push(target)
    while(arr.length > 0){
        let t = arr.shift()
        let targetRow = $(t).data("row")
        let targetCol = $(t).data("col")
        if((targetRow+1)<= r && (targetCol+1)<=c){
            if($('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol+1)+']').data("distance")==0 && !$('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol+1)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol+1)+']')
            }
            $('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol+1)+']').addClass("visited")
            $('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol+1)+']').text($('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol+1)+']').data("distance"))
        }
        if((targetRow-1)>= 1 && (targetCol-1)>=1){
            if($('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol-1)+']').data("distance")==0 && !$('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol-1)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol-1)+']')
            }
            $('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol-1)+']').addClass("visited")
            $('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol-1)+']').text($('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol-1)+']').data("distance"))
        }
        if((targetRow-1)>= 1 && (targetCol+1)<=c){
            if($('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol+1)+']').data("distance")==0 && !$('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol+1)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol+1)+']')
            }
            $('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol+1)+']').addClass("visited")
            $('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol+1)+']').text($('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol+1)+']').data("distance"))
        }
        if((targetRow+1)<= r && (targetCol-1)>=1){
            if($('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol-1)+']').data("distance")==0 && !$('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol-1)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol-1)+']')
            }
            $('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol-1)+']').addClass("visited")
            $('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol-1)+']').text($('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol-1)+']').data("distance"))
        }
        if((targetCol+1)<=c){
            if($('[data-row=' + (targetRow)+ '][data-col='+ (targetCol+1)+']').data("distance")==0 && !$('[data-row=' + (targetRow)+ '][data-col='+ (targetCol+1)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow)+ '][data-col='+ (targetCol+1)+']')
            }
            $('[data-row=' + (targetRow)+ '][data-col='+ (targetCol+1)+']').addClass("visited")
            $('[data-row=' + (targetRow)+ '][data-col='+ (targetCol+1)+']').text($('[data-row=' + (targetRow)+ '][data-col='+ (targetCol+1)+']').data("distance"))
        }
        if((targetCol-1)>=1){
            if($('[data-row=' + (targetRow)+ '][data-col='+ (targetCol-1)+']').data("distance")==0 && !$('[data-row=' + (targetRow)+ '][data-col='+ (targetCol-1)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow)+ '][data-col='+ (targetCol-1)+']')
            }
            $('[data-row=' + (targetRow)+ '][data-col='+ (targetCol-1)+']').addClass("visited")
            $('[data-row=' + (targetRow)+ '][data-col='+ (targetCol-1)+']').text($('[data-row=' + (targetRow)+ '][data-col='+ (targetCol-1)+']').data("distance"))
        }
        if((targetRow+1)<= r){
            if($('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol)+']').data("distance")==0 && !$('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol)+']')
            }
            $('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol)+']').addClass("visited")
            $('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol)+']').text($('[data-row=' + (targetRow+1)+ '][data-col='+ (targetCol)+']').data("distance"))
        }
        if((targetRow-1)>= 1){
            if($('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol)+']').data("distance")==0 && !$('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol)+']').hasClass("visited")){
                arr.push('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol)+']')
            }
            $('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol)+']').addClass("visited")
            $('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol)+']').text($('[data-row=' + (targetRow-1)+ '][data-col='+ (targetCol)+']').data("distance"))
        }
    }
}