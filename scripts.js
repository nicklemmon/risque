// Global, constant variables
const resultVal = document.getElementById( 'result-val' ),
			resultText = document.getElementById( 'result-text' ),
			attackerRoll = document.getElementById( 'attacker-roll' ),
			attackerStrength = document.getElementById( 'attacker-strength'),
			attackerDice = document.getElementById( 'attack-dice' ),
      defenderRoll = document.getElementById( 'defender-roll' ),
			defenderStrength = document.getElementById( 'defender-strength' ),
			defenderDice = document.getElementById( 'defend-dice' ),
			rollDiceTrigger = document.getElementById( 'roll-btn' );

// Define a die
let Die = function( sides ) {
  let roll = function() {
  	return Math.floor( Math.random() * sides ) + 1;
  };

	return {
		roll: roll
	};
};

// Define dice AKA a group of die
let Dice = function( numDice, sides ) {
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
let Army = function( numSoldiers ) {
	this.offense = numSoldiers;
  this.defense = numSoldiers;
};

// Define what happens before the battle begins between two armies
let BattlePrep = function( attacker, defender ) {

};

// Define a battle between two armies, accepting two armies as parameters
let Battle = function( attacker, defender ) {
	this.attacker = attacker;
  this.defender = defender;
	this.attackDice = new Dice( this.attacker.offense, 6 );
  this.defendDice = new Dice( this.defender.defense, 6 );

  this.rollDice = rollDice => {
  	this.attackDice.rollGroup();
		this.attackDice.renderDice();
		this.defendDice.rollGroup();
		this.defendDice.renderDice();
  };

	this.preRender = preRender => {
		attackerStrength.innerHTML = this.attacker.offense;
		defenderStrength.innerHTML = this.defender.offense;
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

window.addEventListener('DOMContentLoaded', function() {
	coldWar.preRender();
})

rollDiceTrigger.addEventListener('click', function() {
	coldWar.init();
});
