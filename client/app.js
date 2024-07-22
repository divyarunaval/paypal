window.paypal.Marks({
    fundingSource: paypal.FUNDING.BANCONTACT
}).render('#bancontact-mark');  
  
 window.paypal.Buttons({
  fundingSource: paypal.FUNDING.BANCONTACT,
  style: {
    label: "pay",
  },
  createOrder() {
    return fetch("/my-server/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        cart: [
          {
            sku: "Stationary",
            quantity: "1",
          },
        ],
      }),
    })
    .then((response) => response.json())
    .then((order) => order.id);
  },
  onApprove(data) {
    return fetch("/my-server/capture-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID
      })
    })
    .then((response) => response.json())
    .then((orderData) => {
      // Successful capture! For dev/demo purposes:
      console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
      const transaction = orderData.purchase_units[0].payments.captures[0];
      console.log('Transaction Status:',  transaction.status);
      console.log('Transaction ID:', transaction.id);
      // When ready to go live, remove the alert and show a success message within this page. For example:
      // const element = document.getElementById('paypal-button-container');
      // element.innerHTML = '<h3>Thank you for your payment!</h3>';
      // Or go to another URL:  window.location.href = 'thank_you.html';
    });
  },
  onCancel(data, actions) {
    console.log(`Order Canceled - ID: ${data.orderID}`);
  },
  onError(err) {
    console.error(err);
  }
})
.render("#bancontact-btn");


// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message) {
  const container = document.querySelector("#result-message");
  container.innerHTML = message;
}
