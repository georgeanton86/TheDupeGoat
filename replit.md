# Overview

This is a luxury perfume e-commerce application called "RVLTN PARFUMS" that focuses on selling "The Seven Seals Collection" - exclusive, limited-edition apocalyptic fragrances inspired by Revelation 6-8. The application features 8 fragrances (all unisex), with Latin names, Revelation verses, premium brand experience with dark gradient backgrounds and brass/amber text, shopping cart with promo codes, and a strict no-returns policy.

## Product Catalog - The Seven Seals Collection (8 Fragrances)

**The Four Horsemen:**
1. **EQUUS ALBUS** (White Horse) - Revelation 6:1–2 | "I looked, and behold, a white horse! And its rider had a bow, and a crown was given to him" | Notes: Bright Amber, White Musk, Citrus | Theme: Conquest & awakening
2. **PAX OBSCURA** (Red Horse) - Revelation 6:3–4 | "Out came another horse, bright red. Its rider was permitted to take peace from the earth" | Notes: Smoky Spice, Leather | Theme: Passion & chaos
3. **FAMES** (Black Horse) - Revelation 6:5–6 | "I looked, and behold, a black horse! And its rider had a pair of scales in his hand" | Notes: Dry Woods, Vetiver, Black Pepper | Theme: Desire & restraint
4. **MORTEM** (Pale Horse) - Revelation 6:7–8 | "I looked, and behold, a pale horse! And its rider's name was Death" | Notes: Incense, Cedar, Myrrh | Theme: Stillness & eternity

**The Remaining Seals:**
5. **VOX CAELI** (Fifth Seal) - Revelation 6:9–11 | "I saw under the altar the souls of those who had been slain for the word of God" | Notes: White Oud, Soft Smoke | Theme: Prayer & transcendence
6. **TERRA TREMOR** (Sixth Seal) - Revelation 6:12–17 | "There was a great earthquake, and the sun became black as sackcloth" | Notes: Amber, Patchouli, Volcanic Depth | Theme: Power & awe
7. **SABBATUM** (Seventh Seal) - Revelation 8:1 | "When the Lamb opened the seventh seal, there was silence in heaven for about half an hour" | Notes: Sandalwood, Linen, White Iris | Theme: Sacred stillness
8. **LUX AETERNA** (Eternal Light) - Revelation 21:23 | "The city has no need of sun or moon, for the glory of God gives it light" | Notes: Golden Woods, Radiant Amber | Theme: Completion & resurrection

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
- **Data Storage**: In-memory product catalog and PostgreSQL payment orders
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

## Payment Processing
- **Active provider**: Stripe Payment Element. Development requires test-mode keys; production requires live-mode keys.
- The server validates cart, customer, policy acknowledgement, and US delivery address before creating a PaymentIntent. Prices, WELCOME10 discount, and shipping are calculated on the server.
- Stripe's managed, signature-verified webhook records paid orders in PostgreSQL. Browser confirmation also retrieves the PaymentIntent from Stripe and records the same order idempotently; a unique payment ID prevents duplicates.
- Paid quantities are deducted from displayed inventory, which starts from the in-memory catalog. Pending payments do not reserve stock, so simultaneous checkouts can still oversell.
- Checkout confirmation survives refresh in the same browser session. The app does not send confirmation email or calculate sales tax.

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Schema**: Users, products, variants, legacy orders, and Stripe payment orders
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
- **Stripe**: Primary payment processor configured with LIVE keys for accepting real payments
- **Environment**: STRIPE_LIVE_SECRET_KEY and VITE_STRIPE_LIVE_PUBLIC_KEY for production payment processing

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