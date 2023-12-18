const saveOrderHistory = (orderDetails) => {

    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

    orderHistory.push(orderDetails);

    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
};

const submitOrder = (event) => {
    event.preventDefault(); 

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    let bill = JSON.parse(localStorage.getItem('bill')) || {};
    const totalItems =bill.item;
    const totalBill = bill.price;

    const cartItems = JSON.parse(localStorage.getItem('cart')) || {};

const status="Delivered";
const min = 1000; 
const max = 9999; 

const id = Math.floor(Math.random() * (max - min + 1)) + min;

const time=new Date()
    const orderDetails = {
        username,
        email,
        address,
        totalItems,
        totalBill,
        cartItems,
        status,id,time
    };

    saveOrderHistory(orderDetails);

    localStorage.removeItem('cart');
    localStorage.removeItem('bill');


    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('address').value = '';


    window.location.replace("/order-success.html")

};

const orderForm = document.querySelector('.form-info');
orderForm.addEventListener('submit', submitOrder);

//calculate total items and total bill in summary
const populateSummary = () => {
    let bill = JSON.parse(localStorage.getItem('bill')) || {};
    const summaryDiv = document.querySelector('.summary-div');
    if(bill.discountedPrize){summaryDiv.innerHTML = `Total Items=${bill.item} &nbsp;&nbsp;Total Bill=<span class="erased-text light-yellow" >₹${bill.price} </span>&nbsp;  ₹${bill.discountedPrize}`;}
    else{summaryDiv.textContent = `Total Items=${bill.item}  Total Bill= ₹${bill?.bill.price}`;}
};

//display total itmes and total bill in summary
populateSummary();






//


// Now you can use this discountApplied value in your total bill calculation
