document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('view-customers').addEventListener('click', function (e) {
        e.preventDefault();
        fetch('/customers')
          .then(response => response.json())
          .then(data => {
            const customersDiv = document.getElementById('customers');
            customersDiv.innerHTML = '<h2>All Customers</h2>';
            data.forEach(customer => {
              customersDiv.innerHTML += `<p id="customer-${customer.id}">ID: ${customer.id}, Name: ${customer.name}, Email: ${customer.email}, Balance: $${customer.balance}</p>`;
            });
          })
          .catch(error => console.error('Error:', error));
    });

    document.getElementById('transfer-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const senderId = document.getElementById('sender-id').value;
        const receiverId = document.getElementById('receiver-id').value;
        const amount = parseFloat(document.getElementById('amount').value);

        fetch('/transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ senderId, receiverId, amount })
        })
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              alert(`Error: ${data.error}`);
            } else {
              alert(data.message);

              // Update the sender and receiver balances in the DOM
              fetch(`/customer/${senderId}`)
                .then(response => response.json())
                .then(senderData => {
                  const senderElement = document.getElementById(`customer-${senderData.id}`);
                  if (senderElement) {
                    senderElement.innerHTML = `ID: ${senderData.id}, Name: ${senderData.name}, Email: ${senderData.email}, Balance: $${senderData.balance}`;
                  }
                })
                .catch(error => console.error('Error:', error));

              fetch(`/customer/${receiverId}`)
                .then(response => response.json())
                .then(receiverData => {
                  const receiverElement = document.getElementById(`customer-${receiverData.id}`);
                  if (receiverElement) {
                    receiverElement.innerHTML = `ID: ${receiverData.id}, Name: ${receiverData.name}, Email: ${receiverData.email}, Balance: $${receiverData.balance}`;
                  }
                })
                .catch(error => console.error('Error:', error));
            }
          })
          .catch(error => console.error('Error:', error));
    });
});
