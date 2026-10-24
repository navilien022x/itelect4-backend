# ITElect4 Backend

Express and MongoDB API for the Campus Food Pre-Order System.

## Setup

Install dependencies, copy `.env.example` to `.env`, and configure:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - random secret of at least 32 characters
- `CORS_ORIGIN` - comma-separated list of allowed frontend origins
- `PORT` - API port (defaults to `5000`)
- `GEMINI_API_KEY` - Google Gemini API key for the authenticated AI assistant
- `DNS_SERVERS` - optional comma-separated DNS resolver IPs if the system resolver
  refuses MongoDB SRV lookups

Run the development server with `npm run dev`. Run `npm run build` to compile
the TypeScript backend and `npm start` to run the compiled server.
Run `npm run seed` to idempotently populate the food catalog. Database
connections are opened by request middleware for both the server and Vercel
function entry point in `api/index.ts`.

## API

- `POST /api/auth/register` and `POST /api/auth/login` issue a one-day JWT.
- `GET /` confirms the API is running.
- `GET /api/health` reports whether MongoDB is connected.
- `GET /api/food-items` and `GET /api/food-items/:id` read the public catalog.
- `GET /api/orders` lists the signed-in user's orders.
- `GET /api/orders/:id` retrieves one of the signed-in user's orders.
- `POST /api/orders` creates an order for the signed-in user.
- `PUT /api/orders/:id` updates one of the signed-in user's orders.
- `DELETE /api/orders/:id` deletes one of the signed-in user's orders.
- `POST /api/ai` returns campus food suggestions based on the signed-in user's
  prompt. Prompts must contain 20-2000 non-whitespace characters. Requests are
  limited per authenticated user.

All order endpoints require `Authorization: Bearer <token>`. The order schema
requires at least one food item ID, limits the total amount to non-negative
values, restricts status to `0` (Placed), `1` (Preparing), or `2`
(ReadyForPickup), and limits notes to 200 characters.

If startup reports `querySrv ECONNREFUSED`, check the local DNS server with
`node -e "console.log(require('node:dns').getServers())"`. Set `DNS_SERVERS` in
`.env` to a resolver that can look up the Atlas SRV record, then restart the API.
If Atlas reports `bad auth`, update the MongoDB database user's credentials in
`MONGODB_URI`; URL-encode special characters in the username or password.

## Project Links

- Backend repository: https://github.com/navilien022x/itelect4-backend
- Frontend repository: https://github.com/navilien022x/Atienza-IT4B-Project
- Backend live API: https://itelect4-backend-cyan.vercel.app
- Frontend live app: https://atienza-it4b-project.vercel.app
