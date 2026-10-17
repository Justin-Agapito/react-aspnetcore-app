# Employee Management System

## React + TypeScript + ASP.NET Core 10 Web API + PostgreSQL

A beginner-friendly CRUD learning project for practicing frontend development, backend development, database operations, and communication between React and ASP.NET Core.

---

## 1. Project Overview

### Technology Stack

| Technology                      | Purpose                                    |
| ------------------------------- | ------------------------------------------ |
| React                           | Builds the user interface                  |
| TypeScript                      | Adds type checking to JavaScript           |
| React Router                    | Handles navigation between pages           |
| Axios                           | Sends requests to the backend              |
| ASP.NET Core 10 Web API         | Handles application logic and API requests |
| C#                              | Backend programming language               |
| Entity Framework Core (EF Core) | Connects C# code to the database           |
| PostgreSQL                      | Stores application data                    |
| Git                             | Tracks changes to the project              |

### What Is CRUD?

CRUD represents the four basic operations of a data management system.

- **C — Create:** Add a new employee.
- **R — Read:** Display the list of employees.
- **U — Update:** Edit an employee's information.
- **D — Delete:** Remove an employee.

The goal is to understand how data moves from the React frontend to the C# backend and then into the database.

---

## 2. Create the Project

Open your terminal and navigate to the folder where you want to create the project.

```bash
mkdir EmployeeManagementSystem
cd EmployeeManagementSystem
```

Your project will contain two main folders:

- `frontend` — React and TypeScript.
- `backend` — ASP.NET Core Web API and C#.

---

## 3. Create the Frontend

### Step 1: Create a React + TypeScript project

```bash
npm create vite@latest frontend -- --template react-ts
```

Vite creates the React application and its initial files.

### Step 2: Enter the frontend folder

```bash
cd frontend
```

### Step 3: Install the dependencies

```bash
npm install
npm install react-router-dom axios
```

What each package does:

- `react-router-dom` — lets users navigate between pages.
- `axios` — sends HTTP requests to the backend.
- `react` and `react-dom` — provide the React application itself.
- `typescript` — helps identify certain coding mistakes before running the application.

### Step 4: Start the frontend

```bash
npm run dev
```

Vite will display a local URL, usually:

`http://localhost:5173`

Open that URL in your browser.

To stop the development server, press `Ctrl + C` in the terminal.

---

## 4. Create the Backend

Open a **second terminal** at the root of `EmployeeManagementSystem`, not inside `frontend`.

Your terminal should be in the folder containing the `frontend` directory.

### Step 1: Create the ASP.NET Core Web API

```bash
dotnet new webapi --use-controllers -n Backend -o backend
```

Explanation:

- `dotnet new webapi` — creates a Web API project.
- `--use-controllers` — uses controller classes to handle API requests.
- `-n Backend` — names the project `Backend`.
- `-o backend` — creates the project files inside the `backend` folder.

### Step 2: Enter the backend folder

```bash
cd backend
```

### Step 3: Run the backend

```bash
dotnet run
```

The terminal will display the local address where the API is running.

Keep this terminal open while testing the backend. Press `Ctrl + C` to stop it.

---

## 5. Install the Database Packages

Run these commands **inside the `backend` folder**.

### PostgreSQL — my selected database

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet tool install --global dotnet-ef
```

What each package does:

- `Npgsql.EntityFrameworkCore.PostgreSQL` — allows EF Core to communicate with PostgreSQL.
- `Microsoft.EntityFrameworkCore.Design` — provides design-time support for migrations.
- `dotnet-ef` — provides terminal commands for managing database migrations.

If `dotnet-ef` is already installed globally, you do not need to install it again.

Check the installed tool:

```bash
dotnet ef --version
```

**Important:** Keep your EF Core packages and database provider compatible with your .NET and EF Core versions.

### Other database options

Choose the provider that matches the database you actually use. Do not install every provider at once.

**SQLite**

```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

**MySQL**

```bash
dotnet add package Pomelo.EntityFrameworkCore.MySql
```

For MySQL, check that the provider version supports your EF Core version before installing it.

---

## 6. Recommended Backend Folder Structure

