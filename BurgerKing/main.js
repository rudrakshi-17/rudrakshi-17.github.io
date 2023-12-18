let foodItems = []; //fetching data and storing it here

fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        foodItems = data; // Assigned fetched data to foodItems
        renderFoodCards(foodItems);
        populateOrderDetails();

    });

//creating food cart and rendering
const renderFoodCards = (fItems) => {
    const menueItemsContainer = document.getElementById('m-items-container');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || {};


    fItems?.map(item => {
        const card = document.createElement('div');
        card.className = 'm-card column-flex';

        const foodTypeImg = document.createElement('img');
        foodTypeImg.src = item.type === 'VEG' ? './assets/veg.png' : './assets/non-veg.png';
        foodTypeImg.className = 'food-type';
        foodTypeImg.width = '30px';

        const foodImg = document.createElement('img');
        foodImg.src = item.img;
        foodImg.alt = item.name;
        foodImg.className = 'm-card-img';
        foodImg.height = '200px';
        foodImg.width = '200px';

        const foodName = document.createElement('h2');
        foodName.textContent = item.name;

        const foodPrice = document.createElement('h3');
        foodPrice.innerHTML = `₹ ${item.price} <span class="erased-text">₹${item.mrp}</span>`;


        const addToCartSelect = document.createElement('select');
        addToCartSelect.name = 'cart-item';
        addToCartSelect.className = 'add-to-cart';
        addToCartSelect.id = `cart-item-${item.id}`;
        const defaultOption = document.createElement('option');
        defaultOption.value = '0';
        defaultOption.textContent = 'Add to cart';
        addToCartSelect.appendChild(defaultOption);

        for (let i = 1; i <= 9; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i} Item${i > 1 ? 's' : ''}`;
            if (cartItems[item.id] === i) {
                option.selected = true; // Set as selected if quantity matches
            }
            addToCartSelect.appendChild(option);
        }

        card.appendChild(foodTypeImg);
        card.appendChild(foodImg);
        card.appendChild(foodName);
        card.appendChild(foodPrice);
        card.appendChild(addToCartSelect);

        menueItemsContainer?.appendChild(card);
    });
}

//search function 
const handleSearch = () => {
    const searchName = document.getElementById('search-input').value.toLowerCase().trim();

    const filteredItems = foodItems.filter(item => item.name.toLowerCase().includes(searchName));
    clearMenuItems();
    renderFoodCards(filteredItems);
}

const clearMenuItems = () => {
    const menuItemsContainer = document.getElementById('m-items-container');
    menuItemsContainer.innerHTML = '';
}



const addToCart = (itemId, quantity) => {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || {};


    if (cartItems.hasOwnProperty(itemId)) {

        cartItems[itemId] = parseInt(quantity);
    } else {

        cartItems[itemId] = parseInt(quantity);
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));

    updateCartCount();
};


//in order view
const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
    let totalCount = 0;


    Object.values(cartItems).forEach(quantity => {
        totalCount += quantity;
    });

    const viewCartDiv = document.querySelector('.veiw-cart-div');
    const viewCartButton = document.querySelector('.view-cart-btn');

    if (viewCartDiv) {
        if (totalCount > 0) {
            viewCartDiv.classList.add('show');
            viewCartDiv.textContent = `${totalCount} Item${totalCount !== 1 ? 's' : ''} added `;
            viewCartDiv.appendChild(viewCartButton);

        } else {
            viewCartDiv.classList.remove('show');
        }
    }
};

updateCartCount();


const menueItemsContainer = document.getElementById('m-items-container');

menueItemsContainer?.addEventListener('change', function (event) {
    if (event.target.classList.contains('add-to-cart')) {
        const itemId = event.target.id.replace('cart-item-', '');
        const quantity = event.target.value;

        if (quantity !== '') {
            addToCart(itemId, quantity);
        }
    }
});


const getItemDetailsById = (itemId) => {
    console.log(foodItems, "lolo", itemId)

    return foodItems.find(item => item.id == itemId);
};



const populateOrderDetails = () => {
    const orderDetailsContainer = document.getElementById('order-details-container');
    orderDetailsContainer.innerHTML = '';

    let cartItems = JSON.parse(localStorage.getItem('cart')) || {};
    let totalItems = 0;
    let totalPrice = 0;

    for (const itemId in cartItems) {
        if (cartItems.hasOwnProperty(itemId)) {

            const item = getItemDetailsById(itemId);
            const odTile = document.createElement('div');
            odTile.classList.add('flex', 'od-tile');

            const foodTypeImg = document.createElement('img');
            foodTypeImg.src = item.type === 'VEG' ? './assets/veg.png' : './assets/non-veg.png';
            foodTypeImg.alt = 'Food Type';
            foodTypeImg.height = '40px';

            const foodName = document.createElement('h5');
            foodName.textContent = item.name;

            const itemPrice = document.createElement('h4');
            itemPrice.textContent = `Price: ₹${item.price}`;

            const itemMRP = document.createElement('h4');
            itemMRP.classList.add("erased-text")
            itemMRP.textContent = `MRP: ₹${item.mrp}`;

            const selectQuantity = document.createElement('select');
            selectQuantity.name = 'cart-item';
            selectQuantity.className = 'add-to-cart';
            selectQuantity.dataset.itemId = itemId;

            const removeButton = document.createElement('div');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-btn');
            removeButton.dataset.itemId = itemId;

            for (let i = 1; i <= 5; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${i} Item${i > 1 ? 's' : ''}`;
                selectQuantity.appendChild(option);
            }

            selectQuantity.value = cartItems[itemId];

            odTile.appendChild(foodTypeImg);
            odTile.appendChild(foodName);
            odTile.appendChild(itemPrice);
            odTile.appendChild(itemMRP);
            odTile.appendChild(selectQuantity);
            odTile.appendChild(removeButton);

            orderDetailsContainer.appendChild(odTile);


            totalItems += parseInt(cartItems[itemId]);
            totalPrice += parseInt(cartItems[itemId]) * parseFloat(item.price);
        }
    }
    const combo = applyComboDiscount(cartItems);
    const discountApplied = combo?.totalDiscount;
    console.log("Discount Applied:", discountApplied, combo);
    
    if (discountApplied) {
        const comboBox = document.createElement('div');
        comboBox.classList.add('combo-box');

        const totalCount = Object.values(combo.comboCount).reduce((acc, val) => acc + val, 0);

        comboBox.innerHTML = `<div class="flex">Hurray! ${totalCount}X Combo Discounts applied. You saved ₹${discountApplied}  <span onclick={handleShowCD()}> ></span> </div>`;
    
        const comboDetails = document.createElement('div');
        comboDetails.classList.add('combo-details');
        comboDetails.classList.add('flex');
        const isShowCD = JSON.parse(localStorage.getItem('showCD')) || false;
if(isShowCD){        comboDetails.classList.add('showCD');
}
  const table = document.createElement('table');
    const headerRow = table.insertRow();
  const headers = ['Combo Details', 'Count', 'Discount', 'Total Discount'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  
  // Populate table with combo details
  for (const [comboName, count] of Object.entries(combo.comboCount)) {
    const row = table.insertRow();
    
    const comboCell = row.insertCell();
    comboCell.innerHTML = `${comboName}(${getComboDetails(comboName)} )`;
    
    const countCell = row.insertCell();
    countCell.textContent = count;
    
    const discountCell = row.insertCell();
    discountCell.textContent = getComboDiscount(comboName);
    
    const totalDiscountCell = row.insertCell();
    totalDiscountCell.textContent = count * getComboDiscount(comboName);
  }
  
  // Append the table to an existing element with the ID 'comboDetails' (adjust as needed)
  comboDetails.appendChild(table);
  
    
        comboBox.appendChild(comboDetails);
        orderDetailsContainer.appendChild(comboBox);
    }
    
 const discountedPrize=totalPrice-discountApplied
    const totaElem = document.createElement('h2');
    const bill = { item: totalItems, price: totalPrice ,discountedPrize}
    localStorage.setItem("bill", JSON.stringify(bill))
   
    if (discountApplied) {
        totaElem.innerHTML = `<span>Total items: ${totalItems}  <span>  &nbsp; &nbsp;Total bill: <span class="erased-text light-yellow" >₹${totalPrice}</span> ₹${discountedPrize} </span> </span> &nbsp;&nbsp; <a href="checkout.html" class="checkout-btn" >Checkout</a>`;
    }
    else {
        totaElem.innerHTML = `Total items: ${totalItems} Total bill: ₹${totalPrice} <a href="checkout.html" class="checkout-btn" >Checkout</a>`;
    }

  
    orderDetailsContainer.appendChild(totaElem);


    orderDetailsContainer.addEventListener('change', handleQuantityChange);
    orderDetailsContainer.addEventListener('click', handleRemoveItem);
};

