# Overview

This is a luxury perfume e-commerce application called "RVLTN PARFUMS" that focuses on selling exclusive, limited-edition fragrances. The application features a premium brand experience with sophisticated design, limited monthly product releases, and a strict no-returns policy. It's built as a full-stack application with payment processing capabilities through Stripe.

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
- **Provider**: Stripe integration for secure payment handling
- **Implementation**: Stripe Elements for payment forms with server-side payment intent creation
- **Security**: Environment-based API key management with separate public/private keys

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
- **Stripe**: Complete payment processing platform with React integration (@stripe/stripe-js, @stripe/react-stripe-js)
- **Environment**: Separate public and secret keys for client and server-side operations

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