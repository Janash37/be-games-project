# Jan's boardgame API

## About this project

This API has been created for the purpose of providing app data on a series of board games, to inform front-end development. The project is intended to be an introduction to the process of building a real-world back-end.

---

## Link to the API

The boardgame API can be found at: https://be-boardgames-api.herokuapp.com/api.

---

## Before starting

The minimum versions needed to run this project are:

- node.js: v16.16.0
- Postgres: v8.7.3

---

## How to use

### 1. Clone the repository

To clone this repo, open your terminal and enter the following command:

```JSON
git clone https://github.com/Janash37/be-games-project.git
```

### 2. Create necessary environment files

In order to run and test the files, anyone cloning the repo must first create their own set of environment files. Two `.env` files will need to be created at the root level:`.env.test` and `.env.development`

Run the following commands to create both files:

```JSON
touch .env.test
touch .env.development
```

Into each environment file, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see /db/setup.sql for the correct database names). If using a Mac, this should be all that you need
to add to the file. If you are using Linux or WSL, you will also need to add your `PGUSER` and `PGPASSWORD` data.

**Important:** Be sure to .gitignore both `.env` files so that other users cloning your own version of this repo (if public), won't have access to your own PG data.

### 3. Install dependencies

A number of dependencies are required in order for the files to work. Dependencies to be required in are:

- express
- husky
- jest
- jest-extended
- pg
- pg-format
- dotenv

Developer dependencies to be required in are:

- jest-sorted
- supertest

To install the required dependencies, use the terminal command:

```json
npm install dependency
```

where "dependency" is replaced with the correct name from the list above. When installing developer dependencies, use the command:

```json
npm install -D dependency
```

### 4. Set up and seed the local database

For the API to function, the database first needs to be created and seeded with data. To create the database, use the command:

```json
npm run setup-dbs
```

To seed the database, use the command:

```json
npm run seed
```

### 5. Run the tests

To ensure that the database and API are working as intended, `jest` can be used to run tests on the data with the following command:

```json
npm test ./__tests__/app.test.js
```