const handleQuantityChange = (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const itemId = event.target.dataset.itemId;
        const quantity = event.target.value;


        let cartItems = JSON.parse(localStorage.getItem('cart')) || {};
        cartItems[itemId] = parseInt(quantity);
        localStorage.setItem('cart', JSON.stringify(cartItems));

        populateOrderDetails();
    }
};

const handleRemoveItem = (event) => {
    if (event.target.classList.contains('remove-btn')) {
        const itemId = event.target.dataset.itemId;


        let cartItems = JSON.parse(localStorage.getItem('cart')) || {};
        delete cartItems[itemId];
        localStorage.setItem('cart', JSON.stringify(cartItems));

        populateOrderDetails();
    }
};



const combos = [
    {
        "ids": [2, 5, 6],
        "name": "Happiest combo",
        "discount": 330,
        "cid":1
    },
    {
        "ids": [1, 3, 4],
        "name": "Happy Combo",
        "discount": 230,
        "cid":2
    }
    // Add more combo objects if needed
];

const applyComboDiscount = (cartItems) => {
    let totalDiscount = 0;
    let comboCount = {};

    for (const combo of combos) {
        const comboIds = combo.ids;
        const comboDiscount = combo.discount;
        const comboName = combo.name;

        let comboOccurrences = Number.MAX_SAFE_INTEGER;

        // Check how many times the combo occurs in the cart (minimum occurrence of individual IDs)
        for (const id of comboIds) {
            if (!cartItems.hasOwnProperty(id)) {
                comboOccurrences = 0;
                break;
            }
            comboOccurrences = Math.min(comboOccurrences, cartItems[id]);
        }

        // Apply the combo discount based on its occurrences
        if (comboOccurrences > 0) {
            const totalComboDiscountForThisCombo = comboDiscount * comboOccurrences;
            totalDiscount += totalComboDiscountForThisCombo;
            comboCount[comboName] = comboCount[comboName] ? comboCount[comboName] + comboOccurrences : comboOccurrences;
        }
    }

    return {
        totalDiscount,
        comboCount
    };
};


const handleShowCD=()=>{
    const isShowCD = JSON.parse(localStorage.getItem('showCD')) || false;
    localStorage.setItem("showCD", JSON.stringify(!isShowCD))
    populateOrderDetails()
}

const getComboDetails=(name)=>{
const comboObjs=combos?.find((c)=>c.name===name)?.ids?.map((i)=>getItemDetailsById(i))
return comboObjs?.map((o)=>o?.name)
}
const getComboDiscount=(name)=>{
    const comboObj=combos?.find((c)=>c.name===name)
    return comboObj?.discount||0
    }