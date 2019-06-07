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

//My area :)


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
		ang(){
			return Math.atan2(this.i,this.r);
		},
		toString(){
			return "(" + this.r + ", " + this.i + "i)";
		},
		pow(c){
			pol = this.toPolar();
			f=Math.pow(pol.d,c.r)*Math.exp(-c.i*pol.a);
			ang = c.r*pol.a + c.i*Math.log(pol.d);
			pR = Math.cos(ang);
			pI = Math.sin(ang);
			outR = f*pR;
			outI = f*pI;
			return complex(f*pR,f*pI);
		},
		toPolar(){
			d = this.dist();
			a = this.ang();
			return {
				d: d,
				a: a
			}
		}
	}
}

function mandelStep(z,c){
	return z.sq().add(c); //mandelbrot
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
	for(y=0;y<gridH;y++){
		drawMandelbrotRow(px,py,zoom,y);
	}
}


function drawMandelbrotRow(px,py,zoom,y){
	for(x=0;x<gridW;x++){
		drawMandelbrotSquare(px,py,zoom,x,y);
	}
}

function drawMandelbrotSquare(px,py,zoom,x,y){
		r = px+(4*(x/gridW-0.5)/zoom);
		i = py+(4*(y/gridH-0.5)/zoom);
		c = complex(r,i);
		//fill(10*mandel(complex(r,i),50));
		fillRaw(colourGrad(20*mandel(c,50)));
		noStroke();

		rect(sqSide*x,sqSide*y,sqSide,sqSide);
}

function juliaStep(z,c){
	return z.sq().add(c); //julia
}


function julia(c,max,complexAdd){
	if(c.dist()>=2){
		return -1;
	}
	if(max==false){
		max=10;
	}
	i=0;
	z=c;
	while(i<max){
		if(z.dist()>=2){
			return i;
		}
		z = juliaStep(z,complexAdd);
		i++;
	}
	return i;
}

function drawJuliaSquare(complexAdd,px,py,zoom,x,y){
		r = px+(4*(x/gridW-0.5)/zoom);
		i = py+(4*(y/gridH-0.5)/zoom);
		c = complex(r,i);
		//fill(10*mandel(complex(r,i),50));
		fillRaw(colourGrad(30*julia(c,30,complexAdd)));
		noStroke();

		rect(sqSide*x,sqSide*y,sqSide,sqSide);
}

function drawJulia(c,px,py,zoom){
	if(!px){
		px=0;
	}
	if(!py){
		py=0;
	}
	if(!zoom){
		zoom=1;
	}
	for(y=0;y<gridH;y++){
		for(x=0;x<gridW;x++){
			drawJuliaSquare(c,px,py,zoom,x,y);
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
cInput = complex(1,1);
console.log(cInput.toString());
cOutput = cInput.pow(complex(5,7));
console.log(cOutput.toString());

function setup(){
	fill(0);
	background();
	curRow=0;
	curCol=0;
	//drawMandelbrot(-0.5,0,1.8);
	//drawMandelbrot();
	//console.log("done");
	//c= complex(10,2);
	//console.log(c.toString());
	//console.log(mandel(c,10));
}

var curRow;
var curCol;

var maxSteps = 1000;
var param;
function paramChanged(){
	r = parseFloat(document.getElementById("real").value);
	i = parseFloat(document.getElementById("imaginary").value);
	if(!r){r=0;}
	if(!i){i=0;}
	param = complex(r,i);
	frameCount=0;
	fill(0);
	background();
}
paramChanged();
function draw(){
	//startMil = curmil();
	/*while(curRow<gridH && curmil()-startMil<16){
		drawMandelbrotSquare(-0.5,0,1.8,curCol, curRow);
		curCol++;
		if(curCol==gridW){
			curCol=0;
			curRow++;
		}
	}*/
	/*
	while(curmil()-startMil<8){
		randomDraw();
	}*/
	/*
	for(var n=0;n<5000;n++){
		randomDraw();
	}
	*/
	
	//julia
	//param = complex(0.7*Math.sin(frameCount/100),0.7*Math.cos(frameCount/100));
	if(frameCount < maxSteps){
		progressDraw(param, 0,0,1,frameCount++,Math.round((gridW*gridH)/5000));
		for(var n=0;n<1000;n++){
			randomDraw(param,0,0,1);
		}
	}
	
	//drawJulia(complex(0.4+0.05*Math.sin(frameCount/100),0.5+0.05*Math.cos(frameCount/100)),0,0,1);
	
	
	
	console.log(param.toString());
	
	
	//console.log(curmil()-startMil);
	window.requestAnimationFrame(draw);
}

function progressDraw(param, px,py,zoom,step,stepCount){
	if(step>=stepCount){return;}
	x=step;
	y=0;
	
	while(y<gridH){
		while(x>=gridW){
			x-=gridW;
			y++;
		}
		drawJuliaSquare(param,px,py,zoom,x,y);
		
		
		x+=stepCount;
	}
	
}


function randomDraw(param,px,py,zoom){
	x = random(0,gridW);
	y = random(0,gridH);
		drawJuliaSquare(param,px,py,zoom,x,y);
}

function curmil(){
	var d = new Date();
	var n = d.getMilliseconds();
	return n;
}


//leaving my area



window.onload = (function(){
	setTimeout(function(){
	console.log("Loaded");
	fill(150);
	background();
	setup();
	draw();
	//setInterval(drawF,50);
	},100);
});

function drawF(){
	frameCount++;
	window.requestAnimationFrame(draw);
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