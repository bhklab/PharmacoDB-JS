# PharmacoDB-JS Web Application

## Setup Instructions

-   Clone the repo

```bash
git clone https://github.com/bhklab/PharmacoDB-JS.git
cd PharmacoDB-JS
```

-   In the project directory, install all server dependencies `npm i`
-   Create .env using .env.example as a reference to access the database
-   Start the server by running `npm start` or `npm run devstart`(development mode) command
-   Start the client (development mode) by running `npm start`
-   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

-   React
-   React-Router
-   Express
-   Knex
-   Body-parser

## Dev Dependenices
1
-   Nodemon
-   Eslint

## Servers

-   Production Server: https://pharmacodb.ca/

## Migrations

-   `knex migrate:make (migration_name)` - To create a new migration file.
-   `knex migrate:latest` - To run the lastest migrations and create corresponding tables.

## Seeds (Seeding Files)

-   Create manually a file (`touch file_name`).
-   Run `knex seed:run` to run the seeding file(s) in order to seed the table(s) in the database.

## Database Schema

```mermaid
erDiagram
    %% primary tables
    cell {
        INT-128 id PK
        TEXT-65535 name
        INT-128 tissue_id FK "tissue.id"
        TEXT-65535 cell_uid
    }
    tissue {
        INT-128 id PK
        TEXT-65535 name
    }
    compound {
        INT-128 id PK
        TEXT-65535 name
        TEXT-65535 compound_uid
    }
    dataset {
        INT-128 id PK
        TEXT-65535 name
    }
    gene {
        INT-128 id PK
        TEXT-65525 name
    }
    target {
        INT-128 id PK
        TEXT-65525 name
    }
    clinical_trial {
        INT-128 clinical_trail_id PK
        VARCHAR-255 nct
        TEXT-65535 link
        TEXT-65535 status
    }
    %% secondary tables
    %% annotation tables
    cellosaurus {
        INT-128 id PK
        INT-128 cell_id FK "cell.id"
        VARCHAR-255 identifier
        VARCHAR-255 accession
        TEXT-65535 as
        TEXT-65535 sy
        TEXT-65535 dr
        TEXT-65535 rx
        TEXT-65535 ww
        TEXT-65535 cc
        TEXT-65535 st
        TEXT-65535 di
        TEXT-65535 ox
        TEXT-65535 hi
        TEXT-65535 sx
        TEXT-65535 ca
    }
    cell_synonym {

    }
    %% join tables

    %% relations
    cell ||--o| cellosaurus : ""
    cell }|--|| tissue : ""


```
