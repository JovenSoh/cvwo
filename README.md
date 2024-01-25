# BookTok Project Setup Guide

This guide provides instructions on setting up the BookTok project, including the frontend, backend, and PostgreSQL database.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js and npm (for the frontend)
- Go (for the backend)
- PostgreSQL (for the database)

## Frontend Setup

1. Clone the Repository
```
git clone https://github.com/JovenSoh/cvwo
```
```
cd booktok-frontend
```

3. Install Dependencies
npm install

4. Create a `.env` file in the root of the frontend directory and add:
```
REACT_APP_SERVER_IP=<backend-server-ip> //should be localhost:8080
```

5. Start the Application
```
npm start
```
## Backend Setup

1. Clone the Repository
```
cd <backend-directory>
```

2. Install Go Packages
Run the following command to install all necessary Go packages:
```
go get ./...
```

3. Run the Application
```
go run main.go
```

## PostgreSQL Database Setup

1. Install PostgreSQL
Follow the instructions for your specific operating system to install PostgreSQL.

2. Create a New Database
Access the PostgreSQL prompt:
```
sudo -u postgres psql //if you are on linux
```

Create a new database:
```sql
CREATE DATABASE booktok;
```
otherwise, set it up using pgAdmin 

3. Create a User (Optional)
Create a new user and grant privileges to the database:
```sql
CREATE USER booktok_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE booktok TO booktok_user;
```

4. Configure Backend to Use PostgreSQL
Update the database connection string in your backend application to point to the newly created database. This is usually located in the main Go file or a configuration file.

## Running the Application

Once the frontend and backend are running, and the PostgreSQL database is set up, you can access the BookTok application through the browser at `http://localhost:3000` (or the port you configured for the frontend).
