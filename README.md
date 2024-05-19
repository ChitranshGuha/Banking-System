# Basic Banking System

Sparks Foundation Internship Project : Basic Banking System
A Web Application used to transfer money between multiple users (Project contains 10 dummy users). Users can view all customers, transfer money between accounts, and see updated balances.

## Features

- View a list of all customers with their details (ID, Name, Email, Balance).
- Transfer money between customers using their IDs.
- Real-time balance updates after transactions.

## Technologies Used

- HTML, CSS, JavaScript (Frontend)
- Node.js, Express.js (Backend)
- MySQL (Database)

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MySQL installed and running

### Database Setup

1. Create a MySQL database called `banking_system`.
2. Create a `Customers` table with the following structure:

    ```sql
    CREATE TABLE Customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        balance DECIMAL(10, 2) NOT NULL
    );
    ```

3. Insert some initial data into the `Customers` table:

    ```sql
    INSERT INTO Customers (name, email, balance) VALUES
    ('Alice', 'alice@example.com', 1000.00),
    ('Bob', 'bob@example.com', 1500.00),
    ('Charlie', 'charlie@example.com', 2000.00);
    ```

### Application Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/basic-banking-system.git
    cd basic-banking-system
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure the database connection in `server.js`:

    ```javascript
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'your_mysql_username',
        password: 'your_mysql_password',
        database: 'banking_system',
        authPlugin: 'mysql_native_password'
    });
    ```

4. Start the application:

    ```bash
    npm start
    ```

5. Open your browser and go to `http://localhost:3000`.

## Project Structure

- `public/`: Contains static files (HTML, CSS, JavaScript).
    - `index.html`: Main HTML file.
    - `styles.css`: CSS file for styling.
    - `script.js`: JavaScript file for frontend logic.
- `server.js`: Express server setup and API routes.
- `README.md`: Project documentation.

## Usage

1. Click "View All Customers" to see a list of all customers.
2. Use the transfer form to send money from one customer to another by their IDs.
3. The balances will update in real-time after a successful transfer.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

