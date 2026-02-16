# Deployment - SiswaPresensi

## Dokumen Kontrol | Informasi Dokumen
| | |
--- | --- |
**Judul** | Deployment SiswaPresensi |
**Tanggal** | 16 Februari 2026 |
**Status** | Draft |
**Versi** | 1.0 |
**Dipersiapkan untuk**| SiswaPresensi Project |
**Penulis** | DevOps Engineer |

---

## 1. Tujuan Dokumen

Dokumen ini mendefinisikan strategi deployment untuk SiswaPresensi, mencakup environment setup, deployment process, dan monitoring.

---

## 2. Deployment Architecture

### 2.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   GitHub    │ -> │  CI/CD      │ -> │  Staging    │       │
│  │  Actions    │    │  Pipeline   │    │  Server     │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│         │                  │                  │                │
│         │                  │                  v                │
│         │                  │            ┌─────────────┐       │
│         │                  │            │   VPS       │       │
│         │                  │            │  (Digital   │       │
│         │                  │            │   Ocean)    │       │
│         │                  │            └─────────────┘       │
│         │                  │                  │                │
│         │                  └──────────────────┘                │
│         │                                           │         │
│         v                                           v         │
│  ┌─────────────┐                            ┌─────────────┐   │
│  │ Production  │                            │  Database   │   │
│  │   Server    │ <-------------------------- │  (MySQL)   │   │
│  │  (VPS)      │                            └─────────────┘   │
│  └─────────────┘                                                 │
│         │                                                           │
│         v                                                           │
│  ┌─────────────┐                                                    │
│  │  Monitoring │                                                    │
│  │  (Grafana)  │                                                    │
│  └─────────────┘                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Environment Setup

### 3.1 Development Environment

**Requirements:**
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+ or PostgreSQL 14+
- Composer 2.x
- NPM 9.x

**Setup Commands:**

```bash
# Clone repository
git clone https://github.com/muhfauziazhar/siswapresensi.git
cd siswapresensi

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database
mysql -u root -p
CREATE DATABASE siswapresensi_dev;
EXIT;

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start development server
php artisan serve
npm run dev
```

### 3.2 Staging Environment

**Server Specifications:**
- OS: Ubuntu 22.04 LTS
- CPU: 2 vCPU
- RAM: 4 GB
- Storage: 40 GB SSD
- Provider: DigitalOcean / Digital Ocean

**Setup Commands:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-bcmath php8.2-intl php8.2-gd php8.2-json -y

# Install Nginx
sudo apt install nginx -y

# Install MySQL
sudo apt install mysql-server -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Clone repository
cd /var/www
sudo git clone https://github.com/muhfauziazhar/siswapresensi.git
cd siswapresensi

# Set permissions
sudo chown -R www-data:www-data /var/www/siswapresensi
sudo chmod -R 755 /var/www/siswapresensi/storage

# Install dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Copy environment file
sudo cp .env.example .env
sudo nano .env  # Edit environment variables

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Configure Nginx
sudo nano /etc/nginx/sites-available/siswapresensi-staging

# Enable site
sudo ln -s /etc/nginx/sites-available/siswapresensi-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configure SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d staging.siswapresensi.com
```

### 3.3 Production Environment

**Server Specifications:**
- OS: Ubuntu 22.04 LTS
- CPU: 4 vCPU
- RAM: 8 GB
- Storage: 80 GB SSD
- Provider: DigitalOcean / Digital Ocean

**Setup Commands:**

```bash
# Follow same setup as staging, but with production-specific settings:

# Use production environment
APP_ENV=production
APP_DEBUG=false

# Use strong secret key
php artisan key:generate

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set up queue worker
sudo nano /etc/systemd/system/siswapresensi-queue.service

# Enable queue worker
sudo systemctl enable siswapresensi-queue
sudo systemctl start siswapresensi-queue

