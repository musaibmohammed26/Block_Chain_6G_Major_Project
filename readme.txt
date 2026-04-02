## 👥 Team

| Name                    | Roll No      |
| ----------------------- | ------------ |
| Mohammad Musaib         | 160922748157 |
| Omer Farooque           | 160922748135 |
| Muhaimin Akhtar Shareef | 160922748139 |

**Project Guide:** Ms. Aradhana, Assistant Professor

**Co-Guide / HoD:** Dr. Abdul Rasool Mohammed, Associate Professor & Head of Department

**Institution:** Lords Institute of Engineering and Technology

🚀 6G Blockchain System — Management Dashboard (Django + Channels)

A role-based blockchain administration platform with real-time ready architecture using Django, MySQL, and WebSockets.

---

🧱 Tech Stack

Backend: Django 4.2
Database: MySQL / MariaDB
Realtime: Django Channels + Redis
UI: Bootstrap 5, Crispy Forms, Font Awesome
Configuration: python-decouple with .env support

---

✨ What This System Does

The 6G Blockchain System is a multi-user platform that allows administrators to manage and monitor blockchain entities such as nodes, shards, transactions, consensus rounds, storage, and reputation through a secure web dashboard with role-based access control.

This system is designed for blockchain simulation, research, and administrative control.

---

👥 User Roles

Admin User
• Full dashboard access
• Django admin panel access
• Can manage all blockchain models

Regular User
• Registration and login
• Access to restricted account page

---

🖥️ Dashboard Capabilities

Administrators can manage the following blockchain entities:

• Nodes
• Shards
• Transactions
• Consensus rounds
• Storage records
• Reputation history

The interface uses a modern black and green responsive theme built with Bootstrap 5.

---

⚡ Real-Time Ready Architecture

The system is integrated with Django Channels and Redis to support real-time blockchain events and future live dashboard updates.

---

📦 Requirements

Django 4.2.7
mysqlclient 2.2.8 or higher
django-crispy-forms 2.0
crispy-bootstrap5 0.7
channels 4.0.0
channels-redis 4.1.0
python-decouple 3.8
requests 2.31.0

---

🛠 Prerequisites

Python 3.8 or higher
MySQL 5.7+ or MariaDB
Redis server for Channels

---

⚙️ Setup Instructions

1. Activate the virtual environment.
2. Install the project dependencies from requirements.txt.
3. Create a .env file in the project root and configure database credentials.
4. Apply database migrations.
5. Create a Django superuser for admin access.
6. Start the development server and open the project in a browser.

The application runs locally on [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

🔐 Access Guide

Admin Access
• Visit /admin for the Django admin panel
• Access full dashboard and blockchain data management

Regular User Access
• Register using /register
• Login to access the user account page
• Can request admin privileges if required

---

🧩 Common Management Tasks

Creating Users
Admins can create users from the Django admin panel and assign staff or superuser permissions.

Viewing Blockchain Data
All blockchain entities can be managed through the dashboard sections.

Backup and Restore
Database backups and restores can be performed using Django’s dumpdata and loaddata commands.

---

🧪 Useful Django Commands

makemigrations
migrate
createsuperuser
shell
check

---

🐞 Troubleshooting

Database connection refused — Verify MySQL service and .env credentials
404 Page — Ensure the server is running and the correct URL is used
CSRF failed — Clear browser cookies or enable cookies
Permission denied — Login as admin or request privileges
Email already registered — Use a different email or reset password

---

📁 Important Files

manage.py — Django management entry point
requirements.txt — Project dependencies
QUICKSTART.md — Detailed setup and usage guide

---

🌐 Custom Port Configuration

The server can be started on a custom port if required.

---

🚀 Next Steps

Create test users
Populate blockchain data
Test role-based restrictions
Deploy the system to a production server

---

📚 References

Django documentation
Django admin panel for full model management

---

🏷 Version

Version 1.0
Last Updated: Feb 2026