As the project grows, organize the backend like this:

```text
backend/
├── Controllers/
│   └── EmployeesController.cs
├── Data/
│   └── AppDbContext.cs
├── Models/
│   └── Employee.cs
├── Migrations/
├── Properties/
├── appsettings.json
├── Program.cs
└── Backend.csproj
```

### Purpose of each folder

- **Controllers:** Receives API requests and returns responses.
- **Data:** Contains the database context.
- **Models:** Defines the data your application works with.
- **Migrations:** Records changes to your database structure.
- **Program.cs:** Configures and starts the backend application.
- **appsettings.json:** Stores application configuration, such as connection strings.

You do not need to create every folder immediately. Add them as your application needs them.

---

## 7. Configure the Database Connection

Before your backend can save employees, it needs to know how to connect to PostgreSQL.

### Step 1: Create the database

Using PostgreSQL, create a database named:

`employee_management`

### Step 2: Configure the connection string

In `appsettings.json`, add a `ConnectionStrings` section:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=employee_management;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
  }
}
```

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

Do not commit real passwords to Git. For a serious project, use .NET User Secrets or environment variables to keep credentials outside committed configuration files.

### Step 3: Register the database context

In `Program.cs`, register your context using the PostgreSQL provider:

```csharp
using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
```

Keep any additional configuration generated by your project template if it is needed.

---

## 8. Create Your First Model

Create `Models/Employee.cs`.

```csharp
namespace Backend.Models;

public class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? MiddleName { get; set; }

    public int Age { get; set; }

    public string Department { get; set; } = string.Empty;
}
```

In simple words:

- `Id` — identifies each employee.
- `Name` — the employee's name.
- `MiddleName` — optional information.
- `Age` — a whole number.
- `Department` — the employee's department.

Remember that a C# default value does not automatically guarantee that user input is valid. Add validation when you build the API.

---

## 9. Create the Database Context

Create `Data/AppDbContext.cs`.

```csharp
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; } = null!;
}
```

Think of `AppDbContext` as the connection between your C# models and your database.

`DbSet<Employee>` represents the collection of employees that EF Core works with.

**Important:** Keep `AppDbContext` spelled consistently in the class name, constructor, `Program.cs`, and migration metadata.

---

## 10. Create and Apply a Migration

A migration tells EF Core how to create or change your database tables.

Run these commands from the `backend` folder.

### Step 1: Build the project

```bash
dotnet build
```

Fix any build errors before continuing.

### Step 2: Create the migration

```bash
dotnet ef migrations add InitialCreate
```

This records the initial database structure based on your model and context.

### Step 3: Apply the migration

```bash
dotnet ef database update
```

This applies the migration to your PostgreSQL database. Your `Employees` table should now be created.

### When you add another model or change an existing model

For example, if you add an `Email` property to `Employee`, use a new migration:

```bash
dotnet ef migrations add AddEmployeeEmail
dotnet ef database update
```

Do not repeatedly create `InitialCreate`. Use a new descriptive name for each new change.

---

## 11. Build the CRUD API

Create `Controllers/EmployeesController.cs`.

The controller is responsible for receiving requests from the frontend and deciding what operation to perform.

Your API will eventually support these endpoints:

| Operation          | HTTP method | Example endpoint   |
| ------------------ | ----------- | ------------------ |
| Get all employees  | GET         | `/api/employees`   |
| Get one employee   | GET         | `/api/employees/1` |
| Add an employee    | POST        | `/api/employees`   |
| Update an employee | PUT         | `/api/employees/1` |
| Delete an employee | DELETE      | `/api/employees/1` |

The controller uses `AppDbContext` to read and modify employee records.

Learn and implement one operation at a time:

1. Start with GET to display employees.
2. Add POST to create employees.
3. Add PUT to edit employees.
4. Add DELETE to remove employees.

After implementing each operation, test it before moving to the next one.

---

## 12. Connect React to the API

The frontend uses Axios to communicate with the backend.

For example:

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7000/api",
});
```

Replace the example port with the actual HTTPS address and port printed by `dotnet run`.

You can then use Axios to call your endpoints:

```typescript
const response = await api.get("/employees");
```

