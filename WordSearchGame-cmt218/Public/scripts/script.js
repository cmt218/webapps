var HOST = "cse264.info:3000";
//var HOST = "localhost:3000";
var SERVER = "http://" + HOST + "/";

// Utility method for encapsulating the jQuery Ajax Call
function doAjaxCall(method, cmd, params, fcn) {
    $.ajax(
            SERVER + cmd,
            {
                type: method,
                processData: true,
                data: params,
                dataType: "json",
                success: function (result) {
                    fcn(result)
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Error: " + jqXHR.responseText);
                    alert("Error: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            }
    );
}

var myid = 0;

function login(loginname) {
    doAjaxCall("GET", "wordsearch/login", {username: loginname},
    function (result) {
        myid = result.id;
        $("#lname").html(loginname)
        loadPuzzle(myid);
    });
}

var gnrows;
var gncols;
function loadPuzzle(id){
    doAjaxCall("GET", "wordsearch/puzzle", {id: id},
    function (result) {
        gnrows = result.nrows;
        gncols = result.ncols;
        $("#grid").empty();
        $('#lname').append("<br>Theme: " + result.theme);
        
        for (var i = 0; i < gnrows; i++) {
        var nextRow = $("<tr></tr>");
        for (var j = 0; j < gncols; j++) {
            var newCell = $("<td></td>");
            $(newCell).html('');
            $(newCell).append(result.grid.charAt(i*gnrows + j));
            $(newCell).attr("id",i*gnrows+j);
            $(nextRow).append(newCell);
        }
        $("#grid").append(nextRow);
    }
    });
}

function submit(selected){
    //console.log(selected);
    doAjaxCall("GET", "wordsearch/submit", {id:myid, letters:selected}, 
        function (result) {
            alert(result.success);
        });
}

var selected = [];
function attachEventHandlers() {
    $("#login").click(function () {
        login($("#loginname").val());
        $("#loginname").val("");

    });

    $("#submit").click(function () {
        submit(selected);
        $(".selected").css("background-color", "white");
        $(".selected").attr("class", "unselected");
        selected = [];
    });

    $("#hand").on('click','td', function() {
        var idnum = $(this).attr("id");
        if($(this).attr("class") != "selected" && $(this).attr("class") != "otherUser" && $(this).attr("class") != "ssolved"){
            $(this).attr("class", "selected")
            $(this).css("background-color","blue");
            selected.push({r: Math.floor(idnum/gnrows), c: idnum % gnrows});
        }
        else if($(this).attr("class") == "otherUser"){
            $(this).attr("class", "ssolved");
            $(this).css("background-color","purple");
            selected.push({r: Math.floor(idnum/gnrows), c: idnum % gnrows});
        }
        else if($(this).attr("class") == "ssolved"){
            $(this).attr("class", "otherUser");
            $(this).css("background-color","yellow");
            var find;
            var i;
            for(i=0;i<selected.length;i++){
                if(selected[i].r == Math.floor(idnum/gnrows) && selected[i].c == idnum % gnrows){
                    find = i;
                    selected.splice(find, 1);
                }
            }
        }
        else{
            $(this).css("background-color", "white");
            $(this).attr("class", "unselected");
            var index;

            for(i in selected){
                if(selected[i].r == Math.floor(idnum/gnrows) && selected[i].c == idnum % gnrows){
                    index = i;
                    selected.splice(index, 1);
                }
            }
        }
    });
}

//taken from setgame demo
function loadStatus(players) {
    var usergrid = "";
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var row = "<tr style='background-color:" + (player.winner ? "gold" : "white") + "'>" +
                "<td>" + player.name + "</td>" +
                "<td>" + player.score + "</td>" +
                "<td>" + player.winner + "</td>" +
                "</tr>";
        usergrid += row;
    }
    $("#userlist tbody").html(usergrid);
}

function loadGrid(update) {
    var i;
    var x;
    for(i=0; i<update.words.length; i++){
        for(x=0; x<update.words[i].letters.length; x++){
            var row = parseInt(update.words[i].letters[x].r);
            var col = parseInt(update.words[i].letters[x].c);
            var ident = row*gnrows + col;
            $("#"+ident).css("background-color", "yellow");
            $("#"+ident).attr("class","otherUser")
        }
    }
}

//taken from setgame demo
$( () => {
    attachEventHandlers();
    var socket = io.connect(SERVER);
    socket.on('players', function (players) {
        loadStatus(players);
    });
    socket.on('gridupdates', function (update) {
        loadGrid(update);
    });
});

