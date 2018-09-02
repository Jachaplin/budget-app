// BUDGET CONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var budgetController = (function() {

// CONSTRUCTORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//***********************************************	
	
	// Expence Constructor
	var Expence = function(id, description, value) {
		this.id = id
		this.description = description
		this.value = value
	}

	// Income Constructor
	var Income = function(id, description, value) {
		this.id = id
		this.description = description
		this.value = value
	}

//************************************************
	
})()

//*****************************************************

// UI CONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//*****************************************************

var UIController = (function() {

	// Creating a DOMstrings object to get rid of our strings in our getInput querySelectors
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
		
	}

	return {
		getInput: function() {

			return {
				
				// instead of creating variables for each querySelector, we are returning all three as an object
				type: document.querySelector(DOMstrings.inputType).value,	// will be inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				// ParseFloat converts numbers that are strings to intigers with decimals
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		// This exposes our DOMstrings to the public so we can use them globally
		getDomstrings: function() {
			return DOMstrings
		}
	}

})()

//*****************************************************

// GLOBAL APP CONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//*****************************************************

var controller = (function(budgetCtrl, UICtrl) {

	// Event Listener Function
	var setUpEventListeners = function() {
		
		// This grabs the DOMstrings object in the UIController and stores it in the DOM variable
		var DOM = UICtrl.getDomstrings()
		
		// Add item button handler
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
		
		// Add item 'enter' keypress handler
		document.addEventListener('keypress', function(event) {
			
			// keyCode 13 is the ENTER button. You can check by console.log(event) and find the keyCode
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem()
			}
		})
		console.log('Working')
	}

	var ctrlAddItem = function() {
		var input
		
		// 1. Get the filled input data
		input = UICtrl.getInput()
	}
	
	// This init function is public/Global to call the setUpEventListener function 
	return {
		init: function() {
			console.log('Application has started')
			setUpEventListeners()
		}
	}

// passing these controllers in the IIFE Global Controller functiion call allows them to communicate in this Controller
})(budgetController, UIController)

// This calls the init function to start the app
controller.init()		