This requests the employee list from the backend.

The response can then be stored in React state and displayed in the user interface.

As you build the application, create separate files for API requests and TypeScript types rather than placing all your code in one component.

---

## 13. Understand the Complete System Flow

This is the most important part to remember.

```text
USER
  |
  v
REACT + TYPESCRIPT
Displays pages, forms, and employee lists
  |
  v
AXIOS
Sends an HTTP request
  |
  v
ASP.NET CORE WEB API
Receives the request
  |
  v
CONTROLLER
Decides which operation to perform
  |
  v
ENTITY FRAMEWORK CORE
Works with the database through AppDbContext
  |
  v
POSTGRESQL DATABASE
Stores or retrieves employee information
```

When the backend returns a response, the data travels back to React, and React updates the screen.

### Example: Adding an employee

1. The user fills out the employee form in React.
2. The user clicks **Save**.
3. Axios sends a POST request to the API.
4. `EmployeesController` receives the request.
5. The controller uses EF Core to save the employee.
6. PostgreSQL stores the employee record.
7. The API returns a response.
8. React displays the updated result.

Think of React as the person placing an order, the controller as the person handling the request, EF Core as the helper communicating with the database, and PostgreSQL as the place where the records are stored.

---

## 14. Everyday Development Workflow

Whenever you work on the project, follow this routine.

### Starting the application

**Terminal 1 — Backend**

```bash
cd EmployeeManagementSystem/backend
dotnet run
```

**Terminal 2 — Frontend**

```bash
cd EmployeeManagementSystem/frontend
npm run dev
```

Keep both terminals running during development.

### When you add a new database field

1. Update the model in `Models`.
2. Create a migration.
3. Apply the migration.
4. Update the controller if necessary.
5. Update the TypeScript types and React forms or pages.
6. Test the feature.

Example commands:

```bash
cd backend
dotnet build
dotnet ef migrations add AddEmployeeEmail
dotnet ef database update
```

Only create the migration when your model or database configuration actually changes.

### When you only change the React interface

You generally do not need a database migration. Save your frontend files and let Vite reload the page.

### When something breaks

Check these in order:

1. Is the backend running?
2. Is the frontend running?
3. Is the API URL and port correct?
4. Is PostgreSQL running?
5. Is the connection string correct?
6. Does the database have the latest migration?
7. Are there errors in the terminal or browser console?

---

## 15. Useful Commands to Remember

### Frontend

```bash
npm install
npm run dev
npm run build
```

### Backend

```bash
dotnet restore
dotnet build
dotnet run
```

### Database migrations

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
dotnet ef migrations list
```

Replace `MigrationName` with a descriptive name, such as `AddEmployees` or `AddEmployeeEmail`.

Run EF Core commands from the `backend` folder unless you deliberately configure a different project location.

---

## 16. Learning Roadmap

Follow this order to avoid learning everything at once.

- [ ] Create the frontend and backend.
- [ ] Understand `Program.cs`.
- [ ] Create an `Employee` model.
- [ ] Understand `AppDbContext`.
- [ ] Connect PostgreSQL.
- [ ] Create and apply a migration.
- [ ] Implement GET.
- [ ] Display employees in React.
- [ ] Implement POST and create a form.
- [ ] Implement PUT and edit a record.
- [ ] Implement DELETE.
- [ ] Add validation and error handling.
- [ ] Add navigation with React Router.
- [ ] Practice Git commits and branches.

**Learning rule:** Understand one operation before moving to the next. Write the code yourself, test it, and explain in your own words what each part does.

---

## 17. Official References

- React + TypeScript setup: https://vite.dev/guide/
- ASP.NET Core: https://learn.microsoft.com/aspnet/core/
- Entity Framework Core: https://learn.microsoft.com/ef/core/
- EF Core database providers: https://learn.microsoft.com/ef/core/providers/
- PostgreSQL provider: https://www.npgsql.org/efcore/
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/

---

**Final reminder:** React displays the data, ASP.NET Core handles the requests, EF Core communicates with the database, and PostgreSQL stores the data. Your goal is to understand how these parts work together—not just memorize commands.
