# Overview

This is a luxury perfume e-commerce application called "RVLTN PARFUMS" that focuses on selling exclusive, limited-edition Christian-themed fragrances. The application features 8 biblical fragrances (4 men's colognes + 4 unisex perfumes) inspired by top-selling luxury fragrances, each with Bible verses, premium brand experience, realistic sales counters, shopping cart with promo codes, and a strict no-returns policy. It's built as a full-stack application with production-grade secure PayPal payment processing.

## Product Catalog (8 Fragrances)

**Men's Colognes (4):**
1. **THE WARRIOR** - Psalm 144:1 | "Blessed be the LORD, my rock, who trains my hands for war" | Notes: Calabrian Bergamot, Sichuan Pepper, Ambroxan, Vanilla
2. **THE KING** - Proverbs 3:13-14 | "Blessed is the one who finds wisdom, more precious than gold" | Notes: Pineapple, Blackcurrant, Birch, Oakmoss, Musk
3. **THE ROCK** - Matthew 16:18 | "You are Peter, and on this rock I will build my church" | Notes: Citrus, Ginger, Sandalwood, Cedar, Vetiver
4. **THE BELOVED** - John 13:23 | "One of his disciples, whom Jesus loved, was reclining next to him" | Notes: Mint, Green Apple, Tonka Bean, Vanilla, Oakmoss

**Unisex Perfumes (4):**
1. **THE PROPHET** - Isaiah 6:8 | "I heard the voice of the Lord saying, 'Whom shall I send?'" | Notes: Sandalwood, Cardamom, Iris, Violet, Leather
2. **THE SHIELD** - Ephesians 6:16 | "Take up the shield of faith to extinguish the flaming arrows" | Notes: Leather, Jasmine Sambac, Amber, Patchouli, Moss
3. **THE CROWN** - 2 Timothy 4:8 | "There is laid up for me the crown of righteousness" | Notes: Black Cherry, Bitter Almond, Tonka Bean, Sandalwood
4. **THE LIGHT** - John 8:12 | "I am the light of the world. Whoever follows me will never walk in darkness" | Notes: Lavender, Coconut, Vanilla, Praline, Musk

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, checkout, policy, and 404
- **UI Components**: Shadcn/ui component library with Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom luxury-themed color palette and CSS variables
- **State Management**: TanStack Query for server state management and data fetching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for product management and payment processing
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

## Payment Processing
- **Provider**: PayPal integration (@paypal/paypal-server-sdk) for secure cart-based checkout
- **Implementation**: Custom CartPayPalButton component with PayPal SDK v6
- **Security**: Production-grade security with comprehensive server-side validation:
  - Server-side price recalculation from database (no client price trust)
  - Zod validation for quantities (positive integers, max 100)
  - PayPal SDK verification of order status and captures
  - Currency validation (USD only)
  - Amount reconciliation (±1¢ tolerance)
  - Idempotency protection against replay attacks
  - Promo code validation (WELCOME10 for 10% off)
  - Free shipping calculation (orders ≥$100)
- **Components**: 
  - CartPayPalButton: Secure cart checkout with item-level validation
  - PayPalButton (legacy): Amount-based button (DO NOT MODIFY - incompatible with cart flow)

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema**: Three main entities - users, products, and orders with proper relationships
- **Migration Strategy**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL integration

## Development Environment
- **Build System**: Vite with React plugin for fast development and optimized production builds
- **Development Server**: Express with Vite middleware integration for seamless full-stack development
- **Error Handling**: Runtime error overlay for development with comprehensive error boundaries
- **Hot Reload**: Vite HMR for instant frontend updates during development

# External Dependencies

## Payment Services
- **PayPal**: Complete payment processing platform with PayPal Server SDK (@paypal/paypal-server-sdk)
- **Environment**: PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET for OAuth authentication
- **Stripe**: Available but not currently used (configured for future integration)

## Database Services
- **Neon Database**: Serverless PostgreSQL database with connection pooling (@neondatabase/serverless)
- **Connection Management**: Environment-based DATABASE_URL configuration

## UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives for components
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Font Awesome**: Additional icon set for social media and branding

## Development Tools
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Fast build tool with development server and production optimization
- **ESBuild**: Fast bundling for server-side code in production builds
- **TSX**: TypeScript execution for development server runtime

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation library integrated with Drizzle for type safety
- **Hookform Resolvers**: Bridge between React Hook Form and Zod validation

## Utilities and Helpers
- **Class Variance Authority**: Type-safe CSS class composition for component variants
- **clsx & tailwind-merge**: Utility functions for conditional and merged CSS classes
- **date-fns**: Date manipulation and formatting library
- **nanoid**: Secure URL-friendly unique ID generator