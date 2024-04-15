const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Read orders data from JSON file
let orders = [];
try {
    orders = JSON.parse(fs.readFileSync(path.join(__dirname, 'orders.json'), 'utf8'));
    console.log('Orders data:', orders);
} catch (error) {
    console.error('Error reading or parsing orders data:', error);
}

// Read products data from JSON file
let products = {};
try {
    products = JSON.parse(fs.readFileSync(path.join(__dirname, 'productsMap.json'), 'utf8'));
    console.log('Products data:', products);
} catch (error) {
    console.error('Error reading or parsing products data:', error);
}



// Function to get the picking list
const getPickingList = () => {
    let itemsCounter = {};

    const today = new Date();
    const previousDay = new Date(today);
    previousDay.setDate(today.getDate() - 1);
    const formattedPrevDay = `${previousDay.getFullYear()}-${String(previousDay.getMonth() + 1).padStart(2, "0")}-${String(previousDay.getDate()).padStart(2, "0")}`;

    const previousDayOrders = orders.filter((order) => order.orderDate === formattedPrevDay);

    previousDayOrders.forEach((order) => {
        order.lineItems.forEach((lineItem) => {
            if (products[lineItem.productId]) {
                products[lineItem.productId].items.forEach((product) => {
                    itemsCounter[product] = itemsCounter[product] ? itemsCounter[product] + 1 : 1;
                });
            };
        });
    });

    return itemsCounter;
};

// Function to get the packing list
const getPackingList = () => {
    let packingList = [];

    const today = new Date();
    const previousDay = new Date(today);
    previousDay.setDate(today.getDate() - 1);
    const formattedPrevDay = `${previousDay.getFullYear()}-${String(previousDay.getMonth() + 1).padStart(2, "0")}-${String(previousDay.getDate()).padStart(2, "0")}`;

    const previousDayOrders = orders.filter((order) => order.orderDate === formattedPrevDay);

    previousDayOrders.forEach((order) => {
        const orderDetails = {
            orderId: order.orderId,
            orderDate: order.orderDate,
            customerName: order.customerName,
            shippingAddress: order.shippingAddress,
            lineItems: [],
        };

        order.lineItems.forEach((lineItem) => {
            if (products[lineItem.productId]) {
                const packingListItems = {
                    productName: lineItem.productName,
                    items: products[lineItem.productId].items,
                };

                orderDetails.lineItems.push(packingListItems);
            };
        });

        packingList.push(orderDetails);
    });

    return packingList;
};

// Endpoint to get picking list
app.get('/api/get-picking-list', (req, res) => {
    const pickingList = getPickingList();
  
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(pickingList));
});

// Endpoint to get packing list
app.get('/api/get-packing-list', (req, res) => {
    const packingList = getPackingList();
  
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(packingList));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
