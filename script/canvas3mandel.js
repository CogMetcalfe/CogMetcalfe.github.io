console.log("Canvas JS running");
var canvas = document.getElementById("mainCanvas");
var paddingLeft = window.getComputedStyle(canvas.parentNode).getPropertyValue("padding-left");
var paddingRight = window.getComputedStyle(canvas.parentNode).getPropertyValue("padding-right");
paddingLeft = paddingLeft.substring(0,paddingLeft.length-2);
paddingRight = paddingRight.substring(0,paddingRight.length-2);
//console.log("Padding Left: \"" +  window.getComputedStyle(canvas.parentNode).getPropertyValue("padding-left") + "\"");
var width = canvas.width = canvas.parentNode.offsetWidth - paddingLeft - paddingRight;
var height = canvas.height = width;

var ctx = canvas.getContext('2d');
var frameCount=0;

function complex(r,i){
	return {
		r: r,
		i: i,
		add(c){
			return complex(this.r+c.r,this.i+c.i);
		},
		mult(c){
			return complex(this.r*c.r - this.i*c.i,this.r*c.i+c.r*this.i);
		},
		sq(){
			return this.mult(this);
		},
		dist(){
			return Math.sqrt(Math.pow(this.r,2)+Math.pow(this.i,2));
		},
		toString(){
			return "(" + this.r + ", " + this.i + "i)";
		}
	}
}

function mandelStep(z,c){
	return z.sq().add(c);
}

function mandel(c,max){
	if(c.dist()>=2){
		return -1;
	}
	if(max==false){
		max=10;
	}
	i=0;
	z=complex(0,0);
	while(i<max){
		if(z.dist()>=2){
			return i;
		}
		z = mandelStep(z,c);
		i++;
	}
	return i;
}

//My area :)

sqSide=1;
gridW=Math.floor(width/sqSide);
gridH=Math.floor(height/sqSide);

function drawMandelbrot(px,py,zoom){
	if(!px){
		px=0;
	}
	if(!py){
		py=0;
	}
	if(!zoom){
		zoom=1;
	}
	console.log(px, py, zoom);
	for(x=0;x<gridW;x++){
		for(y=0;y<gridH;y++){
			r = px+(4*(x/gridW-0.5)/zoom);
			i = py+(4*(y/gridH-0.5)/zoom);
			c = complex(r,i);
			//fill(10*mandel(complex(r,i),50));
			fillRaw(colourGrad(20*mandel(c,50)));
			noStroke();
			rect(sqSide*x,sqSide*y,sqSide,sqSide);
		}
	}
}

colours = [{x:0,r:0,g:0,b:0},
		   {x:100,r:26,g:0,b:121},
		   {x:147,r:72,g:0,b:147},
		   {x:250,r:170,g:0,b:150},
		   {x:300,r:200,g:20,b:130},
		   {x:400,r:230,g:75,b:22},
		   {x:650,r:252,g:230,b:44},
		   {x:800,r:255,g:255,b:255}];
		   
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

function setup(){
	drawMandelbrot(-0.5,0,1.8);
	//drawMandelbrot();
	//console.log("done");
	//c= complex(10,2);
	//console.log(c.toString());
	//console.log(mandel(c,10));
}

function draw(){
	
}




//leaving my area



window.onload = (function(){
	console.log("Loaded");
	fill(150);
	background();
	setup();

	setInterval(drawF,16);
});

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