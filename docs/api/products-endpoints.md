# Product API Endpoints

- **Feature:** Product Catalog
- **Base path:** `/api/products`
- **Storage:** In-memory
- **Response format:** JSON

## Product shape

Example:

{
  "id": 1,
  "name": "Producto",
  "price": 12500,
  "category": "Bebidas",
  "stock": 10
}

## GET /api/products

Returns the complete list of products.

### Success response

- **Status:** `200 OK`
- **Body:** array of products

### Optional query parameters

#### search

Filters products whose `name` contains the provided text without distinguishing uppercase and lowercase letters.

Example:

GET /api/products?search=cafe

#### category

Filters products by exact category.

Allowed categories:

- Bebidas
- Snacks
- Aseo
- Hogar

Example:

GET /api/products?category=Bebidas

Both filters can be used together.

Example:

GET /api/products?search=agua&category=Bebidas

## GET /api/products/:id

Returns one product by its identifier.

### Success response

- **Status:** `200 OK`
- **Body:** requested product

### Errors

- **Status:** `400 Bad Request` if the id is not numeric.
- **Status:** `404 Not Found` if the product does not exist.

Errors use the standard API error format.

## POST /api/products

Creates a new product.

### Request body

{
  "name": "Agua",
  "price": 3500,
  "category": "Bebidas",
  "stock": 12
}

### Success response

- **Status:** `201 Created`
- **Body:** created product including its incremental `id`

### Validation rules

- `name` is required.
- `name` must be a non-empty string.
- `name` has a maximum length of 60 characters.
- `price` must be a number greater than 0.
- `category` is required.
- `category` must be one of: Bebidas, Snacks, Aseo, Hogar.
- `stock` must be an integer greater than or equal to 0.

### Validation error

- **Status:** `400 Bad Request`

{
  "error": "Datos inválidos",
  "details": [
    "name es obligatorio"
  ]
}

If more than one field is invalid, `details` contains one message for each validation problem.

## PUT /api/products/:id

Updates an existing product.

### Request body

{
  "name": "Agua mineral",
  "price": 4200,
  "category": "Bebidas",
  "stock": 8
}

### Success response

- **Status:** `200 OK`
- **Body:** updated product

### Errors

- `400 Bad Request` if the id is invalid.
- `400 Bad Request` if the product data does not pass validation.
- `404 Not Found` if the product does not exist.

Validation rules are the same as in `POST /api/products`.

## DELETE /api/products/:id

Deletes an existing product.

### Success response

- **Status:** `204 No Content`
- **Body:** none

### Errors

- `400 Bad Request` if the id is invalid.
- `404 Not Found` if the product does not exist.

A successful delete must not return a JSON body.

## Error format

All API errors use the following structure:

{
  "error": "mensaje",
  "details": [
    "detalle 1",
    "detalle 2"
  ]
}

The `details` property contains the specific reason or reasons for the error.

## General behavior

The API uses `express.json()` to read JSON request bodies and CORS to allow requests from the Ionic application. Invalid identifiers are handled using the provided `parseId` helper. Unknown routes are handled by the existing 404 middleware, and unexpected server failures are handled by the existing 500 error middleware.