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
	
	var calculateTotal = function(type) {
		var sum = 0
		
		// loop threw each allItems type. The types are inc and exp
		data.allItems[type].forEach(function(current) {
			
			// Add the sum to the current value starting at 0. This is the same as sum = sum + current.value
			sum += current.value
		})
		
		// Set the caluclated sum to each total type
		data.totals[type] = sum
	}

	// Storing all data as one object
	var data = {
		allItems: {
			exp: [],
			inc: [],
			
		},
		totals: {
			exp: 0,
			inc: 0,

		},
		budget: 0,
		// we set it to -1 because it doesn't exsist yet. 0 means it exsists.
		percentage: -1
	
	}

	// Creating a new item with expence or income conditions that we get from the UIController
	return {
		addItem: function(type, des, val) {
			var newItem, ID

			// ID = last ID + 1. This analizes the last index of the ID's and THEN creates an ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1
			} else {
				ID = 0
			}

			// Creates new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expence(ID, des, val)
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val)
			}
			
			// Pushes it into our data structure
			data.allItems[type].push(newItem)
			return newItem
		
		},

		calculateBudget: function() {

			// calculate total income and expenses
			calculateTotal('exp')
			calculateTotal('inc')

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp

			// calculate the percentage of the income that we spent
			if (data.totals.inc > 0) {
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
			} else {
				data.percentage = -1
			}

		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		testing: function() {
			console.log(data)
		}
	}

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
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenceContainer: '.expenses__list',
		budgetLable: '.budget__value',
		incomeLable: '.budget__income--value',
		expenseLable: '.budget__expenses--value',
		percentageLable: '.budget__expenses--percentage',
		container: '.container'
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

		addListItem: function(obj, type) {
			var html, newHtml, element
			// Create HTML sting with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				
			} else if (type === 'exp') {
				element = DOMstrings.expenceContainer
      	html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description% rent</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				
			}
                            
			// Replace placeholder text with some real data

			newHtml = html.replace('%id%', obj.id)
			newHtml = newHtml.replace('%description%', obj.description)
			newHtml = newHtml.replace('%value%', obj.value)

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)


		},

		clearFields: function() {
			var fields, fieldsArr
			
			// We use querySelectorAll to select both strings. We have to seperate each one with a comma string
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)

			// When using SelectorAll, it gives us a list and not a typical array so we have to use the slice method. We are effecting the constructor so we use the prototype to the constructors array.
			fieldsArr = Array.prototype.slice.call(fields)

			// forEach method loops through the array and we can pass up to 3 arguments.
			fieldsArr.forEach(function(current, index, array) {
				
				// This clears the values in DOMstings.inputDescription and DOMstrings.inputValue
				current.value = ""
			})

			// This brings back the placeholders
			fieldsArr[0].focus()
		},

		displayBudget: function(obj) {

			document.querySelector(DOMstrings.budgetLable).textContent = obj.budget
			document.querySelector(DOMstrings.incomeLable).textContent = obj.totalInc
			document.querySelector(DOMstrings.expenseLable).textContent = obj.totalExp
			

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%'
			} else {
				document.querySelector(DOMstrings.percentageLable).textContent = '---'
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

	}

	var updateBudget = function() {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget()

		// 2. Return the budget
		var budget = budgetCtrl.getBudget()

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget)
		console.log(budget)

	}

	var ctrlAddItem = function() {
		var input, newItem
		
		// 1. Get the filled input data
		input = UICtrl.getInput()

		// If there is no discription, no number, or a value of 0, the code will not run
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

		// 2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value)
		budgetCtrl.testing();

		// 3. Add the item to the UI
		UICtrl.addListItem(newItem, input.type)

		// 4. Clear the Fields
		UICtrl.clearFields()

		// 5. Calculate and update budget
		updateBudget()
		}

	}
	
	// This init function is public/Global to call the setUpEventListener function 
	return {
		init: function() {
			console.log('Application has started')
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			})
			setUpEventListeners()
		}
	}

// passing these controllers in the IIFE Global Controller functiion call allows them to communicate in this Controller
})(budgetController, UIController)

// This calls the init function to start the app
controller.init()		
		                                                                                                                                                                                                                                                                                                   