# Expense Management System
A Expense Management Node application is a application to manage users expenses
By providing REST API endpoints in it.

The api's are written in [NodeJS](https://nodejs.org/en/).

Steps to run the api server:
> Make sure you have NodeJS version 10 or higher installed & Postgres for database.
1) Clone this repository.
2) Navigate to repository folder and execute the following command:
    `npm install`
3) Run the following command to install `knexJS` globally.:
    `npm i -g knex`
4) Create a DB in postgres. Make note of DB name along with username, password and host. You machine should be able to connect to database using any DB client (PgAdmin, DBeaver). Also grant all privillages to it.
5) Run `npm start` in root directory of project to start the api server. This will start the server & execute knex mirations which will automatically create tables & teir relations. Server will listen on port `8641`.
7) Import the following postman collection to have a look at the api's and try them out yourself. Set the following environment variable in postman.
    `url : localhost:8641/api`
8) To run tests use the following command: `npm run test`
___

### API Endpoints (localhost:8641/api/*)

All the parameters in all the api's are required, unless state optional

#### Postman Collection

Link: [https://www.getpostman.com/collections/54bd2e84b27ad2b4dcb0](https://www.getpostman.com/collections/54bd2e84b27ad2b4dcb0)

For authorization add authorization in collection and all the request will inherit it.