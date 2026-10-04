\# Student Registration \& Passport Administration System (SRPA)



A full-stack web-based system for managing student registration information, nationality details, passport expiry status, reporting, and student data import and export.



\## Overview



The \*\*Student Registration \& Passport Administration System (SRPA)\*\* provides a centralized platform for managing student records and monitoring passport information.



The system supports role-based access for \*\*Pegawai\*\* and \*\*Pensyarah\*\*, integrates country information through the \*\*REST Countries API\*\*, and provides reporting and data management features.



\---



\## Features



\### Authentication \& Authorization



\* User authentication using Laravel Sanctum

\* Role-based access control

\* Separate permissions for:



&#x20; \* Pegawai

&#x20; \* Pensyarah



\### Student Management



\* View student records

\* Search students

\* View detailed student information

\* Add new students

\* Update student information

\* Delete student records

\* Pagination



\### Passport Management



\* Automatic passport expiry status determination

\* Passport status categories:



&#x20; \* \*\*Sah\*\*

&#x20; \* \*\*Akan Tamat\*\*

&#x20; \* \*\*Tamat\*\*

\* Passport expiry monitoring



\### Country Information



\* Country information lookup using the REST Countries API

\* Country name and official country name

\* Region information

\* Country flag display



\### Data Management



\* Import student records

\* Export student records

\* CSV export

\* Student reporting



\### User Interface



\* Responsive web interface

\* Desktop and mobile-friendly layouts

\* Search and pagination

\* Role-based interface controls



\---



\## Technology Stack



| Category             | Technology              |

| -------------------- | ----------------------- |

| Frontend             | React                   |

| Language             | TypeScript              |

| Styling              | Tailwind CSS            |

| Frontend Tooling     | Vite                    |

| Backend              | PHP                     |

| Framework            | Laravel                 |

| Authentication       | Laravel Sanctum         |

| API                  | REST API                |

| Database             | Oracle AI Database 26ai |

| Database Environment | Docker                  |

| External API         | REST Countries API      |

| Version Control      | Git / GitHub            |



\---



\## Submission Contents



The project is submitted as a ZIP archive together with an SQL database file.



```text

Submission/

├── srpa.zip

└── srpa.sql

```



\### `srpa.zip`



Contains the complete project source code:



```text

srpa/

├── backend/

├── frontend/

├── README.md

└── ...

```



\### `srpa.sql`



Contains the SQL database script required to create and populate the database.



> The SQL file is provided separately so the database can be restored without relying on the included presentation seeder.



\---



\## System Requirements



Before running the system, make sure the following software is installed:



\* PHP

\* Composer

\* Node.js

\* npm

\* Git

\* Docker Desktop

\* Oracle AI Database 26ai



\### Important: Windows Home Users



The native Windows installation of \*\*Oracle AI Database Free 26ai does not support Windows Home editions\*\*. Oracle also provides an official Docker container image for Oracle AI Database 26ai.



Therefore, for \*\*Windows Home\*\*, use \*\*Docker Desktop with the WSL 2 backend\*\* to run the Oracle database container. Docker documents WSL 2 as a supported backend on Windows, including Windows Home for Linux containers.



For Windows Pro/Enterprise/Education users, the database can also be installed using a supported native Oracle installation method, or Docker may be used for consistency.



\---



\# Setup Guide



\## 1. Extract the Submission ZIP



Extract `srpa.zip` to a suitable location.



Example:



```text

C:\\Projects\\srpa

```



Open a terminal in the extracted project directory.



\---



\## 2. Database Setup



The application uses \*\*Oracle AI Database 26ai\*\*.



\### Option A — Restore Using the Provided SQL File



Use the provided:



```text

srpa.sql

```



to create the required database objects and data.



Import the SQL file into the Oracle database environment used by the project.



After the database has been restored, configure the Laravel database connection in:



```text

backend/.env

```



\---



\### Option B — Windows Home: Run Oracle Using Docker



If the machine is running \*\*Windows Home\*\*, use Docker Desktop with WSL 2 to run Oracle AI Database 26ai.



Docker Desktop must be installed and configured to use the WSL 2 backend. Docker's documentation provides the required WSL 2 setup and Windows requirements.



Verify Docker is available:



```bash

docker --version

```



Verify Docker is running:



```bash

docker ps

```



Oracle provides an official Oracle AI Database 26ai container image.



If the database container has not been created yet, follow the Oracle AI Database 26ai Docker/container setup corresponding to the database configuration used by this project.



After the Oracle container is running:



1\. Connect to the Oracle database.

