function createRektangle(){
	rektText = document.getElementById("rektangleText").value;
	if(rektText.length<=1){
		document.getElementById("rektangle").innerHTML = rektText;
		return;
	}
	if(parseInt(document.getElementById("rektangleSize").value)>parseInt(document.getElementById("rektangleSize").max)){
		return;
	}
	rektSize = document.getElementById("rektangleSize").value;
	side = 1+(rektSize)*(rektText.length-1);
	document.getElementById("rektangle").innerHTML = gridToHTML(gridRektangle());
}

function gridRektangle(){
	var grid = [];
	
	for(x=0;x<side;x++){
		var gridRow = [];
		for(y=0;y<side;y++){
			gridRow.push(" ");
		}
		grid.push(gridRow);
	}
	
	
	for(x=0;x<side;x++){
		val = Math.floor(x/(rektText.length-1));
		if(x%(rektText.length-1)==0){
			var index=0;
			var change=1
			if(val%2==1){
				index = rektText.length-1;
				change = -1;
			}
			for(y=0;y<side;y++){
				grid[x][y] = rektText.substring(index,index+1);
				grid[y][x] = rektText.substring(index,index+1);
				
				
				index+=change;
				if(index>=rektText.length||index<0){
					change=-change;
					index+=change*2;
				}
			}
		}
	}
	return grid;
}

function gridToHTML(grid){
	rektangleOut = "";
	for(y=0;y<side;y++){
		rektangleOut += grid[0][y];
		for(x=1;x<side;x++){
			rektangleOut += " " + grid[x][y];
		}
		rektangleOut+="\n";
	}
	return rektangleOut;
}



createRektangle();



