# 6G Blockchain System - Project Execution Guide

This guide provides a comprehensive, step-by-step walkthrough for initializing, managing, and demonstrating the 6G Blockchain System.

---

## 🛠️ Phase 1: Environment & Server Setup
Before you can interact with the UI, you must initialize the backend.

1.  **Activate the Environment**:
    Open your terminal in the project root and run:
    ```powershell
    bl6genv\Scripts\activate
    ```
2.  **Prepare the Database**:
    Apply the structural migrations to create the blockchain tables:
    ```powershell
    python manage.py migrate
    ```
3.  **Create the Admin (Superuser)**:
    This account gives you full control over the network.
    ```powershell
    python manage.py createsuperuser
    ```
4.  **Launch the System**:
    Start the Django development server:
    ```powershell
    python manage.py runserver
    ```
    *Access the application at `http://127.0.0.1:8000`.*

---

## 👤 Phase 2: User Onboarding
1.  **Register a Regular User**: Navigate to `/register/` to create a standard account.
2.  **Login as Admin**: Use your superuser credentials at `/login/` to access the **Admin Dashboard**.
3.  **Grant Permissions**: To upgrade a regular user to an admin, go to `http://127.0.0.1:8000/admin/`, find the user under "Users", and check the "Staff status" or "Superuser status" box.

---

## 🏗️ Phase 3: Building the 6G Network (Nodes & Shards)
A blockchain needs nodes and a partitioned network (shards) to function.

1.  **Add Network Nodes**: 
    *   Go to **Node Management** in the sidebar.
    *   Click **Add Node** (or use the API: `POST /api/nodes/join/`).
    *   Assign a type: `EDGE` (High power), `IOT` (Sensor), or `CORE` (Centralized).
2.  **Define Shards**:
    *   Navigate to **Shard Management**.
    *   Create shards for different 6G services (e.g., a "Shard-1" for `URLLC` with a minimum reputation requirement of 7.0).
3.  **Auto-Assign Nodes**:
    *   Use the "Quick Action" in the dashboard or visit `/api/shards/auto-assign/`.
    *   The system will automatically put high-reputation nodes into critical shards based on their performance.

---

## ⛓️ Phase 4: Blockchain Operations (The Data Flow)
This is the core operational cycle of the project.

1.  **Initiate a Transaction**:
    There are two ways to push data into the blockchain.
    
    **Option A: In-App (Transaction Monitor)**
    *   Navigate to the **Transaction Monitor** page.
    *   Click the blue **"New Transaction"** button in the header.
    *   Select a **Sender**, **Shard**, and **Type** in the modal.
    *   Click **"Submit Transaction"**.
    
    **Option B: Manual (Django Admin)**
    *   If needed, you can still add transactions at `http://127.0.0.1:8000/admin/core/transaction/add/`.
    *   Note: The **Transaction Hash** will be automatically generated if you leave it blank.
    
    **Option B: Automated (Web API)**
    *   **Endpoint**: `POST /api/transactions/create/`
    *   **Sample Payload**:
        ```json
        {
            "sender_id": "8f3e2...", 
            "shard_id": "c1a9e...",
            "transaction_type": "DATA_SHARE",
            "data_size": 2048,
            "payload_hash": "e3b0c442..."
        }
        ```
2.  **Automatic Consensus Feedback**:
    *   As soon as you submit, the **Django Signals** system triggers the **Load-Sensitive PBFT** algorithm.
    *   Watch the **Transaction Monitor** (or the **Consensus Monitor**).
    *   The transaction status will cycle through:
        `PRE_PREPARE` → `PREPARE` → `COMMIT` → `CONFIRMED`.
    *   **Real-time Update**: You will see the badge change from yellow (Pending) to green (Confirmed) automatically without refreshing.
3.  **Verify Data Storage**:
    *   Once confirmed, go to **Storage Management**.
    *   The transaction is now archived. You can see if it was stored **On-chain** (ledger) or **Off-chain** (external reference).

---

## 📊 Phase 5: Maintenance & Advanced Monitoring
1.  **Update Node Reputation**:
    After several transactions, trigger a reputation recalculation via the **Admin Dashboard** (or `/api/reputation/recalculate/`). 
    *   Nodes that successfully validated transactions will see their scores rise, granting them more power in future rounds.
2.  **Live Monitoring**:
    Keep the **Admin Dashboard** open. Thanks to **WebSockets**, you will see node status badges and transaction counters update instantly without refreshing.
3.  **Run System Audit**:
    To see a complete text-based report of the entire database state, run:
    ```powershell
    python show_all_data.py
    ```

---

## 🎯 Demo Checklist
- [ ] Login as Admin.
- [ ] Create 3 Nodes (Edge, IoT, Core) and set them to "Active".
- [ ] Create 1 Shard (URLLC).
- [ ] Run "Auto-assign" to link nodes to the shard.
- [ ] Go to **Transaction Monitor** and click **"New Transaction"**.
- [ ] Submit the form and watch the status turn **CONFIRMED** in real-time.
- [ ] Show the **Reputation History** and **Storage Records**.

---
**Version**: 1.0  
**Status**: Ready for Execution
