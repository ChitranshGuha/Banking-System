const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'new_user',
    password: 'password',
    database: 'banking_system',
    authPlugin: 'mysql_native_password'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/customers', (req, res) => {
    db.query('SELECT * FROM Customers', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      const customers = results.map(customer => {
        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          balance: customer.balance
        };
      });
  
      res.json(customers);
    });
});

app.post('/transfer', (req, res) => {
    const { senderId, receiverId, amount } = req.body;
    const amountNumber = parseFloat(amount);

    db.beginTransaction(err => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.query('SELECT * FROM Customers WHERE id = ?', [senderId], (err, senderResults) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        if (senderResults.length === 0) {
          return db.rollback(() => {
            res.status(400).json({ error: 'Sender not found' });
          });
        }

        const sender = senderResults[0];

        if (sender.balance < amountNumber) {
          return db.rollback(() => {
            res.status(400).json({ error: 'Insufficient balance' });
          });
        }

        db.query('SELECT * FROM Customers WHERE id = ?', [receiverId], (err, receiverResults) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          if (receiverResults.length === 0) {
            return db.rollback(() => {
              res.status(400).json({ error: 'Receiver not found' });
            });
          }

          const receiver = receiverResults[0];

          const newSenderBalance = sender.balance - amountNumber;
          const newReceiverBalance = receiver.balance + amountNumber;

          db.query('UPDATE Customers SET balance = ? WHERE id = ?', [newSenderBalance, senderId], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            db.query('UPDATE Customers SET balance = ? WHERE id = ?', [newReceiverBalance, receiverId], (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }

              db.commit(err => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ error: err.message });
                  });
                }

                res.json({ message: `Transfer successful. Sender balance: $${newSenderBalance}` });
              });
            });
          });
        });
      });
    });
});

app.get('/customer/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM Customers WHERE id = ?', [customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customer = results[0];
        res.json({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            balance: customer.balance
        });
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
