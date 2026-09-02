# Bathycat Backend

This is the FastAPI backend for the Bathycat Custom Configurable Boat Website.

## Running the Application

### 1. Backend Setup (FastAPI)
Navigate to the `backend` directory and start the server using `uv`:

```bash
cd backend
# Make sure your dependencies are installed (e.g., using uv)
uv run uvicorn app.main:app --reload --port 8000
```

*The backend will run on `http://127.0.0.1:8000`.*
*You can view the interactive API documentation at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup (Next.js)
Open a new terminal, navigate to the `frontend` directory, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

*The frontend will run on `http://localhost:3000`.*

---

## Roles and Default Logins

The application supports multiple roles with different capabilities.

### 1. Admin Role
**Credentials (Seeded in DB):**
*   **Email:** `admin@bathycat.com`
*   **Password:** `admin123`

**Functionality:**
*   Access the exclusive **Admin Panel** (`/admin/dashboard`).
*   **Dashboard:** View all submitted quotes from customers, review selected components and their prices, and update the quote status (Approve / Reject).
*   **Products:** Add and manage base boat platforms (e.g., Bathycat Custom Build).
*   **Components:** Add and manage modular components (e.g., Hull Types, Motors, Sensors, Autonomy features) across 14 different categories.

### 2. Customer Role
**Credentials:**
*   You can create a new customer by clicking **Login** -> **Sign Up** on the frontend (e.g., `user1@example.com` / `password`).

**Functionality:**
*   Access the **Configurator** to build a custom boat.
*   **Save for Later:** Save configurations to their profile to finish later.
*   **Request Formal Quote:** Submit a configuration for a formal quote.
*   Access **My Dashboard** (`/dashboard`) to track the status of requested quotes (Pending, Approved, Rejected) and view saved configurations.

### 3. Guest (Unauthenticated User)
**Functionality:**
*   Browse the homepage, about us, and products.
*   Access the **Configurator** and experiment with building a boat.
*   *Note: Guests must log in or sign up to "Save for Later" or "Request a Quote".*


# Step 1: Start the Servers
Open two separate terminals and start your services:

Terminal 1 (Backend):

bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
Terminal 2 (Frontend):

bash
cd frontend
npm run dev
(Keep both of these running!)

# Step 2: Test as a Customer
Open your browser and navigate to http://localhost:3000.
Click Login in the top right.
Log in with your customer account (e.g., user1@example.com and password). (If it says invalid credentials, just click "Sign Up" and register it).
Click Build Yours to go to the Configurator.
Select a Base Platform and click through the tabs to add a few components.
Click Save for Later. You should see a success notification.
Click Request Formal Quote, fill in your details (User One, 

user1@example.com
, etc.), and hit Submit.
Go to My Dashboard (from the top right navbar).
Under the Saved Configurations tab, verify your saved build is there.
Under the My Quotes tab, verify your quote is listed with a Pending status.
Click Logout.


# Step 3: Test as an Admin
Go back to the Login page.
Log in with the seeded admin credentials:
Email: admin@bathycat.com
Password: admin123
Click the Admin Panel button in the top right.
On the Dashboard, you will see the quote requested by User One.
Click View. A dialog will appear detailing the base product, the exact components User One selected, and the total value.
Click Approve Quote (or Reject).
Close the dialog and check the sidebar on the left:
Click Products to test creating a new Base Platform.
Click Components to test adding new parts/accessories into any of the 14 categories.


# Step 4: Verify the Loop
Log out of the Admin account.
Log back in as your customer (user1@example.com).
Go to My Dashboard and verify that your quote status has automatically changed from Pending to Approved.
This flow will test every major feature we built in Sprint 1! Let me know if you run into any issues while going through these steps.



#### bathycat.db (The Main Database)
This is the primary database that your application is actively using. It contains all the live data for your Bathycat configurator and dashboard. Here is exactly what is stored inside it right now:

users (7 rows): Registered accounts (like your user1@gmail.com test account and any admin accounts).
products (3 rows): The base boat models you can choose from (e.g., Standard, Professional).
component_categories (47 rows): The groupings for parts in the configurator (e.g., Hull Type, Sensors, Propulsion, Power System).
components (213 rows): All the individual, selectable parts and upgrades available in the configurator.
configurations (28 rows): The custom boat configurations that users have saved (including the ones showing on your dashboard right now).
quotes (10 rows): The formal quote requests that have been submitted by users.
component_constraints (0 rows): The table we set up earlier to define incompatible parts (like the 2S battery constraint). It's empty currently until the Admin defines constraints.