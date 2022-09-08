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
        INT id PK
        TEXT name
        INT tissue_id FK "tissue.id"
        TEXT cell_uid
    }
    tissue {
        INT id PK
        TEXT name
    }
    compound {
        INT id PK
        TEXT name
        TEXT compound_uid
    }
    dataset {
        INT id PK
        TEXT name
    }
    gene {
        INT id PK
        TEXT name
    }
    target {
        INT id PK
        TEXT name
    }
    clinical_trial {
        INT clinical_trail_id PK
        VARCHAR nct
        TEXT link
        TEXT status
    }
    %% annotation tables
    cellosaurus {
        INT id PK
        INT cell_id FK "cell.id"
        VARCHAR identifier
        VARCHAR accession
        TEXT as
        TEXT sy
        TEXT dr
        TEXT rx
        TEXT ww
        TEXT cc
        TEXT st
        TEXT di
        TEXT ox
        TEXT hi
        TEXT sx
        TEXT ca
    }
    cell_synonym {
        INT id PK
        INT cell_id FK "cell.id"
        TEXT dataset_id "FIXME:: Reference dataset as FK?"
        TEXT cell_name
    }
    compound_annotation {
        INT compound_id PK "compound.id"
        TEXT smiles
        TEXT inchikey
        TEXT pubchem
        TEXT chembl_id
        TINYINT fda_status
        TEXT reactome_id
    }
    compound_synonym {
        INT id PK
        INT compound_id FK "compound.id"
        TEXT dataset_id "FIXME:: Reference dataset as FK?"
    }
    tissue_synonym {
        INT id PK
        INT tissue_id FK "tissue.id"
        INT dataset_id FK "dataset.id"
        TEXT tissue_name
    }
    gene_annotation {
        INT gene_id FK "gene.id"
        TEXT symbol
        BIGINT gene_seq_start
        BIGINT gene_seq_end
        VARCHAR chr
        VARCHAR strand
    }
    %% secondary tables
    mol_cell {
        INT id PK
        INT cell_id FK "cell.id"
        INT dataset_id FK "dataset.id"
        TEXT mDataType
        INT num_prof
    }
    experiment {
        INT id PK
        INT cell_id FK "cell.id"
        INT compoound_id FK "compound.id"
        INT dataset_id FK "dataset.id"
        INT tissue_id FK "tissue.id"
    }
    profile {
        INT experimnd_id FK "experiment.id"
        FLOAT HS
        FLOAT Einf
        FLOAT EC50
        FLOAT AAC
        FLOAT IC50
        FLOAT DSS1
        FLOAT DDS2
        FLOAT DSS3
    }
    dose_response {
        INT id PK
        INT experimend_id FK "experiment.id"
        FLOAT dose
        FLOAT response
    }
    dataset_statistics {
        INT id PK
        INT dataset_id FK "dataset.id"
        INT cell_lines
        INT tissues
        INT compounds
        INT experiments
        INT genes
    }
    %% join tables

    %% relations
    cell ||--o| cellosaurus : ""
    cell }|--|| tissue : ""
    %% not implemented yet
    oncotree {
        INT oncotree_id PK
        TEXT name
        TEXT main_type
        VARCHAR UMLS
        VARCHAR NCI
        TEXT tissue
        TEXT parent
        INT level
        DATETIME created_at
        DATETIME updated_at
    }


```
