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

		while ( n < numDice ) {
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
			this.diceHTML.push(`<span class="die">${this.diceArray[i]}</span>`);
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
	cacheDom: () => {
		BtnGroup.btnGroups = document.querySelectorAll('.js-btn-group');
		BtnGroup.btnGroupBtns = document.querySelectorAll('.js-btn-group__btn');
		BtnGroup.selectedVal = null;
	},

	toggleBtn: ( thisElem ) => {
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

	bindEvents: () => {
		for ( let i = 0; i < BtnGroup.btnGroupBtns.length; i++ ) {
			BtnGroup.btn = BtnGroup.btnGroupBtns[i];

			BtnGroup.btn.onclick = function( event ) {
				let thisBtn = event.target;

				BtnGroup.toggleBtn( thisBtn );
			}
		}
	},

	init: () => {
		BtnGroup.cacheDom();
		BtnGroup.bindEvents();
	}
}

//==============================//
// Form Group component scripts //
//==============================//
let FormGroup = {
	cacheDom: () => {
		FormGroup.formGrps = document.querySelectorAll( '.js-form-grp' );
		FormGroup.formGrpInputs = document.querySelectorAll( '.js-form-grp__input' );
		FormGroup.formGrpBtns = document.querySelectorAll( '.js-form-grp__btn' );
	},

	bindEvents: () => {
		for ( let i = 0; i < FormGroup.formGrps.length; i++ ) {
			thisForm = FormGroup.formGrps[i];

			thisForm.onsubmit = function( event ) {
				event.preventDefault();

				FormGroup.renderVal( this );
				DiceLimits.storeVals();
				DiceLimits.limitAttackDice();
				DiceLimits.limitDefendDice();
			}
		}
	},

	renderVal: ( thisForm ) => {
		thisFormBtn = thisForm.querySelectorAll( '.js-form-grp__btn' )[0];
		thisFormInput = thisForm.querySelectorAll( '.js-form-grp__input' )[0];
		thisTarget = thisFormBtn.getAttribute( 'data-target' ),
		thisTargetEl = document.getElementById( thisTarget );

		if ( thisFormInput.value.length ) {
			thisTargetEl.innerHTML = thisFormInput.value;
		}

		else {
			thisTargetEl.innerHTML = '0';
		}

		thisFormInput.value = '';
	},

	init: () => {
		FormGroup.cacheDom();
		FormGroup.bindEvents();
	}
}


//==========================//
// Check Dice Number Limits //
//==========================//
let DiceLimits = {
	storeVals: () => {
		this.attackerStr = ATTACKER_STRENGTH.innerHTML;
		this.defenderStr = DEFENDER_STRENGTH.innerHTML;
	},

	limitAttackDice: () => {
		if ( this.attackerStr >= 3 ) {
			this.activeAttackBtns = 3;
		}

		else {
			this.activeAttackBtns = this.attackerStr;
		}

		DiceLimits.enableAttackBtns();
	},

	limitDefendDice: () => {
		if ( this.defenderStr >= 2 ) {
			this.activeDefendBtns = 2;
		}

		else {
			this.activeDefendBtns = this.defenderStr;
		}

		DiceLimits.enableDefendBtns();
	},

	enableAttackBtns: () => {
		attackBtns = ATTACKER_BTN_GROUP.querySelectorAll( '.js-btn-group__btn' );

		for ( i = 0; i <= this.activeAttackBtns - 1; i++ ) {
			attackBtns[i].removeAttribute( 'disabled' );
		}
	},

	enableDefendBtns: () => {
		defendBtns = DEFENDER_BTN_GROUP.querySelectorAll( '.js-btn-group__btn');

		for ( i = 0; i <= this.activeDefendBtns - 1; i++ ) {
			defendBtns[i].removeAttribute( 'disabled' );
		}
	},

	init: () => {
		DiceLimits.storeVals();
		DiceLimits.limitAttackDice();
		DiceLimits.limitDefendDice();
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


//====================//
// Initialize things  //
//====================//

let redArmy = new Army( 0 );
let blueArmy = new Army( 0 );
let coldWar = new Battle( redArmy, blueArmy );

window.addEventListener('DOMContentLoaded', function() {
	coldWar.preRender();
	BtnGroup.init();
	FormGroup.init();
	DiceLimits.init();
})

ROLL_DICE_TRIGGER.addEventListener('click', function() {
	coldWar.init();
});
