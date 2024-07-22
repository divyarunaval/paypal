window.paypal.Marks({
    fundingSource: paypal.FUNDING.BANCONTACT
}).render('#bancontact-mark');  
  
paypal.PaymentFields({
    fundingSource: paypal.FUNDING.BANCONTACT,
    // style object is optional
    style: {
      // customize field attributes (optional)
      variables: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif", // applies to all payment fields text
        fontSizeBase: "0.9375rem", // applies to input, placeholder, and dropdown text values
        fontSizeM: "0.93rem", // the payment fields title description
        textColor: "#2c2e2f", // applies payment fields title description, input, and dropdown text
        colorTextPlaceholder: "#2c2e2f", // applies to the placeholder text
        colorBackground: "#fff", // background color of the input and dropdown fields
        colorDanger: "#d20000", // applies to the invalid field border and validation text
        borderRadius: "0.2rem", // for the input and dropdown fields
        borderColor: "#dfe1e5", // for the input and dropdown fields
        borderWidth: "1px", // for the input and dropdown fields
        borderFocusColor: "black", // color for the invalid field border and validation text
        // spacingUnit: "10px", // spacing between multiple input fields, bancontact has one input field
      },

      // set custom rules to apply to fields classes (optional)
      // see https://www.w3schools.com/css/css_syntax.asp fore more on selectors and declarations
      rules: {
        ".Input": {}, // overwrite properties for the input fields
        ".Input:hover": {}, // applies to the input field on mouse hover
        ".Input:focus": { // applies to the focused input field
          color: 'blue',
          boxShadow: '0px 2px 4px rgb(0 0 0 / 50%), 0px 1px 6px rgb(0 0 0 / 25%)',
        },
        ".Input:active": {}, // applies when input fields are clicked
        ".Input--invalid": {}, // applies to input fields when invalid input is entered
        ".Label": {}, // overwrite properties for the input field labels
      },
    },

    fields: {
      // fields prefill info (optional)
      name: {
        value: ''
      },
    },
  })
  .render('#bancontact-container');

 paypal.Buttons({
  fundingSource: paypal.FUNDING.BANCONTACT,
  style: {
    label: "pay",
  },
  createOrder() {
    return fetch("/server/createOrder", {
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
    return fetch("/server/captureOrder", {
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
