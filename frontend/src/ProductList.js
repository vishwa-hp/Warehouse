import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [pickingList, setPickingList] = useState({});
  const [packingList, setPackingList] = useState([]);
  const [loadingPickingList, setLoadingPickingList] = useState(false);
  const [loadingPackingList, setLoadingPackingList] = useState(false);

  const fetchPickingList = () => {
    setLoadingPickingList(true);
    axios.get('/api/get-picking-list')
      .then(response => {
        setPickingList(response.data);
        setLoadingPickingList(false);
      })
      .catch(error => {
        console.error('Error fetching picking list:', error);
        setLoadingPickingList(false);
      }, []);
  };

  const fetchPackingList = () => {
    setLoadingPackingList(true);
    axios.get('/api/get-packing-list')
      .then(response => {
        setPackingList(response.data);
        setLoadingPackingList(false);
      })
      .catch(error => {
        console.error('Error fetching packing list:', error);
        setLoadingPackingList(false);
      }, []);
  };

  return (
    <div>
      <h1>Warehouse Orders</h1>
      <button style={{marginRight: "10px"}}onClick={fetchPickingList} disabled={loadingPickingList}>
        {loadingPickingList ? 'Loading Picking List...' : 'Fetch Picking List'}
      </button>
      <button onClick={fetchPackingList} disabled={loadingPackingList}>
        {loadingPackingList ? 'Loading Packing List...' : 'Fetch Packing List'}
      </button>

      <h2>Picking List</h2>
      <ul className='pack'>
        {Object.entries(pickingList).map(([item, quantity]) => (
          <li className='pack'key={item}>
            {item}: {quantity}
          </li>
        ))}
      </ul>

      <h2>Packing List</h2>
      {packingList.map(order => (
        <div key={order.orderId}>
          <h3>Order ID: {order.orderId}</h3>
          <p>Order Date: {order.orderDate}</p>
          <p>Customer Name: {order.customerName}</p>
          <p>Shipping Address: {order.shippingAddress}</p>
          <ul className='pack'>
            {order.lineItems.map(lineItem => (
              <li key={lineItem.productName} className='pack'>
                <b>{lineItem.productName}</b>:
                <ul className='pack'>
                  {lineItem.items.map(item => (
                    <li className='pack'key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
