/*Cole Tomlinson*/

var currentButton;
var buttons = [];
var ident = 0;

function addWord(){
	if($("#word").val() != ""){
	var newButton = new Button(0, 0, $("#word").val(), ident);
	buttons[ident] = newButton;
	ident++;
$("body").append("<button type='button' class='word' id='" + newButton.id + "'>" + newButton.text + "</button>" );
$("#word").val("");
}
}

var Button = function (x, y, text, id) {
	this.text = text;
	this.x = x;
	this.y = y;
	this.id = id;
}

$(document).mousedown(
function(event){
var target = $(event.target);
if(target.is(".word") || target.is(".stay")){
	currentButton = target;
}
}
	);

$(document).mousemove(
function(event){
if(currentButton){
$(currentButton).css({
		top: event.clientY,
		left: event.clientX
	});

if(currentButton.is(".word")){
	var index = $(currentButton).attr("id");
	buttons[index].x = event.clientX;
	buttons[index].y = event.clientY;
}
}
}
	);

$(document).mouseup(
function(event){
	if(currentButton){
	
		if(event.clientX > 1500 && event.clientX < 1580 && event.clientY > 50 && event.clientY < 150){
			//delete code
			
			if($(currentButton).attr("class") == "word"){
				buttons[$(currentButton).attr("id")] = 0;
			}
			$("#"+$(currentButton).attr("id")).remove();
		}
	}

currentButton = null;
}
	);

$(document).ready(
	function(event){
		if(localStorage.stringed != "undefined"){
			buttons = JSON.parse(localStorage.stringed);
			ident = localStorage.ident;
			print();
		}
	}
	);

$(window).on("unload",
	function(event){
		if(ident > 0){
		localStorage.stringed = JSON.stringify(buttons);
		localStorage.ident = ident;
	}
}
	);

function print(){
	for(i in buttons){
				if(buttons[i] != 0){
				$("body").append("<button type='button' class='word' id='" + buttons[i].id + "'>" + buttons[i].text + "</button>");
				$("#"+buttons[i].id).css({
					top: buttons[i].y,
					left: buttons[i].x
				});
			}
			}
}

function clearMem(){
	ident = 0;
	buttons = [];
	$(".word").remove();
	localStorage.clear();
	print();
}
