<div align="center">

# Project WOTD Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

</div>

<div align="center">

A robust backend API service built with Fastify, TypeScript, and PostgreSQL. This service provides the necessary APIs for the [project-wotd-mobile](https://github.com/ezratweaver/project-wotd-mobile) application.

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Development](#-development)
- [Building for Production](#%EF%B8%8F-building-for-production)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)

## 🚀 Features

- 🎯 **Core Features**
  - Complete CRUD operations for users to organize words
  - RESTful API with Swagger documentation
  - PostgreSQL database with Prisma ORM
  - TypeScript for type safety
  - JWT-based authentication
  - Email OTP verification
  - Environment-based configuration
  - Type-safe API with Zod validation

- 🔌 **Integrations**
  - AWS S3 for file storage
  - AWS Polly for text-to-speech
  - Email notifications using Nodemailer
  - MJML for beautiful, responsive email templates

- 🛠️ **Development Tools**
  - Automatic development environment with Docker and SMTP4DEV

## 📋 Prerequisites

- Linux/WSL 2
- Node.js LTS 22 (v22.x)
- PostgreSQL
- Docker (optional, for development)
- AWS Account (for S3 and Polly services)

## 🔧 Development

1. **Install and setup NVM (Node Version Manager):**
   ```bash
   # For Arch Linux (using yay)
   yay -S nvm

   # For Ubuntu/Debian
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

   # For other Linux distributions, check your package manager or use the curl method above
   
   # Restart your terminal or source your shell config
   source ~/.bashrc  # or source ~/.zshrc or source ~/.config/fish/config.fish
   
   # Install and use Node.js 22
   nvm install 22
   nvm use 22
   ```

2. **Clone the repository:**
   ```bash
   git clone https://github.com/ezratweaver/project-wotd-backend
   cd project-wotd-backend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp example.env .env
   ```
   Edit the `.env` file with your configuration values.

5. **Set up the database:**
   ```bash
   npm run prisma:migrate
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

## 🏗️ Building for Production

Before building for production, ensure you have:
1. An AWS account with Elastic Beanstalk configured
2. An IAM user with permissions for AWS Polly and S3
3. A production PostgreSQL database URL
4. A production SMTP server configured for Nodemailer
5. Updated environment variables for production

**Build and package for Elastic Beanstalk:**
```bash
npm run build:eb
```

This script will:
1. Build the TypeScript project
2. Create a static hash file with the current git commit hash
3. Create a zip file named with the commit hash, excluding node_modules and .env files

The resulting zip file will be created in the parent directory and is ready for Elastic Beanstalk deployment.

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/documentation
```

## 🔐 Environment Variables

Environment variables used in the application:

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Application name used in email templates and system identification |
| `COOKIE_SECRET_KEY` | Secret key used to sign and verify cookies for authentication |
| `JWT_SECRET_KEY` | Secret key used to sign and verify JWT tokens for user sessions |
| `DB_URL` | PostgreSQL connection string in the format: `postgresql://user:password@host:port/database?schema=public` |
| `AWS_REGION` | AWS region where S3 bucket and Polly service are located |
| `AWS_BUCKET_NAME` | S3 bucket name where AWS Polly-generated pronunciation files are stored |
| `NODEMAILER_FROM` | Email address that will appear as the sender for all system emails |
| `NODEMAILER_HOST` | SMTP server hostname for sending emails |
| `NODEMAILER_PORT` | SMTP server port number |
| `NODEMAILER_SECURE` | Whether to use TLS for SMTP connection (true/false) |
| `NODEMAILER_USERNAME` | SMTP server username for authentication |
| `NODEMAILER_PASSWORD` | SMTP server password for authentication |
| `OTP_LENGTH` | Length of One-Time Password codes sent for email verification (default: 16) |
| `ADMIN_PASSWORD` | Hashed password required for authentication to add a word of the day through the API |
| `API_PORT` | Port number for the API server (default: 3000) |
| `API_HOST` | Host address for the API server (default: 0.0.0.0) |
| `DB_DOCKER_IMAGE_NAME` | Name of the PostgreSQL Docker container for local development |
| `DB_PORT` | PostgreSQL port number for local development |
| `DB_PASSWORD` | PostgreSQL password for local development |
| `SMTP4DEV_WEB_PORT` | Port number for SMTP4DEV web interface in local development |
| `SMTP4DEV_SMTP_PORT` | Port number for SMTP4DEV SMTP server in local development |
| `SMTP4DEV_NAME` | Name of the SMTP4DEV Docker container for local development |

See `example.env` for example values. 