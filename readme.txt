# 🚀 6G Blockchain System (Django + MySQL + Channels)

A **multi-user, role-based 6G blockchain management system** built with **Django 4**, **MySQL**, **Django Channels**, and a modern Bootstrap 5 UI.

This system provides an **admin dashboard** for managing blockchain entities (nodes, shards, transactions, consensus, storage, reputation) and a **secure user registration & authentication flow** with role-based access control.

---

## 🧱 Tech Stack

* **Backend:** Django 4.2
* **Database:** MySQL / MariaDB
* **Real-time:** Django Channels + Redis
* **Forms/UI:** Crispy Forms + Bootstrap 5
* **Config:** python-decouple (.env support)

---

## ✨ Features

### 👥 Multi-User System

* User registration & login
* Unique email & username validation
* Secure password storage

### 🛡 Role-Based Access

* **Admin Users**

  * Full dashboard access
  * Admin panel access
  * Manage all blockchain models
* **Regular Users**

  * Account welcome page
  * Restricted access

### 📊 Admin Dashboard

* Manage:

  * Nodes
  * Shards
  * Transactions
  * Consensus rounds
  * Storage records
  * Reputation history

### 🎨 Modern UI

* Black & Green theme
* Responsive design
* Bootstrap 5 + Font Awesome

### ⚡ Real-Time Ready

* Powered by Django Channels for future real-time blockchain events

---

## 📦 Requirements

From `requirements.txt`:

```
Django==4.2.7
mysqlclient>=2.2.8
django-crispy-forms==2.0
crispy-bootstrap5==0.7
channels==4.0.0
channels-redis==4.1.0
python-decouple==3.8
requests==2.31.0
```

---

## 🛠 Prerequisites

* Python 3.8+
* MySQL 5.7+ or MariaDB
* Redis (for Channels)

---

## ⚙️ Installation

### 1️⃣ Create & Activate Virtual Environment

```bash
# Windows
bl6genv\Scripts\activate

# Linux/Mac
source bl6genv/bin/activate
```

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root:

```
DB_NAME=6g_blockchain
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
```

### 4️⃣ Apply Migrations

```bash
python manage.py migrate
```

### 5️⃣ Create Admin (Superuser)

```bash
python manage.py createsuperuser
```

### 6️⃣ Run Server

```bash
python manage.py runserver
```

App runs at:

```
http://127.0.0.1:8000
```

---

## 🔐 Access Guide

### Admin

* `/admin/` → Full Django admin
* Dashboard access to all blockchain data

### Regular User

* Register at `/register/`
* Login and view account page
* Request admin privileges if needed

---

## 🧩 Common Management Tasks

### Create Users (Admin)

* `/admin/` → Users → Add user
* Grant **Staff** or **Superuser** status

### View Blockchain Data

* Dashboard sections for nodes, shards, transactions, consensus, storage

### Backup & Restore

```bash
# Backup
python manage.py dumpdata > backup.json

# Restore
python manage.py loaddata backup.json
```

---

## 🧪 Useful Django Commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py shell
python manage.py check
```

---

## 🐞 Troubleshooting

| Issue                       | Fix                                      |
| --------------------------- | ---------------------------------------- |
| Database connection refused | Check MySQL service & `.env` credentials |
| 404 Page                    | Ensure server is running & correct URL   |
| CSRF failed                 | Clear cookies / enable cookies           |
| Permission denied           | Login as admin or request privileges     |
| Email already registered    | Use different email or reset password    |

---

## 📁 Important Files

| File               | Purpose                        |
| ------------------ | ------------------------------ |
| `manage.py`        | Django management entry point  |
| `requirements.txt` | Dependencies                   |
| `QUICKSTART.md`    | Detailed setup & usage guide   |

---

## 🌐 Port Configuration

```bash
python manage.py runserver 0.0.0.0:8080
```

---

## 🚀 Next Steps

* Create test users
* Populate blockchain data
* Test role restrictions
* Deploy to production

---

## 📚 References

* Django Documentation
* Django Admin Panel for full model control

---

## 🏷 Version

**Version:** 1.0
**Last Updated:** Feb 2026
