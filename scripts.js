// Global, constant variables
const resultVal = document.getElementById( 'result-val' ),
			resultText = document.getElementById( 'result-text' ),
			attackerRoll = document.getElementById( 'attacker-roll' ),
			attackerDice = document.getElementById( 'attack-dice' ),
      defenderRoll = document.getElementById( 'defender-roll' ),
			defenderDice = document.getElementById( 'defend-dice' ),
			rollDiceTrigger = document.getElementById( 'roll-btn' );

// Define a die
function Die( sides ) {
	this.sides = sides;

  this.roll = roll => {
  	return Math.floor( Math.random() * this.sides ) + 1;
  };
};

// Define dice AKA a group of die
function Dice( numDice, sides ) {
	this.die = new Die( sides );
	this.diceTotal = 0;
	this.diceArray = [];
	this.diceHTML = [];

  this.rollGroup = rollGroup => {
		var n = 0;

		while (n < numDice) {
			this.diceTotal += this.die.roll();
			this.diceArray += this.die.roll();
			n++;
		}

		this.renderDice();
  };

	this.resetTotal = resetTotal => {
		this.diceTotal = 0;
		this.diceArray = [];
		this.diceHTML = [];
	};

	this.renderDice = renderDice => {
		for (var i = 0; i < this.diceArray.length; i++) {
			this.diceHTML.push('<span class="die">' + this.diceArray[i] + '</span>');
		}
	};
};

// Define an army
function Army( numSoldiers ) {
	this.offense = numSoldiers;
  this.defense = numSoldiers;
};

// Define a battle between two armies, accepting two armies as parameters
function Battle( attacker, defender ) {
	this.attacker = attacker;
  this.defender = defender;
	this.attackDice = new Dice( this.attacker.offense, 6 );
  this.defendDice = new Dice( this.defender.defense, 6 );

  this.rollDice = rollDice => {
  	this.attackDice.rollGroup();
		this.defendDice.rollGroup();
  };

	this.render = render => {
		attackerRoll.innerHTML = this.attackDice.diceTotal;
		attackerDice.innerHTML = this.attackDice.diceHTML.join('');
    defenderRoll.innerHTML = this.defendDice.diceTotal;
		defenderDice.innerHTML = this.defendDice.diceHTML.join('');
    resultVal.innerHTML = this.result;
		resultText.innerHTML = this.winnerStr;
	};

  this.determineWinner = determineWinner => {
		this.result = this.attackDice.diceTotal - this.defendDice.diceTotal;

  	if ( this.result > 0 ) {
    	this.winnerStr = 'The attacker wins!';
    }

    else if ( this.result == 0 ) {
    	this.winnerStr = 'The attacker and defender tie!';
    }

    else {
    	this.winnerStr = 'The defender wins!';
    }
  };

  this.init = init => {
    this.rollDice();
		this.determineWinner();
    this.render();
		this.attackDice.resetTotal();
		this.defendDice.resetTotal();
  };
};

let redArmy = new Army( 3 );
let blueArmy = new Army( 5 );
let coldWar = new Battle( redArmy, blueArmy );

rollDiceTrigger.addEventListener('click', function() {
	coldWar.init();
});
