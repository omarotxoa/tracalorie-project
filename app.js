// Storage Controller

// Item Controller
const ItemCtrl = (function(){

    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure - State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Parse calories to number
            calories = parseInt(calories);

            // Create new Item
            newItem = new Item(ID, name, calories);

            // Add the item to the items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            // Loop through items
            data.items.forEach(function(item){
                // Match Id to get appropriate item
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(item) {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(function(item) {
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();



// UI Controller 
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    //Public Methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`;
            });

            // Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show the List
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add Class
            li.className = 'collection-item';
            // Add Id
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;
            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node List into Array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>`;
                }
            });
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();



// App Controller 
const App = (function(ItemCtrl, UICtrl){
    // Events
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();

        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    }

    // Update item
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1, etc)
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArr = listId.split('-');

            // Get the actual Id
            const id = parseInt(listIdArr[1]);

            // Get Item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Add Item Submit
    const itemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add Item to UI list
            UICtrl.addListItem(newItem);
            // Get Total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add Calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Clear input fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // Update Item submit
    const itemUpdateSubmit = function(e){
        // Get Item Input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get Total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add Calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    return {
        init: function() {
            // Clear edit state / Set initial state
            UICtrl.clearEditState();

            // Fetch Items from Item Controller
            const items = ItemCtrl.getItems();

            // Check if any items exist
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate List with Items
                UICtrl.populateItemList(items);
            }

            // Get Total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add Calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            // Load Event Listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);



// Initialize App
App.init();