# Set up scheduler
sudo crontab -e
# Add: * * * * * cd /var/www/siswapresensi && php artisan schedule:run >> /dev/null 2>&1
```

---

## 4. Nginx Configuration

### 4.1 Staging Configuration

```nginx
# /etc/nginx/sites-available/siswapresensi-staging
server {
    listen 80;
    server_name staging.siswapresensi.com;

    root /var/www/siswapresensi/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri_rewrite /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_intercept_errors on;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    access_log /var/log/nginx/siswapresensi-staging-access.log;
    error_log /var/log/nginx/siswapresensi-staging-error.log;
}
```

### 4.2 Production Configuration

```nginx
# /etc/nginx/sites-available/siswapresensi
server {
    listen 443 ssl http2;
    server_name siswapresensi.com;

    root /var/www/siswapresensi/public;

    ssl_certificate /etc/letsencrypt/live/siswapresensi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siswapresensi.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri_rewrite /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_intercept_errors on;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    access_log /var/log/nginx/siswapresensi-access.log;
    error_log /var/log/nginx/siswapresensi-error.log;
}

server {
    listen 80;
    server_name siswapresensi.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 5. Deployment Process

### 5.1 Automated Deployment (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.siswapresensi.com
    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Install Dependencies
        run: composer install --prefer-dist --no-progress --no-suggest

      - name: Run Tests
        run: php artisan test

      - name: Deploy to Staging
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /var/www/siswapresensi
            git pull origin main
            composer install --no-dev --optimize-autoloader
            npm install
            npm run build
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo systemctl reload php8.2-fpm
            sudo systemctl reload nginx

      - name: Run Smoke Tests
        run: npm run test:smoke

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production
      url: https://siswapresensi.com
    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Install Dependencies
        run: composer install --prefer-dist --no-progress --no-suggest

      - name: Run Tests
        run: php artisan test

      - name: Create Backup
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /var/www/siswapresensi
            php artisan backup:run

      - name: Deploy to Production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /var/www/siswapresensi
            git pull origin main
            composer install --no-dev --optimize-autoloader
            npm install
            npm run build
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo systemctl reload php8.2-fpm
            sudo systemctl reload nginx

      - name: Run Smoke Tests
        run: npm run test:smoke

      - name: Notify Team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 5.2 Manual Deployment

```bash
# Deploy to Staging
ssh user@staging.siswapresensi.com
cd /var/www/siswapresensi
git pull origin develop
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx

# Deploy to Production
ssh user@siswapresensi.com
cd /var/www/siswapresensi
php artisan backup:run
git pull origin main
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx
```

---

## 6. Environment Variables

### 6.1 Staging Environment

```env
# .env.staging
APP_NAME=SiswaPresensi
APP_ENV=staging
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=https://staging.siswapresensi.com

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=siswapresensi_staging
DB_USERNAME=staging_user
DB_PASSWORD=staging_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=staging@siswapresensi.com
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 6.2 Production Environment

```env
# .env.production
APP_NAME=SiswaPresensi
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://siswapresensi.com

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=siswapresensi_production
DB_USERNAME=production_user
DB_PASSWORD=production_password

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=s3
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@siswapresensi.com
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=siswapresensi-uploads
AWS_URL=https://siswapresensi-uploads.s3.amazonaws.com

VITE_APP_NAME="${APP_NAME}"
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

---

## 7. Database Management

### 7.1 Database Backup

```bash
# Manual backup
mysqldump -u production_user -p siswapresensi_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup (cron)
0 2 * * * mysqldump -u production_user -p'password' siswapresensi_production | gzip > /backups/siswapresensi_$(date +\%Y\%m\%d).sql.gz

# Laravel backup
php artisan backup:run
```

### 7.2 Database Restore

```bash
# Restore from backup
mysql -u production_user -p siswapresensi_production < backup_20240216_020000.sql

# Restore from compressed backup
gunzip < /backups/siswapresensi_20240216.sql.gz | mysql -u production_user -p siswapresensi_production
```

---

## 8. Monitoring & Logging

### 8.1 Application Monitoring

```bash
# Install Laravel Telescope
composer require laravel/telescope

# Publish Telescope config
php artisan telescope:install

# Enable Telescope
# config/telescope.php
'enabled' => env('TELESCOPE_ENABLED', true),
```

### 8.2 Log Management

```bash
# View application logs
tail -f /var/www/siswapresensi/storage/logs/laravel.log

# View Nginx access logs
tail -f /var/log/nginx/siswapresensi-access.log

# View Nginx error logs
tail -f /var/log/nginx/siswapresensi-error.log

# Rotate logs
sudo logrotate -f /etc/logrotate.conf
```

### 8.3 Performance Monitoring

```bash
# Install Laravel Debugbar (development only)
composer require barryvdh/laravel-debugbar --dev

# Install Laravel Horizon (queue monitoring)
composer require laravel/horizon

# Install Laravel Octane (performance)
composer require laravel/octane
```

---

## 9. Security Hardening

### 9.1 Server Security

```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Configure fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 9.2 Application Security

```bash
# Set proper file permissions
sudo chown -R www-data:www-data /var/www/siswapresensi
sudo chmod -R 755 /var/www/siswapresensi
sudo chmod -R 775 /var/www/siswapresensi/storage
sudo chmod -R 775 /var/www/siswapresensi/bootstrap/cache

# Disable debug mode in production
APP_DEBUG=false

# Use HTTPS only
# Configure SSL certificate with Let's Encrypt
sudo certbot --nginx -d siswapresensi.com
```

---

## 10. Troubleshooting

### 10.1 Common Issues

**Issue:** 502 Bad Gateway
**Solution:** Check PHP-FPM status and restart

```bash
sudo systemctl status php8.2-fpm
sudo systemctl restart php8.2-fpm
```

**Issue:** Database connection failed
**Solution:** Check MySQL status and credentials

```bash
sudo systemctl status mysql
sudo nano /var/www/siswapresensi/.env
```

**Issue:** Permission denied
**Solution:** Set proper file permissions

```bash
sudo chown -R www-data:www-data /var/www/siswapresensi
sudo chmod -R775 /var/www/siswapresensi/storage
```

**Issue:** Queue jobs not processing
**Solution:** Check queue worker status

```bash
sudo systemctl status siswapresensi-queue
sudo systemctl restart siswapresensi-queue
```

---

## 11. Rollback Plan

### 11.1 Database Rollback

```bash
# Restore database from backup
mysql -u production_user -p siswapresensi_production < backup_20240216_020000.sql
```

### 11.2 Application Rollback

```bash
# Rollback to previous commit
cd /var/www/siswapresensi
git log --oneline -10
git checkout <previous-commit-hash>
composer install --no-dev --optimize-autoloader
npm install
npm run build
php artisan migrate:rollback --step=1
sudo systemctl reload php8.2-fpm
sudo systemctl reload nginx
```

---

## 12. Maintenance

### 12.1 Regular Maintenance Tasks

```bash
# Weekly
- Update dependencies (composer update, npm update)
- Review and apply security patches
- Check disk space
- Review logs for errors

# Monthly
- Database optimization
- Cache cleanup
- Backup verification
- Performance review

# Quarterly
- Security audit
- Performance audit
- Capacity planning
- Disaster recovery testing
```

### 12.2 Maintenance Commands

```bash
# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Clear application cache
php artisan cache:clear

# Optimize database
php artisan db:optimize

# Clear old logs
find /var/www/siswapresensi/storage/logs -name "*.log" -mtime +30 -delete

# Clear old backups
find /backups -name "*.sql.gz" -mtime +90 -delete
```

---

## Dokumentasi Terkait
- [Tech Stack](./0401-tech-stack.md)
- [Architecture](./0402-architecture.md)
- [API Contract](./0403-api-contract.md)
- [Data Model](./0404-data-model.md)
- [Coding Standards](./0405-coding-standards.md)
- [Git Workflow](./0406-git-workflow.md)
