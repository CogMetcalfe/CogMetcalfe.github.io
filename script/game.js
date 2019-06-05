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
			return true;
		}
		return false;
	},
	putInForce(amount){
		if(this.chips>=amount){
			this.chips-=amount;
			this.chipsIn+=amount;
			return true;
		}
		this.chipsIn+=this.chips;
		this.chips = 0;
		return false;
	},
	fold(){
		this.folded=true;
	},
	endRound(){
		this.chips+=this.chipsIn;
		this.chipsIn=0;
		this.folded=false;
		this.hadTurn=false;
	},
	endTurn(){
		this.hadTurn=false;
	},
	winnerTakes(max){
		if(this.chipsIn<=max){
			returnChips = this.chipsIn;
			this.chipsIn = 0;
			return returnChips;
		}else{
			this.chipsIn-=max;
			return max;
		}
	},
	addChips(additionalChips){
		if(additionalChips>=0){
			this.chips+=additionalChips;
		}
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
	playerStr = newPlayer.toString();
	playerList.innerHTML = playerList.innerHTML + "<li id = \"" + newPlayer.name + "\">" + playerStr +"</li>";
}

function addPlayerToListI(index){
	newPlayer = allPlayers[index];
	playerStr = newPlayer.toString();
	if(index == currentPlayerIndex){
		playerStr = "<b>" + playerStr + "</b>";
	}
	playerList.innerHTML = playerList.innerHTML + "<li id = \"" + newPlayer.name + "\">" + playerStr +newPlayer.hadTurn + "</li>";
}
function addPlayerToListIWin(index){
	newPlayer = allPlayers[index];
	playerStr = newPlayer.toString();
	if(index == currentPlayerIndex){
		playerStr = "<b>" + playerStr + "</b>";
	}
	playerList.innerHTML = playerList.innerHTML + "<li id = \"" + newPlayer.name + "\">" + "<button onclick=evalGame(" + i + ")>" + playerStr + "</button>"+"</li>";
	
}
function emptyList(){
	playerList.innerHTML = "";
	allPlayers=[];
}

function refreshList(){
	//console.log("refreshed");
	playerList.innerHTML="";
	for(i=0;i<allPlayers.length;i++){
		//addPlayerToList(allPlayers[i]);
		addPlayerToListI(i);
	}
}

function refreshListWin(){
	playerList.innerHTML="";
	for(i=0;i<allPlayers.length;i++){
		addPlayerToListIWin(i);
	}
}

function updateTurnLabel(){
	turnLabel = document.getElementById("turnLabel");
	if(turn==-1||turn==0){
		turnLabel.innerHTML = "0";
	}else if(turn==1){
		turnLabel.innerHTML = "3";
	}else if(turn==2){
		turnLabel.innerHTML = "4";
	}else if(turn==3){
		turnLabel.innerHTML = "5";
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
	smallBlind.putInForce(2);
	bigBlind.putInForce(4);
	turn=0;
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
	var dif = getMaxBet()-currPlayer.chipsIn;
	currPlayer.putIn(dif);
	prepareNextPlayerOptions();
}

function playerRaise(){
	console.log("raise");
	var dif = getMaxBet()-currPlayer.chipsIn+parseInt(document.getElementById("raiseAmount").value);
	//console.log(dif);
	if(currPlayer.putIn(dif)){
		console.log("you had the money");
		prepareNextPlayerOptions();
	}
	console.log("nah bruh");
}

function preparePlayersForNextTurn(){
	for(i=0;i<allPlayers.length;i++){
		allPlayers[i].endTurn();
	}
}

function preparePlayesrForNextRound(){
	for(i=0;i<allPlayers.length;i++){
		allPlayers[i].endRound();
	}
}

function prepareNextPlayerOptions(){
	updateTurnLabel();
	refreshList();
	if(shouldEndGame()){
		turn=3;
		if(remPlayersIn()==1){
			for(i=0;i<allPlayers.length;i++){
				if(!allPlayers[i].folded()){
					evalGame(i);
					break;
				}
			}
			
			updateTurnLabel();
			refreshList();
		}else{
			whoWon();
			updateTurnLabel();
			refreshListWin();
		}
		return;
	}
	if(shouldEndTurn()){
		turn++;
		currentPlayerIndex=inBounds(dealerIndex+3,allPlayers.length);
		preparePlayersForNextTurn();
		updateTurnLabel();
	}else{
		if(firstTurn){
			firstTurn=false;
		}else{
			currentPlayerIndex=inBounds(currentPlayerIndex+1,allPlayers.length);
			//console.log(currentPlayerIndex);
		}
	}
	while(getCurrentPlayer().folded || getCurrentPlayer().chips==0){
		currentPlayerIndex=inBounds(currentPlayerIndex+1,allPlayers.length);
	}
	currPlayer = getCurrentPlayer();
	currPlayer.hadTurn = true;
	console.log(currPlayer.name+"'s turn");
	document.getElementById("currPlayerLabel").innerHTML = currPlayer.name;
	document.getElementById("currDealerLabel").innerHTML = allPlayers[dealerIndex].name;
	document.getElementById("totalPotLabel").innerHTML = getPot();
	
	document.getElementById("allin").disabled = false;
	if(getMaxBet()>=currPlayer.chips+currPlayer.chipsIn){
		document.getElementById("call").disabled = true;
	}else{
		document.getElementById("call").disabled = false;
		if(getMaxBet()==currPlayer.chips+currPlayer.chipsIn){
			document.getElementById("raise").disabled = true;
		}else{
			document.getElementById("raise").disabled = false;
		}
	}
	
	
	
	refreshList();
	
}
var max=0;

function getPot(){
	var total = 0;
	for(i=0;i<allPlayers.length;i++){
		total+=allPlayers[i].chipsIn;
	}
	return total;
}
function whoWon(){
	document.getElementById("startRound").disabled = true;
	document.getElementById("fold").disabled = true;
	document.getElementById("call").disabled = true;
	document.getElementById("raise").disabled = true;
	document.getElementById("addPlayer").disabled = true;
}

function evalGame(winnerIndex){
	winner = allPlayers[winnerIndex];
	winnerChips = winner.chipsIn;
	for(i=0;i<allPlayers.length;i++){
		winner.addChips(allPlayers[i].winnerTakes(winnerChips));
		allPlayers[i].endRound();
	}
	
	
	turn = -1;
	refreshList();
	updateTurnLabel();
	
	
}


function shouldEndTurn(){
	//everyones bets are the same && everyone has had a turn
	var max=0
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
	return true;
}

function shouldEndGame(){
	if(shouldEndTurn() && turn==2){
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

function getMaxBet(){
	var max=0;
	for(i=0;i<allPlayers.length;i++){
		if(allPlayers[i].chipsIn>max){
			max=allPlayers[i].chipsIn;
		}
	}
	return max;
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