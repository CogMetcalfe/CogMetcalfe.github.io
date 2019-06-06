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


var sqSide=13;

var grid = [];
var gridW = 150;
var gridH = 100;
var smoothness = 35;

function setup(){
	offsetX = random(-10000,10000);
	offsetY = random(-10000,10000);
	for(x=0;x<gridW;x++){
		gridRow = [];
		for(y=0;y<gridH;y++){
			var pos = {
				x: 0,
				dx: 0
			}
			//pos.x = randomf(0,1);
			pos.x = Math.abs(noise.perlin2(offsetX + x/smoothness, offsetY + y /smoothness)+randomf(0,0.01));
			gridRow.push(pos);
		}
		grid.push(gridRow);
	}
	for(i=0;i<700;i++){
		gridUpdate();
	}
	val=1.442324234;
	console.log(val + ": " + colourGrad(val));
	val=100;
	console.log(val + ": " + colourGrad(val));
	val=1000;
	console.log(val + ": " + colourGrad(val));
}

function draw(){
	//console.log("frame");
	clear();
	gridUpdate();
	gridDraw();
	//console.log(grid[0][0].x);
	//console.log(colourGrad(grid[0][0].x));
}

colours = [{x:0,r:0,g:0,b:0},
		   {x:100,r:26,g:0,b:121},
		   {x:147,r:72,g:0,b:147},
		   {x:250,r:170,g:0,b:150},
		   {x:300,r:200,g:20,b:130},
		   {x:400,r:230,g:75,b:22},
		   {x:650,r:252,g:230,b:44},
		   {x:800,r:255,g:255,b:255}];

function altCol(x){
	if(x<400){
		return toCanvasColour(255,0,0);
	}
	return toCanvasColour(0,0,255);
}

function altCol2(x){
	return toCanvasColour4(100,0,0,x*3);
}	

function colourGrad(x){
	if(colours[0].x>=x){
		return toCanvasColour(colours[0].r,colours[0].g,colours[0].b);
	}
	for(i=0;i<colours.length-1;i++){
		if(x>=colours[i].x && x<colours[i+1].x){
			ratio = (x-colours[i].x)/(colours[i+1].x-colours[i].x);
			ratio = 1-ratio;
			r = colours[i].r*ratio + colours[i+1].r*(1-ratio);
			g = colours[i].g*ratio + colours[i+1].g*(1-ratio);
			b = colours[i].b*ratio + colours[i+1].b*(1-ratio);
			//console.log(r+ " " + g + " " + b);
			return toCanvasColour(r,g,b);
		}
	}		
	
	return toCanvasColour(colours[colours.length-1].r,colours[colours.length-1].g,colours[colours.length-1].b);

}

function gridDraw(){
	for(x=0;x<gridW;x++){
		for(y=0;y<gridH;y++){
			//fillRaw(altCol2(grid[x][y].x));
			//fillRaw(altCol(grid[x][y].x*2200-150));
			fillRaw(colourGrad(grid[x][y].x*2200-150));
			//fill(grid[x][y].x*255);
			rect(x*sqSide,y*sqSide,sqSide,sqSide);
		}
	}
}

function gridUpdate(){
	var grid2=[]
	for(x=0;x<gridW;x++){
		var gridRow = []
		for(y=0;y<gridH;y++){
			oldPos = grid[x][y];
			
			newPos = {
				x: 0,
				dx: 0
			}
			newPos.x = oldPos.x;
			newPos.dx = oldPos.dx;
			newPos.dx+= 0.1*(getGridConv(x,y)-newPos.x);
			//newPos.dx+=0.01*(-newPos.x);
			//console.log(getGridConv(x,y));
			newPos.x += newPos.dx;
			
			gridRow.push(newPos);
		}
		grid2.push(gridRow);
	}
	
	
	
	grid = grid2;
}


function getGridConv(x,y){
	var up = y>0;
	var down = y<gridH-1;
	var left = x>0;
	var right = x<gridW-1;
	
	var count=0;
	var total=0;
	
	if(left){
		total+=grid[x-1][y].x;
		count++;
		if(up){
			total+=grid[x-1][y-1].x;
			count++;
		}
		if(down){
			total+=grid[x-1][y+1].x;
			count++;
		}
	}
	if(right){
		total+=grid[x+1][y].x;
		count++;
		if(up){
			total+=grid[x+1][y-1].x;
			count++;
		}
		if(down){
			total+=grid[x+1][y+1].x;
			count++;
		}
	}
	
	if(up){
		total+=grid[x][y-1].x;
		count++;
	}
	if(down){
		total+=grid[x][y+1].x;
		count++;
	}
	//console.log(total + "/" + count);
	if(count==0){
		return grid[x][y].x;
	}
	return total/count;
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

function clear(){
	ctx.clearRect(0,0,width,height);
}

function fillRaw(canvasColour){
	ctx.fillStyle = canvasColour;
}

function fill(r,g,b){
	if(g==null){
		ctx.fillStyle = 'rgb('+r+', '+r+', '+r+')';
	}else{
		ctx.fillStyle = 'rgb('+r+', '+g+', '+b+')';
	}
}

function toCanvasColour4(r,g,b,a){
	return 'rgba('+r+', '+g+', '+b+', '+a+')';
}
function toCanvasColour(r,g,b){
	return 'rgb('+r+', '+g+', '+b+')';
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