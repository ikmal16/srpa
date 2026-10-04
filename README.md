# Student Registration & Passport Administration System (SRPA)

## 1. Installation & Setup

### System Requirements

Install the following software before running the system:

- PHP
- Composer
- Node.js and npm
- Oracle AI Database 26ai Free
- Oracle SQL\*Plus or SQL Developer
- Git (optional)
- Docker Desktop if using a containerized Oracle database

---

## 2. Extract the Project

Extract the provided:

```text
srpa.zip
```

to a preferred location.

Example:

```text
C:\Users\<username>\Project\srpa
```

The extracted project contains:

```text
srpa/
├── backend/
├── frontend/
└── README.md
```

---

## 3. Database Setup

Make sure the Oracle database is running.

The submitted database file:

```text
srpa.sql
```

is provided separately together with `srpa.zip`.

Import or execute `srpa.sql` using Oracle SQL\*Plus or SQL Developer to create the required database tables and data.

Configure the database connection in:

```text
backend/.env
```

Example:

```env
DB_CONNECTION=oracle
DB_HOST=127.0.0.1
DB_PORT=1521
DB_DATABASE=FREEPDB1
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

---

## 4. Backend Setup

Open Command Prompt in the project directory:

```bash
cd backend
```

Install the required PHP dependencies:

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

Start the Laravel backend:

```bash
php artisan serve
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

## 5. Frontend Setup

Open another Command Prompt:

```bash
cd frontend
```

Install the required Node.js dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 6. Login

The system provides two user roles:

| Role      | Access                                        |
| --------- | --------------------------------------------- |
| Pegawai   | Student management, import/export and reports |
| Pensyarah | Student information and reports               |

Demo accounts are included in the provided database.

---

## 7. AI Tools Used

### ChatGPT,Claude
