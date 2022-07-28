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
        logData: function(){
            return data;
        }
    }
})();



// UI Controller 
const UICtrl = (function(){

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
                <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a>`;
            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
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
            // Clear input fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    return {
        init: function() {

            // Fetch Items from Item Controller
            const items = ItemCtrl.getItems();

            // Check if any items exist
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate List with Items
                UICtrl.populateItemList(items);
            }
            
            // Load Event Listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);



// Initialize App
App.init();