# day1 — User API

A small Express API for managing users, restructured into a layered
architecture with centralized schema validation.

## Structure

```
day1-api/
├── server.js                          # Entry point — starts the HTTP server
├── package.json
├── src/
│   ├── app.js                         # Express app: middleware, routes, error handlers
│   ├── data/
│   │   └── MOCK_DATA.json             # In-memory "database" (1000 seed users)
│   ├── routes/
│   │   ├── index.js                   # Mounts every resource router under /api
│   │   └── user.routes.js             # /api/users routes -> validation -> controller
│   ├── controllers/
│   │   └── user.controller.js         # req/res handling, calls the service layer
│   ├── services/
│   │   └── user.service.js            # Business logic + data access (no req/res)
│   ├── validations/
│   │   └── schemaValidation.js        # ALL Joi schemas + the `validate` middleware
│   ├── middlewares/
│   │   └── errorHandler.js            # Central error + 404 handler
│   └── utils/
│       └── ApiError.js                # Custom error class (statusCode + message)
```

## How a request flows

```
request
  -> route (src/routes/user.routes.js)
  -> validate(schema) middleware (src/validations/schemaValidation.js)
       -> invalid? respond 400 with { success:false, message, errors[] } and stop
       -> valid?   continue
  -> controller (src/controllers/user.controller.js)
  -> service (src/services/user.service.js)
       -> not found / bad state? throw ApiError -> caught by controller -> next(err)
  -> response
```

Any error thrown anywhere ends up in `src/middlewares/errorHandler.js`, which
returns one consistent JSON shape:

```json
{ "success": false, "message": "..." }
```

## Run it

```bash
npm install
npm start        # node server.js
# or
npm run dev       # auto-restarts on file changes
```

Server listens on `http://localhost:8000` (override with `PORT` env var).

## Endpoints

| Method | Route             | Validates                                   |
|--------|--------------------|----------------------------------------------|
| GET    | `/api/users`       | query: `page`, `limit` (optional)             |
| GET    | `/api/users/:id`   | params: `id` (positive integer)               |
| POST   | `/api/users`       | body: `name`, `email`, `role`, `gender` (all required) |
| PUT    | `/api/users/:id`   | params: `id`; body: at least one of the 4 fields |
| DELETE | `/api/users/:id`   | params: `id`                                   |

## Adding a new resource (e.g. "products")

1. Add its Joi schemas to `src/validations/schemaValidation.js`.
2. Create `src/services/product.service.js` (data + logic).
3. Create `src/controllers/product.controller.js` (req/res).
4. Create `src/routes/product.routes.js` (wires validation + controller).
5. Mount it in `src/routes/index.js`:
   ```js
   router.use('/products', productRoutes);
   ```

No changes needed anywhere else — `app.js` and `server.js` stay untouched.
