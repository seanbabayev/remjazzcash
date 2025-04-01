# Vopy Architecture Documentation

## System Overview

Vopy is a modern payment platform built with Next.js 14, focusing on secure, real-time money transfers across borders. The application follows a client-server architecture with server-side rendering (SSR) and client-side interactivity.

## Core Components

### 1. Authentication System
- **Technology**: NextAuth.js with Google OAuth
- **Implementation**: 
  - JWT-based sessions
  - Server-side session validation
  - Protected API routes and pages
  - Custom login page with branded UI

### 2. Database Schema
```prisma
// Key Models
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  settings      Settings?
  contacts      Contact[]
  favourites    Favourite[]
  transactions  Transaction[]
}

model Contact {
  id          String   @id @default(cuid())
  name        String
  phoneNumber String
  image       String?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  isDefault   Boolean  @default(false)
}

model Settings {
  id            String  @id @default(cuid())
  userId        String  @unique
  notifications Boolean @default(true)
  language      String  @default("sv")
  user          User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Favourite {
  id        String   @id @default(cuid())
  contactId String
  userId    String
  contact   Contact  @relation(fields: [contactId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model Transaction {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount            Float
  currency          String
  status            String
  recipientId       String?
  recipientContact  Contact? @relation(fields: [recipientId], references: [id])
  terrapayId        String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  message           String?
  queuedAt          DateTime?
  processedAt       DateTime?
  errorMessage      String?
  retryCount        Int      @default(0)
}
```

### 3. API Structure
- **/api/auth/[...nextauth]** - Authentication endpoints
- **/api/favourites** - Favorite contacts management
- **/api/contacts/details** - Detailed contact information
- **/api/exchange-rate** - Currency conversion rates
- **/api/settings** - User settings
- **/api/payment/process** - Card payment processing
- **/api/payment/status** - Transaction status checking
- **/api/transactions** - Transaction history and management

### 4. Frontend Architecture
- **Layout**: Mobile-first, responsive design
- **State Management**: 
  - Server Components for static data
  - SWR for real-time updates
  - React Context for global state
- **Component Structure**:
  ```
  components/
  ├── auth/          # Authentication components
  ├── dashboard/     # Dashboard components
  │   └── PhoneInput # Phone input with country codes
  ├── payment/       # Payment processing components
  │   ├── CardForm   # Card input form (TerraPay iframe)
  │   └── StatusTracker # Transaction status tracking
  ├── shared/        # Reusable UI components
  │   └── TransferHeader  # Header with back navigation
  └── layout/        # Layout components
  ```

### 5. Transfer System
- **Features**:
  - Real-time currency conversion (EUR/PKR)
  - Minimum amount validation (€10)
  - Recipient information display
  - Message input for transfers
- **Implementation**:
  - Exchange rate API endpoint
  - Currency toggle functionality
  - Input validation with delay
  - Responsive error handling
- **UI Components**:
  - TransferHeader: Back navigation and title
  - Amount input with currency toggle
  - Recipient card with profile picture

## Integration Architecture

### 1. TerraPay Integration

TerraPay serves as our primary payment processing partner with two key functions:

#### Card Processing
- **Implementation**:
  - Iframe integration for secure card data collection
  - PCI-compliant card processing
  - Card validation and authorization
  - Transaction status updates
  
#### Remittance API
- **Implementation**:
  - API integration for international transfers
  - Currency conversion handling
  - Recipient validation
  - Compliance checks

#### Flow Diagram
```
User → Vopy Frontend → TerraPay Iframe → Card Processing → Transaction Status → Vopy Backend
```

### 2. Integrated Finance

Integrated Finance serves as our banking partner:

- **Collection Accounts**:
  - Receives funds from card payments
  - Manages settlement processing
  
- **Liquidity Accounts**:
  - Holds funds for outbound transactions
  - Ensures sufficient balance for transfers
  
- **Compliance**:
  - Handles regulatory requirements
  - Manages financial reporting

#### Flow Diagram
```
TerraPay → Integrated Finance Collection Account → Processing → Liquidity Account → TerraPay Remittance API
```

### 3. 1link Integration

1link provides recipient information validation for Pakistani accounts:

- **Recipient Validation**:
  - Verifies recipient account details
  - Provides recipient information based on phone number or account ID
  - Validates account status and availability
  
- **Banking System Integration**:
  - Connects with Pakistani banking infrastructure
  - Ensures valid destination accounts
  - Provides necessary recipient details for compliant transfers

#### Flow Diagram
```
User Input (Recipient Phone/ID) → Vopy Backend → 1link API → Recipient Information → Transaction Processing
```

### 4. Transaction Processing Flow

#### Card Payment Flow
1. User logs in and initiates a payment
2. Vopy backend verifies sender information
3. Recipient information is retrieved via 1link
4. TerraPay iframe is presented for card details entry
5. Card is processed via TerraPay (Rapyd)
6. Transaction ID is stored and status tracked
7. Based on status (success/failure), transaction is either queued for outbound processing or marked as failed

#### Outbound Transaction Flow
1. Successful card transactions are moved to TerraPay's remittance API
2. Vopy creates necessary accounts in Integrated Finance
3. Funds are collected from TerraPay to Integrated Finance collection account
4. Funds are moved through various account stages for compliance and processing
5. Final transfer is initiated to TerraPay with payment details (including recipient information from 1link)
6. Transaction status is confirmed and updated

#### Payment Queue Management
1. Transactions are logged and queued in FIFO order
2. Queue processor handles transactions sequentially
3. Completed transactions are cleared from the queue
4. Failed transactions are logged and potentially retried
5. System ensures sufficient liquidity before processing

## Security Considerations

### 1. Data Protection
- **Card Data**: Never stored on Vopy servers, handled exclusively by TerraPay
- **Personal Information**: Encrypted at rest and in transit
- **Transactions**: Secured with unique identifiers and authentication

### 2. API Security
- **Authentication**: All API endpoints secured with JWT
- **Rate Limiting**: Prevents abuse and brute force attacks
- **Input Validation**: Sanitizes all user inputs

### 3. Infrastructure Security
- **HTTPS**: All communications encrypted
- **Database**: Secured with strong authentication
- **Environment Variables**: Sensitive information stored securely

## Performance Optimization

### 1. Frontend Performance
- **Code Splitting**: Reduces initial load time
- **Image Optimization**: Next.js image optimization
- **Caching**: SWR for efficient data fetching

### 2. Backend Performance
- **API Optimization**: Efficient endpoint design
- **Serverless Functions**: Scales automatically

### 3. Database Optimization
- **Indexed fields**: For faster queries
- **Efficient queries**: Optimized database access
- **Connection pooling**: Reuses database connections
- **Cascade deletions**: Maintains data integrity

## Monitoring and Logging

### 1. Transaction Monitoring
- Real-time transaction status tracking
- Error detection and alerting
- Performance metrics collection

### 2. System Logging
- API request/response logging
- Error logging with context
- User activity tracking for security

## Future Enhancements

### 1. Planned Technical Improvements
- Enhanced error handling and recovery
- Improved transaction monitoring
- Expanded API capabilities

### 2. Scalability Considerations
- Horizontal scaling for increased load
- Database sharding for large user bases
- Caching strategies for improved performance