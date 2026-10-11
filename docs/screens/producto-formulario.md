# Screen — Product Form

- **Routes:** `/productos/nuevo` and `/productos/:id/editar`
- **Feature:** Product Catalog
- **Status:** In progress

---

## Purpose

Provide one reusable form for creating and editing products. The screen validates product data before sending it to the Express API and also displays validation messages returned by the server.

---

## Modes

### Create mode

Route:

`/productos/nuevo`

The form starts empty and creates a product using:

`POST /api/products`

### Edit mode

Route:

`/productos/:id/editar`

The existing product is loaded first using:

`GET /api/products/:id`

The updated product is sent using:

`PUT /api/products/:id`

---

## Fields

The form includes:

- `name`
- `price`
- `category`
- `stock`

Category options:

- Bebidas
- Snacks
- Aseo
- Hogar

---

## Validation

Validation is performed with the domain function:

`validateProduct`

Rules:

- `name` is required.
- `name` cannot be empty after trimming spaces.
- `name` has a maximum length of 60 characters.
- `price` must be a number greater than 0.
- `category` is required.
- `category` must be one of: Bebidas, Snacks, Aseo, Hogar.
- `stock` must be an integer greater than or equal to 0.

Validation messages are displayed inline next to the corresponding fields.

---

## State

The screen uses local React state with `useState`.

Main state values:

- `form`
- `errors`
- `loading`
- `submitting`
- `serverError`

In edit mode, `useEffect` is used to load the existing product.

---

## Submission flow

1. The user enters or updates the product data.
2. The application runs `validateProduct`.
3. If validation fails, inline errors are displayed and no request is sent.
4. If validation succeeds, the application sends the corresponding POST or PUT request.
5. If the API rejects the request with status 400, the messages from `details` are displayed.
6. If the request succeeds, the user is redirected to the appropriate product view.

---

## Server validation errors

The API returns validation errors using the format:

```json
{
  "error": "Datos inválidos",
  "details": [
    "..."
  ]
}