var connect = "http://cse264.info:3000/";

//shortcut for performing ajax calls
function doAjaxCall(method, cmd, params, fcn) {
    $.ajax(
            connect + cmd,
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
var clicked = [];
var globalrows;
var globalcolumns;

//on page load initialize sockets and attach event handlers
$( () => {
    attachEventHandlers();
    var socket = io.connect(connect);

    socket.on('players', function (players) {
        loadboard(players);
    });

    socket.on('gridupdates', function (update) {
        loadpuzzle(update);
    });
});

//handle various button clicks
function attachEventHandlers() {
    $("#registerbutton").click(function () {
        register($("#registername").val());
        $("#registername").val("");
    });

    $("#puzzle").on('click','td', function() {
    	if($(this).attr("class") != "clicked" && $(this).attr("class") != "solved" && $(this).attr("class") != "clickedsolved"){
    		$(this).attr("class", "clicked");
    		$(this).css("background-color","purple");
    		clicked.push({r: Math.floor($(this).attr("id")/globalrows), c: $(this).attr("id") % globalrows});
    	}
    	else if($(this).attr("class") == "solved"){
    		$(this).attr("class", "clickedsolved");
    		$(this).css("background-color","yellow");
    		clicked.push({r: Math.floor($(this).attr("id")/globalrows), c: $(this).attr("id") % globalrows});
    		//do nothing
    	}
    	else if($(this).attr("class") == "clickedsolved"){
    		$(this).attr("class", "solved");
    		$(this).css("background-color","red");
    		var find;
    		var i;
    		for(i=0;i<clicked.length;i++){
    			if(clicked[i].r == Math.floor($(this).attr("id")/globalrows) && clicked[i].c == $(this).attr("id") % globalrows){
    				find = i;
    				clicked.splice(find, 1);
    			}
    		}
    	}
    	else{
    		$(this).css("background-color", "white");
    		$(this).attr("class", "");
    		var find;
    		var i;
    		for(i=0;i<clicked.length;i++){
    			if(clicked[i].r == Math.floor($(this).attr("id")/globalrows) && clicked[i].c == $(this).attr("id") % globalrows){
    				find = i;
    				clicked.splice(find, 1);
    			}
    		}
    	}
    });

    $("#submit").click(function() {
    		submitword(clicked);
    		$(".clicked").css("background-color", "white");
    		$(".clicked").attr("class", "");
    		clicked = [];
    });
}

//registers the new user and appends their name
function register(registername) {
    doAjaxCall("GET", "wordsearch/login", {username: registername},
    function (result) {
        myid = result.id;
        $("#putname").html(registername)
        getsearch(myid);
    });
}

//populate the word search table
function getsearch(id){
    doAjaxCall("GET", "wordsearch/puzzle", {id: id},
    function (result) {
        globalrows = result.nrows;
        globalcolumns = result.ncols;
        $("#puzzle").empty();
        $('#putname').append("<br>Theme: " + result.theme);
        
        for (var i = 0; i < result.nrows; i++) {
        	var newRow = $("<tr></tr>");
        	for (var j = 0; j < result.ncols; j++) {
            	var newCell = $("<td></td>");
            	$(newCell).html('');
            	$(newCell).append(result.grid.charAt(i*result.nrows + j));
            	$(newCell).attr("id",i*result.nrows+j);
            	$(newRow).append(newCell);
        	}
        $("#puzzle").append(newRow);
    }
    });
}

//submit selected letters
function submitword(word){
	doAjaxCall("GET", "wordsearch/submit", {id:myid, letters:word}, 
        function (result) {
    });
}

//get real time scoreboard updates
function loadboard(players){
	var usergrid = "";
    for (var i = 0; i < players.length; i++) {
        var current = players[i];
        var row = "<tr style='background-color:" + (current.winner ? "gold" : "white") + "'>" +
                "<td>" + current.name + "</td>" +
                "<td>" + current.score + "</td>" +
                "<td>" + current.winner + "</td>" +
                "</tr>";
        usergrid += row;
    }
    $("#users tbody").html(usergrid);
}

//get real time puzzle updates
function loadpuzzle(update){
	var a;
    var b;
    var len = update.words.length;
    for(a=0; a<len; a++){
        var len2 = update.words[a].letters.length; 
        for(b=0; b<len2; b++){
            var r = parseInt(update.words[a].letters[b].r);
            var c = parseInt(update.words[a].letters[b].c);
            var id = r*globalrows + c;
            $("#"+id).css("background-color", "red");
            $("#"+id).attr("class","solved");
        }
    }
}
