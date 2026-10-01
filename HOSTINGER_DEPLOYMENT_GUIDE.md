# 🚀 Thyaga Mall — Hostinger hPanel Deployment Guide

This guide explains how to host the complete **Thyaga Mall** application (Next.js Frontend + Laravel 12 Backend + MySQL Database) on **Hostinger hPanel** under the URL:
👉 **`https://ai.loopsintegrated.co/ThyagaMall`**

---

## 📦 What Was Prepared For You

A ready-to-deploy, self-contained package has already been built and compiled:

1. **Deployment Archive**: `ThyagaMall_Hostinger_Deploy.zip` (26 MB)
   - Contains all **437 static & dynamic Next.js storefront & admin pages** pre-rendered with `basePath: '/ThyagaMall'` and API pointing to `https://ai.loopsintegrated.co/ThyagaMall/api`.
   - Contains the complete **Laravel 12 REST API** with all Composer `vendor/` dependencies pre-installed (no SSH/Composer required on Hostinger).
   - Contains custom **LiteSpeed / Apache `.htaccess`** rules to route API calls to Laravel and storefront routes to Next.js.
2. **Database SQL Dump**: `database_dump/thyaga_mall_db.sql` (and inside `database_sql/thyaga_mall_db.sql`)
   - 406 real products, categories, vouchers, and admin credentials.

---

## 🛠️ Step-by-Step Deployment Instructions

### Step 1: Create the MySQL Database in hPanel

1. Log into your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. In the left sidebar or dashboard, click **Databases** ➔ **MySQL Databases**.
3. Under **Create a New MySQL Database and Database User**:
   - **Database Name**: e.g., `thyaga_mall` (full name will look like `u123456789_thyaga_mall`)
   - **Username**: e.g., `thyaga_user` (full name will look like `u123456789_thyaga_user`)
   - **Password**: Enter a strong password (copy it down).
4. Click **Create**.
5. Once created, scroll down to **Current Databases**, find the new database, and click **Enter phpMyAdmin**.
6. Inside phpMyAdmin:
   - Select your newly created database on the left.
   - Click the **Import** tab at the top.
   - Click **Choose File** and select `database_dump/thyaga_mall_db.sql` from this project.
   - Click **Go** / **Import** at the bottom.
   - All 406 products, categories, admins, and tables are now imported!

---

### Step 2: Upload Files in Hostinger File Manager

1. In hPanel, go to **Websites** ➔ click **Manage** next to `ai.loopsintegrated.co`.
2. Under **Files**, click **File Manager** (Access files of `ai.loopsintegrated.co`).
3. Double-click to open `public_html/`.
4. Open the `ThyagaMall/` folder (create the folder `ThyagaMall` if it doesn't already exist).
5. Click the **Upload** icon (top right) ➔ select **File** ➔ choose `ThyagaMall_Hostinger_Deploy.zip`.
6. Once uploaded, right-click `ThyagaMall_Hostinger_Deploy.zip` and select **Extract**.
   - Extract destination: `.` or `/public_html/ThyagaMall`
7. After extraction, you will see:
   ```text
   public_html/ThyagaMall/
   ├── .htaccess
   ├── index.html
   ├── shop/
   ├── product/
   ├── thyaga-portal-admin/
   ├── _next/
   ├── backend/
   │   ├── .env
   │   ├── app/
   │   ├── bootstrap/
   │   ├── config/
   │   ├── public/
   │   ├── storage/
   │   └── vendor/
   └── ...
   ```
8. (Optional) You can delete `ThyagaMall_Hostinger_Deploy.zip` from the server to save disk space.

---

### Step 3: Configure Database Credentials in `backend/.env`

1. Inside File Manager, navigate to `public_html/ThyagaMall/backend/`.
2. Find the `.env` file (if hidden, toggle "Show Hidden Files" in File Manager settings gear icon).
3. Right-click `.env` and click **Edit**.
4. Update the DB credentials with the database you created in Step 1:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=u123456789_thyaga_mall
   DB_USERNAME=u123456789_thyaga_user
   DB_PASSWORD=YOUR_STRONG_PASSWORD
   ```
5. Click **Save**.

---

### Step 4: Verify Folder Permissions

In Hostinger File Manager:
- Make sure `backend/storage` and all its subfolders are writable (`775` or `755`).
- Make sure `backend/bootstrap/cache` is writable (`775` or `755`).
*(Hostinger defaults are usually 755 which work out of the box).*

---

### Step 5: Test Your Live Deployment!

Open your browser and test:

1. **API Health & DB Connection**:
   👉 `https://ai.loopsintegrated.co/ThyagaMall/api/health`
   - Expected response: `{"status":"ok","database":"connected"}`

2. **API Status**:
   👉 `https://ai.loopsintegrated.co/ThyagaMall/api`
   - Expected response: `{"status":"online","app":"Thyaga Mall API","version":"1.0.0",...}`

3. **Storefront**:
   👉 `https://ai.loopsintegrated.co/ThyagaMall`

4. **Product Catalog**:
   👉 `https://ai.loopsintegrated.co/ThyagaMall/shop`

5. **Flash Deals Arena**:
   👉 `https://ai.loopsintegrated.co/ThyagaMall/flash-deals`

6. **Admin Portal**:
   👉 `https://ai.loopsintegrated.co/ThyagaMall/thyaga-portal-admin/login`
   - **Admin Email**: `admin@thyaga.lk`
   - **Password**: `password123`

---

## 🔄 How to Re-package If You Make Changes

Whenever you modify frontend or backend code locally, simply run:
```bash
./scripts/build_hostinger_package.sh
```
This automatically compiles the frontend with the `/ThyagaMall` base path, packages the Laravel backend, and regenerates `ThyagaMall_Hostinger_Deploy.zip`.
