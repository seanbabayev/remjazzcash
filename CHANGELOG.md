# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- TerraPay Integration
  - Secure iframe integration for card payments
  - API integration for remittance processing
  - Transaction status tracking
  - Payment queue management system
- Integrated Finance banking integration
  - Collection account handling
  - Liquidity account management
  - Settlement processing
- Transaction Processing System
  - Card payment flow
  - Outbound transaction handling
  - FIFO queue management
  - Error handling and retry logic
- New Transfer page with currency conversion
  - Amount input with EUR/PKR toggle
  - Real-time currency conversion
  - Minimum amount validation (€10)
  - Recipient details display
- TransferHeader component with back navigation
- Exchange rate API endpoint
- Enhanced contacts API with detailed contact information
- Global middleware for enhanced route protection
- White border (2px) around contact images
- Navigation to add-favourite page from Quick Remit
- New API endpoints for contact management (default, user-specific, and delete)
- Error handling for duplicate contact phone numbers
- Radial gradient background to Transfer page to match Dashboard styling
- Möjlighet att redigera överföringsbelopp direkt i Transfer Summary-komponenten
- Validering för minimibelopp (10 euro) vid överföring
- Felmeddelanden och visuell feedback för ogiltiga belopp
- Information om de senaste ändringarna med typsnitt och zoom
- Stripe betalningsintegration
  - Checkout session-hantering
  - Omdirigering till betalningssida
  - Återgång till applikationen efter betalning
  - Felhantering för betalningsprocessen
- Konsekvent bakgrundsdesign på alla sidor i överföringsflödet
  - Gradient-bakgrund med grön-till-beige övergång
  - Centrerad gul accentcirkel med blur-effekt
- Konsekvent knappdesign genom hela applikationen
  - Rundade knappar med samma höjd och bredd
  - Grön bakgrund för aktiva knappar, röd för felmeddelanden
  - Standardiserad textstorlek och typsnitt

### Changed
- Updated database schema to include transaction model
- Enhanced API structure for payment processing
- Added environment variables for TerraPay integration
- Updated Quick Remit component styling
  - Changed layout from grid to flexbox for better spacing
  - Added placeholder elements for symmetrical layout
  - Added #FDE3C4 background color for "Add new" button
  - Consistent 2px white border for all contact images
  - Fixed "Add new" text wrapping
- Modified database schema to support standard contacts
  - Made userId optional in Contact model
  - Updated seed script for standard contacts
- Improved contacts API to handle both standard and user contacts
  - Standard contacts shown first
  - User-specific contacts shown after
- Updated TypeScript configuration for Next.js 14

### Fixed
- Authentication bypass issue in dashboard route
- Database seeding for standard contacts
- Contact display order in Quick Remit component
- TypeScript configuration issues
- Prisma client initialization
- Safari font compatibility issues across all pages
- Prevented unwanted zoom on mobile when focusing input fields
- Improved header typography and consistency across all pages

## [0.2.0] - 2024-03-18

### Added
- Favorites functionality
  - Add contacts as favorites with profile pictures
  - Phone number validation with country codes
  - Default contacts for new users
- Improved authentication with NextAuth
  - Google OAuth integration
  - JWT session management
  - Protected API routes
- Database migrations and seed script
  - Added Contact model with favorite status
  - Default contacts seeding
- New UI components
  - Add favorite page
  - Phone input with country codes
  - Profile picture upload

### Changed
- Updated project structure for better organization
- Improved error handling in API routes
- Enhanced session management
- Updated dependencies

### Fixed
- Session validation in API routes
- Duplicate contacts prevention
- Phone number validation

## [0.1.0] - 2024-03-01

### Added
- Initial project setup
- Basic Next.js 14 structure
- Authentication foundation
- Dashboard layout
- PostgreSQL with Prisma integration
