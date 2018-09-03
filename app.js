// BUDGET CONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var budgetController = (function() {

// CONSTRUCTORS
//***********************************************	
	
	// Expense Constructor
	var Expense = function(id, description, value) {
		this.id = id
		this.description = description
		this.value = value
		this.percentage = -1
	}

	// Creating a prototype function in the Expense constructor to calculate expense percentages of the total income 
	Expense.prototype.calPercentage = function(totalIncome) {
		if (totalIncome > 0) {
		this.percentage = Math.round((this.value / totalIncome) * 100)
			
		} else {
			this.percentage = -1
		}
	}

	// Returns the percentage to the Expense Constructor
	Expense.prototype.getPercentage = function() {
		return this.percentage
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
		
		// Loop threw each allItems type. The types are inc and exp
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
		// Set to -1 because it doesn't exsist yet. 0 means it exsists.
		percentage: -1
	
	}

	// Creating a new item with expense or income conditions from the UIController
	return {
		addItem: function(type, des, val) {
			var newItem, ID

			// ID = last ID + 1. This analyzes the last index of the ID's and THEN creates an ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1
			} else {
				ID = 0
			}

			// Creates new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val)
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val)
			}
			
			// Pushes it into the data structure
			data.allItems[type].push(newItem)
			return newItem
		
		},

		deleteItem: function(type, id) {

			// This .map() loop is similar to the .forEach() loop but it only will return an array of the type's(inc of exp) id numbers ('current.id'). Then the id numbers array is stored in the ids variable
			var ids = data.allItems[type].map(function(current) {
				return current.id
			})

			// This returns the index number of 'id' in the 'ids' array and stores it in the 'index' variable
			index = ids.indexOf(id)

			// If the index exists, then...
			if (index !== -1) {

				// Splice is used to specify what to remove(index), and how many to remove(1)
				data.allItems[type].splice(index, 1)
			}

		},

		calculateBudget: function() {

			// Calculate total income and expenses
			calculateTotal('exp')
			calculateTotal('inc')

			// Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp

			// Calculate the percentage of the income spent
			if (data.totals.inc > 0) {
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
			} else {
				data.percentage = -1
			}

		},

		calculatePercentage: function() {

			data.allItems.exp.forEach(function(current) {
				current.calPercentage(data.totals.inc)
			})

		},

		getPercentage: function() {

			var allPerc = data.allItems.exp.map(function(current) {
				return current.getPercentage()
			})
			return allPerc
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

	// Creating a DOMstrings object to get rid of the strings in the getInput querySelectors
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLable: '.budget__value',
		incomeLable: '.budget__income--value',
		expenseLable: '.budget__expenses--value',
		percentageLable: '.budget__expenses--percentage',
		container: '.container',
		expPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	}

	var formatNumber = function(num, type) {
		var numSplit, int, dec
		
		num = Math.abs(num)
		num = num.toFixed(2)

		numSplit = num.split('.')

		int = numSplit[0]

		if (int.length > 3) {
			int = int.substr(0, int.length -3) + ',' + int.substr(int.length -3, 3)
		}

		dec = numSplit[1]
		

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec


	}

	return {
		getInput: function() {

			return {
				
				// Instead of creating variables for each querySelector, return all three as an object
				type: document.querySelector(DOMstrings.inputType).value,	// Will be inc or exp
				
				description: document.querySelector(DOMstrings.inputDescription).value,
				
				// parseFloat() converts numbers that are strings to intigers with decimals
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem: function(obj, type) {
			var html, newHtml, element
			
			// Create HTML sting with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer
      	html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				
			}
                            
			// Replace placeholder text with some real data
			newHtml = html.replace('%id%', obj.id)
			newHtml = newHtml.replace('%description%', obj.description)
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)


		},

		deleteListItem: function(selectorId){

			// Grab the parent id
			var el = document.getElementById(selectorId)
			// Remove the child id
			el.parentNode.removeChild(el)

		},

		clearFields: function() {
			var fields, fieldsArr
			
			// querySelectorAll to select both strings. Seperate each one with a comma string
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)

			// When using SelectorAll, it gives a list and not a typical array so use the slice method. It effects the constructor so use the prototype to the constructor's array.
			fieldsArr = Array.prototype.slice.call(fields)

			// forEach method loops through the array and can pass up to 3 arguments.
			fieldsArr.forEach(function(current, index, array) {
				
				// This clears the values in DOMstings.inputDescription and DOMstrings.inputValue
				current.value = ""
			})

			// This brings back the placeholders
			fieldsArr[0].focus()
		},

		displayBudget: function(obj) {
			var type

			obj.budget > 0 ? type = 'inc' : type = 'exp'

			document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(obj.budget, type)
			document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(obj.totalInc, 'inc')
			document.querySelector(DOMstrings.expenseLable).textContent = formatNumber(obj.totalExp, 'exp')
			

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%'
			} else {
				document.querySelector(DOMstrings.percentageLable).textContent = '---'
			}

		},

		displayPercentage: function(percentage) {

			// this creates a node list
			var fields = document.querySelectorAll(DOMstrings.expPercLabel)

			// loops through the node list and sets the loop as nodeListForEach
			var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i)
				}
			}

			nodeListForEach(fields, function(current, index) {

				if (percentage[index] > 0) {
				current.textContent = percentage[index] + '%'
					
				} else {
					current.textContent = '---'
				}

			})

		},

		displayMonth: function() {
			var now, year, month, months
			
			// new Date() is a Javascript built in constructor with built in functions to call
			now = new Date()

			// Creating an array of months to attach to the number the getMonth() gives
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			
			month = now.getMonth()
			year = now.getFullYear()
			
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year

		},
		
		// This exposes the DOMstrings to the public to use them globally
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

		// Delete item button Handler. Add a listener to the container because it's the parent of all the items that will be added.
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

	}

	var updatePercentage = function() {

		// 1. Calculate percentages
		budgetCtrl.calculatePercentage()

		// 2. Read percentages from the budget
		var percentage = budgetCtrl.getPercentage()
		
		// 3. Update the UI with the new percentages
		UICtrl.displayPercentage(percentage)
		console.log(percentage)

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
		
		// 6. Calculate and update percentages
		updatePercentage()
		}

	}

	var ctrlDeleteItem = function(event) {
		var itemId, splitId, type, ID
		
		// Using event bubbling, targeting the delete button, then traveling all the way to the parent container's id. parentNode is used four times to reach the container id.(DOM traversing)
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id

		if (itemId) {
			// .split() turns the itemId string, 'inc-1', into two usable parts seperating them at '-'. It turns the string number into an integer.
			splitId = itemId.split('-')
			type = splitId[0]
			ID = parseInt(splitId[1])

			// 1. Delete the item from the data structure
			budgetCtrl.deleteItem(type, ID)
			budgetCtrl.testing();

			// 2. Delete the item from the UI
			UICtrl.deleteListItem(itemId)

			// 3. Update and show the new budget
			updateBudget()

			// 4. Calculate and update percentages
			updatePercentage()

		}

	}
	
	// This init function is public/Global to call the setUpEventListener function 
	return {
		init: function() {
			console.log('Application has started')
			UICtrl.displayMonth()
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			})
			setUpEventListeners()
		}
	}

// Passing these controllers in the IIFE Global Controller functiion call allows them to communicate in this Controller
})(budgetController, UIController)

// This calls the init function to start the app
controller.init()		
		                                                                                                                                                                                                                                                                                                   