2\. Import `srpa.sql`.

3\. Configure the Laravel `.env` database settings.

4\. Continue with the backend setup.



> \*\*Note:\*\* The SQL file and the database connection settings must match the Oracle database configuration used by the project.



\---



\## 3. Backend Setup



Open a terminal:



```bash

cd backend

```



Install PHP dependencies:



```bash

composer install

```



Create the environment file:



```bash

copy .env.example .env

```



Generate the Laravel application key:



```bash

php artisan key:generate

```



Configure the Oracle database connection in:



```text

backend/.env

```



After the database is available and configured, verify the Laravel application can connect to the database.



\---



\## 4. Run the Backend



From the `backend` directory:



```bash

php artisan serve

```



The Laravel API will normally be available at:



```text

http://127.0.0.1:8000

```



\---



\## 5. Frontend Setup



Open another terminal:



```bash

cd frontend

```



Install dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



Vite will display the frontend URL in the terminal.



Open the displayed URL in a web browser.



\---



\## 6. Environment Configuration



The project requires environment-specific configuration in:



```text

backend/.env

```



Configure the Oracle database connection according to the local Oracle environment.



Example:



```env

DB\_CONNECTION=oracle

DB\_HOST=...

DB\_PORT=...

DB\_DATABASE=...

DB\_USERNAME=...

DB\_PASSWORD=...

```



> The exact values depend on the Oracle database environment being used.



Do not commit `.env` or real database credentials to GitHub.



\---



\# User Roles



\## Pegawai



Pegawai has access to student management operations, including:



\* View students

\* Search students

\* View student details

\* Add students

\* Update students

\* Delete students

\* Import students

\* Export student data

\* View reports



\## Pensyarah



Pensyarah has read-oriented access, including:



\* View students

\* Search students

\* View student details

\* Export student data

\* View reports



Write operations such as creating, updating, deleting, and importing student records are restricted to the \*\*Pegawai\*\* role.



\---



\# API Endpoints



\## Authentication



| Method | Endpoint     | Description       |

| ------ | ------------ | ----------------- |

| POST   | `/api/login` | Authenticate user |



\## Students



| Method | Endpoint                  | Description                |

| ------ | ------------------------- | -------------------------- |

| GET    | `/api/students`           | Retrieve student records   |

| POST   | `/api/students`           | Create a student           |

| GET    | `/api/students/{student}` | Retrieve student details   |

| PUT    | `/api/students/{student}` | Update a student           |

| PATCH  | `/api/students/{student}` | Partially update a student |

| DELETE | `/api/students/{student}` | Delete a student           |



\## Import \& Export



| Method | Endpoint                   | Description                   |

| ------ | -------------------------- | ----------------------------- |

| POST   | `/api/students/import`     | Import student records        |

| GET    | `/api/students/export`     | Export student records        |

| GET    | `/api/students/export/csv` | Export student records as CSV |



\## Countries



| Method | Endpoint         | Description                  |

| ------ | ---------------- | ---------------------------- |

| GET    | `/api/countries` | Retrieve country information |



\## Reports



| Method | Endpoint              | Description              |

| ------ | --------------------- | ------------------------ |

| GET    | `/api/reports`        | Retrieve student reports |

| GET    | `/api/reports/export` | Export report data       |



\---



\# Passport Status



The system determines passport status based on the passport expiry date.



| Status         | Description                             |

| -------------- | --------------------------------------- |

| \*\*Sah\*\*        | Passport is valid                       |

| \*\*Akan Tamat\*\* | Passport is approaching its expiry date |

| \*\*Tamat\*\*      | Passport has expired                    |



\---



\# Testing



The backend includes Laravel automated tests.



Run:



```bash

php artisan test

```



\---



\# Security



The system implements:



\* Laravel Sanctum API authentication

\* Role-based authorization middleware

\* Protected API endpoints

\* Server-side request validation

\* Environment-based configuration



Sensitive information such as database credentials and environment-specific configuration should be stored in `.env` and should not be committed to the repository.



\---



\# Development Focus



This project demonstrates practical experience in:



\* Full-stack web application development

\* React and TypeScript development

\* Laravel REST API development

\* Authentication and authorization

\* Role-based access control

\* Oracle database integration

\* Docker-based database environment

\* External API integration

\* Database management

\* Data import and export

\* Reporting

\* Responsive UI development

\* Git and GitHub workflow



\---



\# Academic Project



This system was developed as an academic project to demonstrate the design and implementation of a full-stack student management application.



\---



\# License



This project was developed for academic and project submission purposes.



