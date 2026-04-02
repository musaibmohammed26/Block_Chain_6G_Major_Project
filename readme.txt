Here’s your **same content**, rewritten into the **clean, academic + professional format** like the example you showed — with better structure, visual hierarchy, and GitHub-friendly layout.

You can paste this directly as your `README.md`.

---

# 🚀 6G Blockchain System — Management Dashboard (Django + Channels)

<p align="center">
  <b>Role-based blockchain administration platform with real-time ready architecture using Django, MySQL, and WebSockets.</b>
</p>

---

## 🧱 Tech Stack

| Layer    | Technology                                |
| -------- | ----------------------------------------- |
| Backend  | Django 4.2                                |
| Database | MySQL / MariaDB                           |
| Realtime | Django Channels + Redis                   |
| UI       | Bootstrap 5 + Crispy Forms + Font Awesome |
| Config   | python-decouple (.env support)            |

---

## ✨ What This System Does

The **6G Blockchain System** is a multi-user platform that allows administrators to manage and monitor blockchain entities such as nodes, shards, transactions, consensus rounds, storage, and reputation through a secure web dashboard with **role-based access control**.

Designed for blockchain simulation, research, and administrative control.

---

## 👥 User Roles

| Role             | Permissions                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| **Admin User**   | Full dashboard access, Django admin panel, manage all blockchain models |
| **Regular User** | Registration, login, restricted account page                            |

---

## 🖥️ Dashboard Capabilities

Admins can manage:

* Nodes
* Shards
* Transactions
* Consensus rounds
* Storage records
* Reputation history

Modern **black & green responsive UI** built with Bootstrap 5.

---

## ⚡ Real-Time Ready Architecture

Integrated with **Django Channels** and **Redis** to support future real-time blockchain events and live dashboard updates.

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
* Redis Server (required for Channels)

---

## ⚙️ Setup Instructions

### Step 1 — Activate Virtual Environment

```bash
# Windows
bl6genv\Scripts\activate

# Linux / Mac
source bl6genv/bin/activate
```

### Step 2 — Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3 — Configure Environment Variables

Create a `.env` file in the root directory:

```
DB_NAME=6g_blockchain
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
```

### Step 4 — Apply Migrations

```bash
python manage.py migrate
```

### Step 5 — Create Admin (Superuser)

```bash
python manage.py createsuperuser
```

### Step 6 — Run Server

```bash
python manage.py runserver
```

Open in browser:

```
http://127.0.0.1:8000
```

---

## 🔐 Access Guide

### Admin Access

* `/admin/` → Django Admin panel
* Full dashboard access to blockchain data

### Regular User Access

* Register at `/register/`
* Login to view account page
* Can request admin privileges

---

## 🧩 Common Management Tasks

### Create Users (Admin)

* Go to `/admin/` → Users → Add user
* Assign **Staff** or **Superuser** status

### View Blockchain Data

* Use dashboard sections for nodes, shards, transactions, consensus, and storage

### Backup & Restore Database

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

| Issue                       | Fix                                         |
| --------------------------- | ------------------------------------------- |
| Database connection refused | Check MySQL service and `.env` credentials  |
| 404 Page                    | Ensure server is running and URL is correct |
| CSRF failed                 | Clear browser cookies / enable cookies      |
| Permission denied           | Login as admin or request privileges        |
| Email already registered    | Use different email or reset password       |

---

## 📁 Important Files

| File               | Purpose                        |
| ------------------ | ------------------------------ |
| `manage.py`        | Django management entry point  |
| `requirements.txt` | Project dependencies           |
| `QUICKSTART.md`    | Detailed setup and usage guide |

---

## 🌐 Custom Port Configuration

```bash
python manage.py runserver 0.0.0.0:8080
```

---

## 🚀 Next Steps

* Create test users
* Populate blockchain data
* Test role restrictions
* Deploy to production server

---

## 📚 References

* Django Documentation
* Django Admin Panel for model management

---

## 🏷 Version

**Version:** 1.0
**Last Updated:** Feb 2026
