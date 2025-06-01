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

- [Prerequisites](#-prerequisites)
- [Development](#-development)
- [Production](#-production)
- [API Documentation](#-api-documentation)
- [Infrastructure](#-infrastructure)

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

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will:
   - Start the API server
   - Create/Launch a PostgreSQL database in Docker
   - Start an SMTP development server for email testing
   
   The API will be available at `http://localhost:3000`

6. **Run database migrations:**

   ```bash
   npm run prisma:migrate
   ```

   This will create and apply the database schema.

## 🏗️ Production

To deploy the application:

1. Build the infrastructure stack using [project-wotd-infra](https://github.com/ezratweaver/project-wotd-infra)
2. Build and package the application:

   ```bash
   npm run build:eb
   ```

3. Upload the generated zip file to your Elastic Beanstalk environment

Database migrations will be automatically applied during deployment.

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/documentation
```
