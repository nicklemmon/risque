//============================//
// Global, constant variables //
//============================//
const RESULT_VAL = document.getElementById( 'result-val' ),
			RESULT_TEXT = document.getElementById( 'result-text' ),
			ATTACKER_ROLL = document.getElementById( 'attacker-roll' ),
			ATTACKER_STRENGTH = document.getElementById( 'attacker-strength'),
			ATTACKER_DICE = document.getElementById( 'attack-dice' ),
			ATTACKER_BTN_GROUP = document.getElementById( 'attacker-btn-group' ),
      DEFENDER_ROLL = document.getElementById( 'defender-roll' ),
			DEFENDER_STRENGTH = document.getElementById( 'defender-strength' ),
			DEFENDER_DICE = document.getElementById( 'defend-dice' ),
			DEFENDER_BTN_GROUP = document.getElementById( 'defender-btn-group' ),
			ROLL_DICE_TRIGGER = document.getElementById( 'roll-btn' );


//===============================================//
// Generic function used to find parent elements //
//===============================================//
let findAncestor = ( elem, className ) => {
	while (( elem = elem.parentElement ) && !elem.classList.contains( className ));
  return elem;
};


//==============//
// Define a die //
//==============//
let Die = function( sides ) {
  let roll = function() {
  	return Math.floor( Math.random() * sides ) + 1;
  };

	return {
		roll: roll
	};
};


//================================//
// Define dice AKA a group of die //
//================================//
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


//================//
// Define an army //
//================//
let Army = function( numSoldiers ) {
	this.numArmies = numSoldiers;
	this.numDice = 1; // the number of dice by default is 1, until the user selects a different number to roll
};


//=============================//
// Btn-group component scripts //
//=============================//
let BtnGroup = {
	cacheDom: cacheDom => {
		BtnGroup.btnGroups = document.querySelectorAll('.js-btn-group');
		BtnGroup.btnGroupBtns = document.querySelectorAll('.js-btn-group__btn');
		BtnGroup.selectedVal = null;
	},

	toggleBtn: toggleBtn = ( thisElem ) => {
		let thisBtnGroup = findAncestor( thisElem, 'js-btn-group' ),
				btns = thisBtnGroup.children,
				selectedVal = thisBtnGroup.getAttribute( 'data-selected-val' );

		[].forEach.call( btns, function( elem, index ) {
			elem.classList.remove( 'is-active' ); // remove the 'is-active' class from all '__btns' within the current 'btn-group'
		});

		if ( !classie.has( thisElem, 'is-active') ) {
			let btnVal = thisElem.innerHTML;

			classie.add( thisElem, 'is-active' ); // if the 'is-active' class isn't present, add 'is-active' to the one that is acted on
			thisBtnGroup.setAttribute( 'data-selected-val', btnVal );
		}

		BtnGroup.selectedVal = selectedVal; // store the value of the 'data-num-dice' attribute
	},

	bindEvents: bindEvents => {
		for ( let i = 0; i < BtnGroup.btnGroupBtns.length; i++ ) {
			BtnGroup.btn = BtnGroup.btnGroupBtns[i];

			BtnGroup.btn.onclick = function( event ) {
				let thisBtn = event.target;

				BtnGroup.toggleBtn( thisBtn );
			}
		}
	},

	init: init => {
		BtnGroup.cacheDom();
		BtnGroup.bindEvents();
	}
}


//========================================================================//
// Define a battle between two armies, accepting two armies as parameters //
//========================================================================//
let Battle = function( attacker, defender ) {
	this.attacker = attacker;
  this.defender = defender;

  this.rollDice = rollDice => {
  	this.attackDice.rollGroup();
		this.attackDice.renderDice();
		this.defendDice.rollGroup();
		this.defendDice.renderDice();
  };

	this.preRender = preRender => {
		ATTACKER_STRENGTH.innerHTML = this.attacker.numArmies;
		DEFENDER_STRENGTH.innerHTML = this.defender.numArmies;
	};

	this.determineNumDice = determineNumDice => {
		let attackerNumDice = ATTACKER_BTN_GROUP.getAttribute( 'data-selected-val' ),
				defenderNumDice = DEFENDER_BTN_GROUP.getAttribute( 'data-selected-val' );

		this.attackDice = new Dice( attackerNumDice, 6 );
	  this.defendDice = new Dice( defenderNumDice, 6 );
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
		this.determineNumDice();
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
	BtnGroup.init();
})

ROLL_DICE_TRIGGER.addEventListener('click', function() {
	coldWar.init();
});
