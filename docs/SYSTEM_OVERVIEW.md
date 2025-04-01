# Remittance System Architecture

## System Overview

This document outlines the architecture and workflow of our remittance platform, detailing the roles of each component and service integration.

## Key Components

### 1. User Interface (Vopy Frontend)
- Provides the user-facing interface for remittance transactions
- Handles user authentication and session management
- Integrates with TerraPay's iframe for secure card data collection
- Displays transaction status and confirmation to users

### 2. TerraPay Integration
TerraPay serves as our primary payment processing partner with two main functions:

#### Card Processing
- Provides an iframe solution for secure card data collection
- Handles card validation and processing (powered by Rapyd in the background)
- Returns transaction status and tokens for saved cards
- Manages PCI compliance for card data handling

#### Remittance API
- Processes outbound transactions to destination countries
- Handles currency conversion
- Provides transaction status updates
- Manages compliance checks for international transfers

### 3. Integrated Finance
- Serves as our banking partner
- Maintains collection accounts for receiving funds
- Handles settlement processing
- Provides liquidity accounts for outbound transactions
- Manages regulatory compliance for financial transactions

### 4. Vopy Backend
- Orchestrates the entire transaction flow
- Verifies sender information
- Stores transaction records and logs
- Implements transaction queuing system
- Manages reconciliation between systems
- Handles error scenarios and transaction retries

### 5. Rapyd (via TerraPay)
- Provides the underlying card acquisition capabilities
- Processes settlements to our accounts
- Handles card scheme interactions

### 6. 1link Integration
- Provides recipient information validation
- Verifies recipient account details
- Enables lookup of recipient data based on phone number or account information
- Facilitates communication with Pakistani banking systems

## Transaction Workflows

### 1. Card Payment Acceptance
1. User logs in and initiates a payment
2. Vopy backend verifies sender information
3. Recipient information is retrieved via 1link
4. TerraPay iframe is presented for card details entry
5. Card is processed via TerraPay (Rapyd)
6. Transaction ID is stored and status tracked
7. Based on status (success/failure), transaction is either queued for outbound processing or marked as failed

### 2. Outbound Transaction Processing
1. Successful card transactions are moved to TerraPay's remittance API
2. Vopy creates necessary accounts in Integrated Finance
3. Funds are collected from TerraPay to Integrated Finance collection account
4. Funds are moved through various account stages for compliance and processing
5. Final transfer is initiated to TerraPay with payment details (including recipient information from 1link)
6. Transaction status is confirmed and updated

### 3. Payment Queue Management
1. Transactions are logged and queued in FIFO order
2. Queue processor handles transactions sequentially
3. Completed transactions are cleared from the queue
4. Failed transactions are logged and potentially retried
5. System ensures sufficient liquidity before processing

### 4. Settlement Processing
1. Settlements from Rapyd are received via webhooks
2. Settlement data is reconciled against transaction records
3. Funds are allocated to appropriate accounts
4. Reconciliation reports are generated
5. Any discrepancies are flagged for manual review

## System Interactions

### API Integrations
- TerraPay API: For card processing and remittance services
- Integrated Finance API: For account management and fund transfers
- 1link API: For recipient information validation
- Internal APIs: For transaction management and status tracking

### Data Flow
- Card data is handled exclusively within TerraPay's secure environment
- Recipient information is retrieved from 1link
- Transaction data is stored in our system with appropriate encryption
- Settlement data is reconciled against transaction records
- All financial movements are logged for audit purposes

### Security Considerations
- Card data never touches our servers (handled via TerraPay iframe)
- All API communications use secure protocols (TLS)
- Sensitive data is encrypted at rest and in transit
- Access to financial systems is strictly controlled

## Development Guidelines

When working with this system, developers should:
1. Never attempt to handle card data directly - always use TerraPay's iframe
2. Implement proper error handling for all API interactions
3. Ensure transaction states are properly tracked and updated
4. Follow the queue-based approach for processing outbound transactions
5. Implement comprehensive logging for troubleshooting
6. Handle reconciliation carefully to ensure financial accuracy
7. Properly validate and handle recipient information from 1link
