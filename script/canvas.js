console.log("Canvas JS running");
var canvas = document.getElementById("mainCanvas");
var paddingLeft = window.getComputedStyle(canvas.parentNode).getPropertyValue("padding-left");
var paddingRight = window.getComputedStyle(canvas.parentNode).getPropertyValue("padding-right");
paddingLeft = paddingLeft.substring(0,paddingLeft.length-2);
paddingRight = paddingRight.substring(0,paddingRight.length-2);
console.log("Padding Left: \"" +  window.getComputedStyle(canvas.parentNode).getPropertyValue("padding-left") + "\"");
var width = canvas.width = canvas.parentNode.offsetWidth - paddingLeft - paddingRight;
var height = canvas.height = Math.round(9*(width/16));

var ctx = canvas.getContext('2d');
var frameCount=0;


//My area :)

Circle = {
	x:0,
	y:0,
	dx:0,
	dy:0,
	radius:0,
	r:255,
	g:255,
	b:255,
	setup(x,y,dx,dy,radius){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
	},
	setColour(r,g,b){
		this.r = r;
		this.g = g;
		this.b = b;
	},
	update(){
		this.dy+=0.6;
		this.x+=this.dx;
		this.y+=this.dy;
		if(this.x<this.radius&&this.dx<0){
			this.dx=-this.dx;
			this.x=this.radius-(this.x-this.radius);
		}
		if(this.x>width-this.radius&&this.dx>0){
			this.dx=-this.dx;
			this.x=width-this.radius-(this.x-(width-this.radius));
		}
		if(this.y<this.radius&&this.dy<0){
			this.dy=-this.dy;
			this.y=this.radius-(this.y-this.radius);
		}
		if(this.y>height-this.radius&&this.dy>0){
			this.dy=-this.dy;
			this.y=height-this.radius-(this.y-(height-this.radius));
		}
	},
	draw(){
		fill(this.r,this.g,this.b);
		circle(this.x,this.y,this.radius);
	}
	
	
}

var x, y;
var dx, dy;
var radius;
var circles = [];
function setup(){
	for(i=0;i<100;i++){
		newCircle = Object.create(Circle);
		x=width/2;
		y=height/2;
		ang = randomf(0,Math.PI*2);
		speed = random(20,40);
		dx=speed*Math.cos(ang);
		dy=speed*Math.sin(ang);
		radius = random(30,40);
		newCircle.setup(x,y,dx,dy,radius);
		newCircle.setColour(random(0,255),random(0,255),random(0,255));
		circles.push(newCircle);
	}
}

function draw(){
	
	
	fill(200);
	background();
	fill(255,0,0);
	rect((100+frameCount*10)%(100+width)-100,100,100,100);
	
	
	
	for(i=0;i<circles.length;i++){
		circles[i].update();
		circles[i].draw();
	}
	console.log("frame");
}





//leaving my area




fill(150);
background();
setup();

setInterval(drawF,16);

function drawF(){
	frameCount++;
	draw();
}

//drawing functions

function background(){
	ctx.fillRect(0, 0, width, height);
}
function fill(r,g,b){
	if(g==null){
		ctx.fillStyle = 'rgb('+r+', '+r+', '+r+')';
	}else{
		ctx.fillStyle = 'rgb('+r+', '+g+', '+b+')';
	}
}

function rect(x,y,w,h){
		ctx.fillRect(x,y,w,h);
	if(stroke>0){
		ctx.strokeRect(x,y,w,h);
	}
}

function circle(x,y,r){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI, false);
	ctx.fill();
}

function stroke(r,g,b){
	if(!g){
		ctx.strokeStyle = 'rgb('+r+', '+r+', '+r+')';
	}else{
		ctx.strokeStyle = 'rgb('+r+', '+g+', '+b+')';
	}
}

function strokeWeight(newWeight){
	ctx.lineWidth = newWeight;
}

function noStroke(){
	ctx.lineWidth = 0;
}

function random(min, max){
	return Math.floor((Math.random() *( max-min)) + min);
}
function randomf(min, max){
	return Math.random() * ( max-min) + min;
}