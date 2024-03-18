# Message.ly App

Message.ly is a messaging application that allows users to send and receive messages. It provides features for user registration, authentication, and message management.

## Features

- **User Registration**: Users can register with their username, password, first name, last name, and phone number.
- **User Authentication**: Registered users can log in securely using their credentials.
- **Message Creation**: Users can create and send messages to other users.
- **Message Read Status**: Users can mark messages as read, and the application tracks the read status of messages.
- **User Profile**: Users can view their own profile information, including their username, first name, last name, phone number, join date, and last login date.
- **User List**: The application provides a list of all registered users.
- **Message History**: Users can view their message history, including messages sent and received, along with relevant details such as sender/recipient information, message body, timestamp, and read status.

## Technologies Used

- **Node.js**: The backend of the application is built using Node.js.
- **Express.js**: Express.js is used as the web framework for handling HTTP requests.
- **PostgreSQL**: PostgreSQL is used as the database management system for storing user information and messages.
- **JSON Web Tokens (JWT)**: JWT is used for user authentication and authorization.
- **bcrypt**: bcrypt is used for password hashing to securely store user passwords.
- **RESTful API**: The application follows RESTful principles for designing its API endpoints.
- **Middleware**: Middleware functions are used for handling authentication, error handling, and other cross-cutting concerns.

## Getting Started

To get started with the Message.ly app:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up your PostgreSQL database and update the database configuration in the `.env` file.
4. Run the application using `npm start`.
5. Access the application through your web browser or API client.

## Usage

Once the application is running, you can:

- Register as a new user using the `/auth/register` endpoint.
- Log in using the `/auth/login` endpoint to obtain a JWT token.
- Access user-related endpoints such as `/users/:username` to view user profile information.
- Send and receive messages using the `/messages` endpoint.

For detailed API documentation, refer to the API documentation provided in the project.

## Contributing

Contributions to the Message.ly app are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
