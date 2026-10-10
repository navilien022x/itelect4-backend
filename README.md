# ITElect4 Backend

Express and MongoDB API for the Campus Food Pre-Order System.

## Setup

Install dependencies, copy `.env.example` to `.env`, and configure:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - random secret of at least 32 characters
- `PORT` - API port (defaults to `5000`)

Run the development server with `npm run dev`. Run `npm run build` to compile
the TypeScript backend and `npm start` to run the compiled server.

## API

- `POST /api/auth/register` and `POST /api/auth/login` issue a one-day JWT.
- `GET /api/health` checks API availability.
- `GET /api/orders` lists the signed-in user's orders.
- `GET /api/orders/:id` retrieves one of the signed-in user's orders.
- `POST /api/orders` creates an order for the signed-in user.
- `PUT /api/orders/:id` updates one of the signed-in user's orders.
- `DELETE /api/orders/:id` deletes one of the signed-in user's orders.

All order endpoints require `Authorization: Bearer <token>`. The order schema
requires at least one food item ID, limits the total amount to non-negative
values, restricts status to `0` (Placed), `1` (Preparing), or `2`
(ReadyForPickup), and limits notes to 200 characters.