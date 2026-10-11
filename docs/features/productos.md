# Feature — Product Catalog

> Product catalog feature for the practical exam. It allows users to view, search, filter, create, edit, and delete products through an Ionic React application connected to an Express API.

- **Owner:** Luis Fernando Perez Chala
- **Status:** In progress
- **Related stories:** Product listing, product detail, product creation, product editing, product deletion

---

## Purpose

The Product Catalog allows users to manage a collection of products from a mobile-oriented Ionic application. Users can browse products, search by name, filter by category, inspect product details, and perform the complete CRUD flow through the Express API.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Product List | `/productos` | Displays all products, supports text search and category filtering, and handles loading, empty, no-results, and error states. |
| Product Detail | `/productos/:id` | Displays all information for one product and provides actions to edit or delete it. |
| Product Form | `/productos/nuevo` | Allows the user to create a new product with inline validation. |
| Product Form | `/productos/:id/editar` | Loads an existing product and allows the user to update it using the same reusable form. |

> Each screen is documented separately using the screen specification template.

---

## State

- **Pattern:** Local page state with React hooks.
- **State object(s):** Products list, selected product, loading state, error state, search text, selected category, form data, validation errors.
- **Key transitions:** idle → loading → loaded; loading → error; loaded → empty; loaded → filtered results; form editing → validating → submitting → success or server error.

---

## Data

- **Use cases:** LoadProducts, LoadProductById, CreateProduct, UpdateProduct, DeleteProduct, ValidateProduct, FilterProducts, ConvertProductToView.
- **Repositories:** No repository abstraction is required for this exam; the data layer communicates with the Express API through the supplied HTTP client structure.
- **Remote sources / endpoints:** `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`.
- **Local persistence:** N/A. Products are stored in memory by the Express server and are reset when the server restarts.

---

## Edge cases & states

- [x] Loading
- [x] Empty
- [x] Error / retry
- [ ] Offline
- [ ] Permission denied (if applicable)

Additional cases:
- Search with no matching products.
- Category with no matching products.
- Invalid product identifier.
- Product not found.
- Invalid form fields.
- API validation errors.
- Product with zero stock.
- Product with fewer than five units in stock.

---

## Decisions

This feature depends on:

- `decisions/ADR-001-estado.md` — local state management with React hooks.
- `decisions/ADR-002-consumo-api.md` — HTTP API consumption and error handling.

---

## Tests

- **Unit:** `validateProduct`, `toProductView`, and `filterProducts`.
- **Widget/UI:** Product list states, product form validation, product detail actions.
- **Integration/E2E:** Product creation and API error flows are covered through API tests and manual verification of the Ionic application.