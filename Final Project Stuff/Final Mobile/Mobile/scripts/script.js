//Cole Tomlinson final web app 


function movePlane() {
	// Recalculate direction of the Plane.
	if (this.x + this.image.width  >= 600){
		this.dirX = -this.dirX;
		$("#b"+this.n).attr("src", "styles/img/plane2.png");
		this.turnt = -1;
	}
	if (this.y + this.image.height >= 800) this.dirY = -this.dirY;
	if (this.x <= 0){
		this.dirX = -this.dirX;
		$("#b"+this.n).attr("src", "styles/img/plane.png");
		this.turnt = 1;
	}
	if (this.y <= 0) this.dirY = -this.dirY;

	// Update the coordinates.
	this.x += this.dirX;
	//this.y += this.dirY;

	// Reposition the Plane Image.
	this.image.style.left = this.x + "px";
	this.image.style.top = this.y + "px";
}

// Move each Plane in the list one unit in it's current direction
function moveAllPlanes() {
	for (var i = 0; i < Plane.list.length; ++i)
		if(Plane.list[i] != null){
			Plane.list[i].move();
		}
}

var t;
// Update the position of the images every millisecond
var a = 0;
var secs = 20;
function timer(){
	a++;
	Plane.moveAll();
	moveAllBullets();
	if(a%525 == 0){
		addPlane();
	}
	if(a%500 == 0){
		secs --;
		appendTime();
	}

	if(secs == 0){
		$(".plane").remove();
		alert("You Scored "+ score);
		secs = 20;
		Plane.list = [];
		score = 3;
		updateScore();
	}
	if(secs > 0){
		t = setTimeout("timer()",1);
	}
}

function launchPlane() {
	// Create an IMG element using the DOM methods
	var imageElement = document.createElement("img"); // <img src="".......>
	imageElement.setAttribute("id", "b" + this.n);
	imageElement.setAttribute("class", "plane");
	imageElement.setAttribute("src", "styles/img/plane.png");
	imageElement.style.position = "absolute";

	// Add the IMG element to the BODY element
	body.appendChild(imageElement)

	// Save reference to IMG element as instance property
	this.image = document.getElementById("b" + this.n);

	// Start the animation timer if this is the first Plane.
	if (this.n <= 0)
		timer();
}

// Constructor for Plane objects
function Plane(x, y, speed, dirx, diry) {
    this.n = Plane.next++;
	Plane.list[this.n] = this;
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.dirX = dirx;
	this.dirY = diry;
	this.image = null;
	this.turnt = 1;
}

Plane.prototype.launch = launchPlane; // Instance method
Plane.prototype.move = movePlane; // Instance method
Plane.moveAll = moveAllPlanes; // Class method
Plane.next = 0; // Class property
Plane.list = new Array(); // Class property

// Create a new Plane object and set it in motion.
function addPlane() {
    x = new Plane(1, 50, 0, 1, 2);
    x.launch();
}
			


var body;	
$( () => {
    body = document.getElementsByTagName("body")[0];
    attachEventHandlers();
	timer();
	updateScore();
	alert("Ready?");
});

function attachEventHandlers() {
    $(".launch").click(function () {
        shootBullet();
    });
}



/* ALL BULLET MOTION LOGIC*/
var bullID = 0;

function shootBullet(){
	score -= 1;
	updateScore();
	// Create an IMG element using the DOM methods
	var imageElement = document.createElement("img"); // <img src="".......>
	imageElement.setAttribute("class", "bullet");
	imageElement.setAttribute("id",bullID);
	imageElement.setAttribute("src", "styles/img/bullet.png");
	imageElement.style.position = "absolute";
	imageElement.style.top = "700px";
	// Add the IMG element to the BODY element
	body.appendChild(imageElement)
}

function moveAllBullets() {
	$(".bullet").each(function(){
		var n = $(this);
		n.css('top', (parseFloat(n.css('top')) - 3) + 'px');	
		n.css('left', 300);
		var id = parseInt(n.attr("id"));
		n.attr("id", id+1);
		if(id > 240 && id < 258){
			checkHit(id);
		}
		if(id > 270){
			n.remove();
		}
	});
}

var score = 3;
function checkHit(id){
	for (var i = 0; i < Plane.list.length; ++i){

		if(Plane.list[i] != null){
			var cur = Plane.list[i];
			if(cur.x + cur.image.width > 300 && cur.x < 300){
				//alert("hit");
				//remove logic
				$("#b"+cur.n).remove();
				Plane.list.splice(i,1);
				score += 3;
				updateScore();
			}
		}	
	}
}

function updateScore(){
	$("#putScore").html(score);
}

function appendTime(){
	$("#putTime").html(secs);
}