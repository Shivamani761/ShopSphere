# ShopSphere — Full-Stack Product Discovery

A responsive e-commerce product discovery application built for the Vibe Coding assessment. React sends filter state to an Express REST API; all product filtering, validation and sorting happen on the server.

## Features
- Multi-select categories: Electronics, Apparel and Footwear
- Dual-thumb price range from ₹0 to ₹100,000
- Minimum rating radio filters (All Ratings and 1–5 stars)
- Search by product name
- Server-side combined filtering (logical AND)
- Backend sorting: default, price low/high and top rated
- Loading, API error and no-results states
- Reset filters, responsive filter drawer and mobile-friendly product grid
- 24 sample products stored in the backend inventory

## Stack
React, Vite, JavaScript, CSS3, Lucide React, Fetch API, Node.js and Express.

## Requirements
Node.js 18+ and npm.

## Install and run
From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Open http://localhost:5173. API health: http://localhost:5000/api/health

Alternatively, run the services in separate terminals:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## API
`GET /api/products`

Query parameters:
- `categories=Electronics,Apparel`
- `minPrice=1000`
- `maxPrice=10000`
- `minRating=4`
- `sortBy=price-low-high` (`default`, `price-low-high`, `price-high-low`, `top-rated`)
- `search=phone`

Example:
`http://localhost:5000/api/products?categories=Electronics,Apparel&minPrice=1000&maxPrice=50000&minRating=4&sortBy=price-low-high`

Response:
```json
{
  "success": true,
  "total": 2,
  "products": [],
  "filters": {
    "categories": ["Electronics"],
    "minPrice": 1000,
    "maxPrice": 10000,
    "minRating": 4,
    "sortBy": "default"
  }
}
```

`GET /api/health` returns API status and timestamp.

## Architecture
- `server/src/data/products.js`: master inventory
- `server/src/controllers/productController.js`: request parsing and response
- `server/src/routes/productRoutes.js`: API routes
- `server/src/middleware/errorHandler.js`: centralized errors
- `client/src/services/productApi.js`: API client
- `client/src/hooks/useProducts.js`: debounced, cancellable fetch lifecycle
- `client/src/components`: reusable UI components

## Testing checklist
Manually verify all products, each category, multi-category selection, min/max price, each rating, combined filters, all sort orders, no matches, invalid category/rating/price/sort inputs, reset, API failure and mobile layout.

## GitHub
Create a public repository, then from this folder run:
```bash
git init
git add .
git commit -m "Initial ShopSphere project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Do not commit `.env`, credentials or `node_modules`. Make meaningful commits during the permitted assessment window. Do not push until you have checked the assessment instructions and are ready to submit.


## Added categories, accounts and cart
- Added **Home & Kitchen** and **Sports** as additional categories without removing Electronics, Apparel or Footwear.
- Account endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`.
- Cart endpoints (Bearer token required): `GET /api/cart`, `POST /api/cart`, `PATCH /api/cart/:productId`, `DELETE /api/cart/:productId`.
- Passwords are hashed using Node.js `crypto` PBKDF2; raw passwords are not stored.
- Add to cart requires a signed-in account. If a visitor clicks Add to cart, the account dialog opens and the chosen item is added automatically after successful sign-up/sign-in. Cart quantities and totals are calculated by the backend.
- **Demo limitation:** account/session/cart data is held in server memory. It resets when the API process restarts and is not production persistence. For a production deployment, connect a database, use durable sessions/JWT with appropriate security controls, HTTPS, rate limiting and email verification.
- Checkout is a UI demo only; no payment processing is connected.
