# Smart Product Assistant

A full-stack application that helps users find products using natural language queries powered by AI. The application provides intelligent product recommendations and detailed information about products across various categories.

## Project Overview

Smart Product Assistant is designed to revolutionize the way users search for products by:
- Understanding natural language queries
- Providing context-aware product recommendations
- Offering detailed product information and comparisons
- Supporting multiple product categories
- Delivering a seamless user experience across devices

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Supabase Auth
- **UI Components**: Shadcn/ui

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI API
- **Authentication**: Supabase Auth
- **Testing**: Jest with Supertest

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- OpenAI API key
- Supabase account

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd smart-product-assistant-be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables in `.env`

4. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd smart-product-assistant-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables in `.env.local`

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Products API
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/product/search` - Natural language product search

### Categories API
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## LLM Integration Approach

The application uses OpenAI's GPT models to:
1. Process natural language queries
2. Understand user intent and requirements
3. Generate relevant product recommendations
4. Provide detailed product comparisons
5. Answer product-related questions

### Implementation Details
- Uses OpenAI's gpt-4o-mini for complex queries
- Implements prompt engineering for better results
- Caches common queries for improved performance
- Handles rate limiting and error cases
- Provides fallback responses when needed

## Trade-offs and Future Improvements

### Current Trade-offs
1. **Performance vs. Accuracy**
   - Using gpt-4o-mini for better accuracy but higher latency
   - Caching common queries to improve response time

2. **Cost vs. Features**
   - Limited API calls to manage costs
   - Focused on essential features first

3. **Complexity vs. Maintainability**
   - Simplified database schema for easier maintenance
   - Limited number of product attributes

### Future Improvements
1. **Performance Enhancements**
   - Implement server-side caching
   - Add Redis for faster response times
   - Optimize database queries

2. **Feature Additions**
   - User preferences and history
   - Product comparison tools
   - Price tracking and alerts
   - Mobile app version

3. **AI Improvements**
   - Fine-tune models for product domain
   - Implement multi-model approach
   - Add image recognition capabilities

4. **User Experience**
   - Enhanced mobile responsiveness
   - Progressive web app features
   - Offline capabilities

## License

This project is licensed under the ISC License. 