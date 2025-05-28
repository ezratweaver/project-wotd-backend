# Project WOTD Backend

A robust backend API service built with Fastify, TypeScript, and PostgreSQL. This service provides the necessary APIs for the [project-wotd-mobile](https://github.com/ezratweaver/project-wotd-mobile) application.

## 🚀 Features

- RESTful API with Swagger documentation
- JWT-based authentication
- Email OTP verification
- AWS S3 integration for file storage
- AWS Polly integration for text-to-speech
- PostgreSQL database with Prisma ORM
- Email notifications using Nodemailer
- TypeScript for type safety
- Environment-based configuration
- Automatic development environment with Docker and SMTP4DEV

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional, for development)
- AWS Account (for S3 and Polly services)

## 🔧 Development

1. Clone the repository:
```bash
git clone https://github.com/ezratweaver/project-wotd-backend
cd project-wotd-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp example.env .env
```
Edit the `.env` file with your configuration values.

4. Set up the database:
```bash
npm run prisma:migrate
```

5. Start the development server:
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

Build and package for Elastic Beanstalk:
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

Key environment variables required:

- `APP_NAME`: Application name
- `COOKIE_SECRET_KEY`: Secret key for cookies
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `DB_URL`: PostgreSQL connection string
- `AWS_REGION`: AWS region for S3 and Polly
- `AWS_BUCKET_NAME`: S3 bucket name where AWS Polly-generated pronunciation files are stored
- `NODEMAILER_*`: Email configuration

See `example.env` for all required variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 