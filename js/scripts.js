// Global, constant variables
const RESULT_VAL = document.getElementById( 'result-val' ),
			RESULT_TEXT = document.getElementById( 'result-text' ),
			ATTACKER_ROLL = document.getElementById( 'attacker-roll' ),
			ATTACKER_STRENGTH = document.getElementById( 'attacker-strength'),
			ATTACKER_DICE = document.getElementById( 'attack-dice' ),
      DEFENDER_ROLL = document.getElementById( 'defender-roll' ),
			DEFENDER_STRENGTH = document.getElementById( 'defender-strength' ),
			DEFENDER_DICE = document.getElementById( 'defend-dice' ),
			ROLL_DICE_TRIGGER = document.getElementById( 'roll-btn' );

let findAncestor = ( elem, className ) => {
	while (( elem = elem.parentElement ) && !elem.classList.contains( className ));
  return elem;
};

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
let SelectNumDice = {
	cacheDom: cacheDom => {
		SelectNumDice.btnGroups = document.querySelectorAll('.js-btn-group');
		SelectNumDice.btnGroupBtns = document.querySelectorAll('.js-btn-group__btn');
	},

	toggleActive: toggleActive = ( thisElem ) => {
		let thisBtnGroup = findAncestor( thisElem, 'js-btn-group'),
				btns = thisBtnGroup.children;

		[].forEach.call( btns, function( elem ) {
			elem.classList.remove( 'is-active' );
		});

		if ( !classie.has( thisElem, 'is-active') ) {
			classie.add( thisElem, 'is-active' );
		}
	},

	bindEvents: bindEvents => {
		for ( let i = 0; i < SelectNumDice.btnGroupBtns.length; i++ ) {
			this.btn = SelectNumDice.btnGroupBtns[i];

			this.btn.onclick = function( event ) {
				let thisBtn = event.target;

				SelectNumDice.toggleActive( thisBtn );
			}
		}
	},

	init: init => {
		SelectNumDice.cacheDom();
		SelectNumDice.bindEvents();
	}
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
		ATTACKER_STRENGTH.innerHTML = this.attacker.offense;
		DEFENDER_STRENGTH.innerHTML = this.defender.offense;
	};

	this.render = render => {
		ATTACKER_ROLL.innerHTML = this.attackDice.diceTotal;
		ATTACKER_DICE.innerHTML = this.attackDice.diceHTML.join('');
    DEFENDER_ROLL.innerHTML = this.defendDice.diceTotal;
		DEFENDER_DICE.innerHTML = this.defendDice.diceHTML.join('');
    RESULT_VAL.innerHTML = this.result;
		RESULT_TEXT.innerHTML = this.winnerStr;
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

let redArmy = new Army( 8 );
let blueArmy = new Army( 5 );
let coldWar = new Battle( redArmy, blueArmy );

window.addEventListener('DOMContentLoaded', function() {
	coldWar.preRender();
	SelectNumDice.init();
})

ROLL_DICE_TRIGGER.addEventListener('click', function() {
	coldWar.init();
});
