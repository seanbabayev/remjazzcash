# RemEasypaisa - Global Payment Platform

A modern, secure payment platform that enables seamless global money transfers.

## 🚀 Features

- **Secure Authentication**: Google OAuth integration with NextAuth
- **Dashboard**: Modern, responsive interface for managing transfers
- **Contact Management**: 
  - Easy management of transfer recipients
  - Add favorite contacts with profile pictures
  - Default contacts for new users
  - Phone number validation with country codes
  - Duplicate contact prevention
  - Symmetrical contact grid layout
  - System-wide default contacts
- **Payment Processing**:
  - Secure card payment via TerraPay iframe
  - Real-time transaction status updates
  - Multi-currency support
  - Transaction queuing system
- **Remittance Capabilities**:
  - International money transfers
  - Currency conversion
  - Recipient validation
- **Real-time Updates**: Live transaction status and notifications
- **Multi-language Support**: Built-in internationalization
- **Mobile-First Design**: Optimized for all devices

## 🛠 Tech Stack

- **Framework**: Next.js 14.0.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth with Google Sign-In
- **Payment Processing**: TerraPay integration
- **Banking Partner**: Integrated Finance
- **State Management**: Server Components + Client Hooks
- **Data Fetching**: SWR for real-time updates
- **File Storage**: Local storage with plans for AWS S3 integration

## 📦 Project Structure

```
/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── favourites/   # Favorites management
│   │   └── payment/      # Payment processing endpoints
│   ├── dashboard/        # Dashboard pages
│   ├── add-favourite/    # Add favorite contact page
│   ├── login/           # Authentication pages
│   ├── transfer/        # Transfer flow pages
│   └── providers.tsx    # Global providers
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── payment/        # Payment processing components
│   └── PhoneInput/     # Phone input with country codes
├── lib/                # Utility functions and configurations
│   ├── auth.ts        # NextAuth configuration
│   ├── terrapay.ts    # TerraPay API integration
│   └── prisma.ts      # Database client
├── prisma/            # Database schema and migrations
│   ├── migrations/    # Database migrations
│   ├── schema.prisma  # Database schema
│   └── seed.ts       # Seed script for default data
└── public/           # Static assets
    └── img/         # Images and icons
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```
   DATABASE_URL="postgresql://..."
   GOOGLE_ID="your-google-client-id"
   GOOGLE_SECRET="your-google-client-secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   TERRAPAY_API_KEY="your-terrapay-api-key"
   TERRAPAY_SECRET="your-terrapay-secret"
   TERRAPAY_ENDPOINT="terrapay-api-endpoint"
   ```
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Core Functionality

### Authentication
- Google OAuth integration
- Secure session management with JWT
- Protected API routes and pages

### Contact Management
- Add contacts as favorites
- Upload contact profile pictures
- Default contacts for new users
- Phone number validation with country codes (+46 for Sweden)
- Prevent duplicate contacts

### Payment Processing
- Secure card payment processing via TerraPay
- Transaction status tracking
- Payment queue management
- Error handling and retries

### Database Schema
- User model with OAuth integration
- Contact model with favorite status
- Transaction model for payment tracking

## 🔄 Integration Architecture

The application integrates with several external services:

### TerraPay
- Provides secure iframe for card data collection
- Handles card processing (powered by Rapyd)
- Processes international remittances
- Manages compliance checks

### Integrated Finance
- Banking partner for fund collection
- Manages settlement processing
- Provides liquidity accounts

### 1link
- Provides recipient information validation
- Verifies Pakistani account details
- Enables lookup of recipient data based on phone number
- Connects with Pakistani banking infrastructure

For a concise overview of the system architecture and integration flow, see [SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md).

For detailed technical information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🔜 Upcoming Features

- AWS S3 integration for profile pictures
- Transaction history
- Real-time notifications
- Multi-currency support
- Enhanced security features

## 📄 License

Private - All rights reserved
