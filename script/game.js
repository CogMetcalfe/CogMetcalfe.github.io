//alert("Hello World");
//document.write("<p>Hello, World!</p>");
//console.log("Hello World");

ms=33;

var dealerIndex = -1;

var dealer;
var currentPlayerIndex;
var turn=-1;

playerClass = {
	chips: 0,
	name: "nobody",
	chipsIn: 0,
	folded: false,
	hadTurn: false,
	putIn(amount){
		if(this.chips>=amount){
			this.chips-=amount;
			this.chipsIn+=amount;
		}
	},
	fold(){
		this.folded=true;
	},
	endRound(){
		this.chips+=this.chipsIn;
		this.chipsIn=0;
		this.folded=false;
		this.hadTurn=true;
	},
	endTurn(){
		this.hadTurn=false;
	},
	toString(){
		if(this.folded){
			return this.name + ": " + this.chips + " X " + this.chipsIn;
		}else{
			return this.name + ": " + this.chips + " -> " + this.chipsIn;
		}
	}
}

var allPlayers = []

playerList = document.getElementById("playerList");

setInterval(clockEvent,ms);

function clockEvent(){
	gameUpdate();
}

function gameUpdate(){
	
}

function addPlayer(){
	var name = document.getElementById("newPlayerName").value;
	var chips = parseInt(document.getElementById("startingChips").value);
	if(name=="" || name==null || chips==null || isNaN(chips)){
		console.log("null value");
		return;
	}
	document.getElementById("newPlayerName").value="";
	var newPlayer = Object.create(playerClass)
	
	newPlayer.name = name;
	newPlayer.chips = chips;
	allPlayers.push(newPlayer);
	if(allPlayers.length>1){
		document.getElementById("startRound").disabled = false;
	}
	addPlayerToList(newPlayer);
}

function addPlayerToList(newPlayer){
	playerList.innerHTML = playerList.innerHTML + "<li id = \"" + newPlayer.name + "\">" + newPlayer.toString() + "</li>"
}
function emptyList(){
	playerList.innerHTML = "";
	allPlayers=[];
}

function refreshList(){
	console.log("refreshed");
	playerList.innerHTML="";
	for(i=0;i<allPlayers.length;i++){
		addPlayerToList(allPlayers[i]);
	}
}


function startRound(){
	document.getElementById("startRound").disabled = true;
	document.getElementById("fold").disabled = false;
	document.getElementById("call").disabled = false;
	document.getElementById("raise").disabled = false;
	document.getElementById("addPlayer").disabled = true;
	nextRoundSetup();
	dealer = allPlayers[dealerIndex];
	smallBlind = allPlayers[smallBlindIndex];
	bigBlind = allPlayers[bigBlindIndex];
	//console.log(dealerIndex);
	//console.log(smallBlindIndex);
	//console.log(bigBlindIndex);
	smallBlind.putIn(2);
	bigBlind.putIn(4);
	
	prepareNextPlayerOptions();
	
	
	
}

currPlayer = null;



function playerFold(){
	console.log("fold");
	currPlayer.fold();
	prepareNextPlayerOptions();
}

function playerCallCheck(){
	console.log("call check");
	prepareNextPlayerOptions();
}

function playerRaise(){
	console.log("raise");
	prepareNextPlayerOptions();
}




function prepareNextPlayerOptions(){
	refreshList();
	if(shouldEndGame()){
		whoWon();
		return;
	}
	if(shouldEndTurn()){
		turn++;
		currentPlayerIndex=inBounds(dealerIndex+3,allPlayers.length);
	}else{
		if(firstTurn){
			firstTurn=false;
		}else{
			currentPlayerIndex=inBounds(currentPlayerIndex+1,allPlayers.length);
			console.log(currentPlayerIndex);
		}
	}
	while(getCurrentPlayer().folded){
		currentPlayerIndex=inBounds(currentPlayerIndex+1,allPlayers.length);
	}
	currPlayer = getCurrentPlayer();
	console.log(currPlayer.name);
	document.getElementById("currPlayerLabel").innerHTML = currPlayer.name;
	refreshList();
}
var max=0;

function whoWon(){
	document.getElementById("startRound").disabled = true;
	document.getElementById("fold").disabled = true;
	document.getElementById("call").disabled = true;
	document.getElementById("raise").disabled = true;
	document.getElementById("addPlayer").disabled = true;
}

function evalGame(){
	winnerName 
	for(i=0;i<allPlayers.length;i++){
		//allPlayers[i].
	}
}

function endGame(){
	turn=-1;
}

function shouldEndTurn(){
	//everyones bets are the same && everyone has had a turn
	max=0
	for(i=0;i<allPlayers.length;i++){
		if(allPlayers[i].folded){
			continue;
		}
		if(!allPlayers[i].hadTurn){
			return false;
		}
		if(allPlayers[i].chipsIn>max){
			max=allPlayers[i].chipsIn;
		}
	}
	for(i=0;i<allPlayers.length;i++){
		if(allPlayers[i].folded){
			continue;
		}
		if(allPlayers[i].chipsIn < max && allPlayers[i].chips != 0){
			return false;
		}
	}
}

function shouldEndGame(){
	if(shouldEndTurn && turn==2){
		return true;
	}
	// if only one not folded
	// OR
	// only one or none not all in (all in except maybe one)
	playersLeft = 0
	for(i=0;i<allPlayers.length;i++){
		if(!allPlayers[i].folded){
			playersLeft++;
		}	
	}
	if(playersLeft<2){
		return true;
	}
	
	
	var notAllInCount=0
	for(i=0;i<allPlayers.length;i++){
		if(allPlayers[i].folded){
			continue;
		}	
		if(allPlayers[i].chips!=0){
			notAllInCount++;
		}
	}
	if(notAllInCount>1){
		return false;
	}else{
		return true;
	}
}



function getCurrentPlayer(){
	return allPlayers[currentPlayerIndex];
}

function remPlayersIn(){
	count=0;
	for(i=0;i<allPlayers.length;i++){
		if(!allPlayers[i].folded){
			count++;
		}
	}
	return count;
}

function nextRoundSetup(){
	for(i=0;i<allPlayers.length;i++){
		if(allPlayers[i].folded){
			allPlayers[i].hadTurn();
		}
	}
	dealerIndex++;
	dealerIndex = inBounds(dealerIndex,allPlayers.length);
	smallBlindIndex = inBounds(dealerIndex+1,allPlayers.length);
	bigBlindIndex = inBounds(dealerIndex+2,allPlayers.length);
	currentPlayerIndex = inBounds(dealerIndex+3,allPlayers.length);
	firstTurn=true;
}

function inBounds(number, size){
	
	while(number>=size){
		number-=size;
	}
	
	while(number<0){
		number+=size;
	}
	
	return number;
}


document.getElementById("newPlayerName")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addPlayer").click();
    }
});

document.getElementById("startingChips")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("addPlayer").click();
    }
});