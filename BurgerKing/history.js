function populateOrderHistory() {
    const orderHistoryContainer = document.querySelector('.order-history-container');
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    console.log("working", orderHistory);

    const table = document.createElement('table');
    table.classList.add('order-history-table');

    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Bill ID', 'Date', 'Bill Amount', 'Status'];

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        header.classList.add('table-header');
        headerRow.appendChild(header);
    });

    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');

    orderHistory.forEach(order => {
        const row = document.createElement('tr');
       row.classList.add('oh-table-row');
        const orderId = document.createElement('td');
        orderId.textContent = order.id;

        const orderDate = document.createElement('td');
        const date = new Date(order.time);
        orderDate.textContent = date.toLocaleDateString();

        const orderAmount = document.createElement('td');
        orderAmount.textContent = "₹ " +order.totalBill;

        const orderStatus = document.createElement('td');
        orderStatus.textContent = order.status;

        const actionsCell = document.createElement('td');

        const viewDetailsBtn = document.createElement('button');
        viewDetailsBtn.textContent = 'View Details';
        viewDetailsBtn.classList.add('view-details-btn');

        const reorderBtn = document.createElement('button');
        reorderBtn.textContent = 'Reorder';
        reorderBtn.classList.add('reorder-btn');

        actionsCell.appendChild(viewDetailsBtn);
        actionsCell.appendChild(reorderBtn);

        row.appendChild(orderId);
        row.appendChild(orderDate);
        row.appendChild(orderAmount);
        row.appendChild(orderStatus);
        // row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    orderHistoryContainer.appendChild(table);
}

populateOrderHistory();
