# Bike_Rental_Reservation_System_Backend

[Live Demo](https://bike-rental-reservation-system-backend-gamma.vercel.app/)

## Table of Contents

- [Introduction](#Introduction)
- [Features](#Features)
- [Technologies Used](#Technologies-Used)
- [Installation](#Installation)
- [Usage](#Usage)
- [API Endpoints](#API-Endpoints)
- [Environment Variables](#Environment-Variables)
- [Contributing](#Contributing)
- [Contact](#Contact)

## Introduction

The Bike Rental Reservation System is a comprehensive web application that allows users to rent bikes online. This system enables users to browse available bikes, make reservations, and calculate rental costs based on the duration of use. Administrators can manage bike inventory and monitor rentals.

## Features

- User Authentication: Secure sign-up and login for users.
- Bike Reservation: Users can rent bikes, view available bikes, and manage their reservations.
- Real-Time Availability: The system updates bike availability in real-time as rentals are made.
- Cost Calculation: The rental cost is calculated automatically based on the duration of the rental.
- Admin Panel: Manage bike inventory and monitor active and past rentals.
- Error Handling: Comprehensive error handling for a seamless user experience.

## Technologies Used

- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JSON Web Tokens (JWT), bcrypt
- Validation: Zod for input validation
- Error Handling: Custom middleware for global error handling
- Environment Management: dotenv for environment variables
- Version Control: Git, GitHub

## Installation

To set up the project locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js
- MongoDB

### Clone the Repository

```sh
git clone https://github.com/Yeasin1020/Bike_Rental_Reservation_System_Backend.git
cd Bike_Rental_Reservation_System_Backend
```

### Install Dependencies

```sh
npm install
```

### Create a .env File

Create a new file named `.env` in the root directory and add your MongoDB connection string and other
environment variables as needed.

```sh
NODE_ENV = development
PORT = 5000
DATABASE_URL = your-mongo-db-uri
BCRYPT_SALT_ROUNDS = 12
JWT_ACCESS_SECRET = your-jwt-secret
JWT_ACCESS_EXPIRES_IN = Your choice
JWT_REFRESH_SECRET=your-jwt-secret
JWT_REFRESH_EXPIRES_IN=Your choice
```

### Run Application

```sh
npm start
```

The application should now be running on `http://localhost:5000`.

## Usage

### Register a New User

1. Visit `http://localhost:5000/api/auth/signup`
2. Provide your details to sign up.

### Login

1. Visit `http://localhost:5000/api/auth/login`
2. Enter your credentials to log in.

### Reserve a Bike

1. Visit `http://localhost:5000/api/rentals/:id/return`
2. Enter the bike ID to reserve a bike.

## API Endpoints

Here is a summary of the main API endpoints:

- Authentication

  - POST `/api/auth/signup` - Register a new user
  - POST `/api/auth/login` - Log in as a user

- Bikes

  - GET `/api/bikes` - Get all available bikes
  - PUT `/api/bikes/:id` - Update bike
  - DELETE `/api/bikes/:id` - Delete bike

- Rentals

  - POST `/api/rentals` - Create a new rental
  - GET `/api/rentals` - Get all rentals for a user
  - PUT `/api/rentals/:id/return` - Return a rented bike

## Environment Variables

The application uses environment variables for sensitive data. The following variables should be defined in your `.env` file:

- NODE_ENV = The environment in which the app is running (`development`, `production`).
- PORT = The port on which the app will run.
- DATABASE_URL = your-mongo-db-uri
- BCRYPT_SALT_ROUNDS = 12
- JWT_ACCESS_SECRET = your-jwt-secret
- JWT_ACCESS_EXPIRES_IN = Your choice
- JWT_REFRESH_SECRET=your-jwt-secret
- JWT_REFRESH_EXPIRES_IN=Your choice

## Contributing

We welcome contributions! Please fork this repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## Contact

- Name - Md. Yeasin Sarkar
- Email - [mdeasinsarkar01@gmail.com](mailto:mdeasinsarkar01@gmail.com)
- Phone - +8801405671742
