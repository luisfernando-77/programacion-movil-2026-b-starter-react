# Screen — Product List

- **Route:** `/productos`
- **Feature:** Product Catalog
- **Status:** In progress

---

## Purpose

Display the complete product catalog loaded from the Express API. The screen allows the user to search products by name, filter them by category, open a product detail, and navigate to the product creation form.

---

## UI elements

- Page title: `Productos`
- Search input for product name.
- Category filter buttons:
  - Todas
  - Bebidas
  - Snacks
  - Aseo
  - Hogar
- Button to create a new product.
- Product cards rendered with the `ProductCard` component.
- Retry button when the API request fails.

---

## Data

The screen obtains products from:

`GET /api/products`

The product list is stored in local page state.

Filtering is performed with the domain function:

`filterProducts(products, search, category)`

---

## State

The screen uses React local state with `useState` and loads data using `useEffect`.

Main state values:

- `products`
- `loading`
- `error`
- `search`
- `category`

---

## Screen states

### Loading

Displayed while the application is waiting for the API response.

### Empty

Displayed when the API returns an empty product list.

### No results

Displayed when products exist but the current search or category filter does not match any product.

### Error

Displayed when the API request fails. The user can use the `Reintentar` button to load the products again.

---

## User actions

- Search products by entering text.
- Filter products by category.
- Select `Todas` to remove the category filter.
- Open a product detail.
- Navigate to the new product form.
- Retry the API request after an error.

---

## Navigation

| Action | Destination |
|--------|-------------|
| Select product | `/productos/:id` |
| Create product | `/productos/nuevo` |

---

## Validation and errors

This screen does not edit product data, so product validation is not required here.

API failures are captured and displayed as an error state without crashing the application.

---

## Acceptance criteria

- [ ] Products are loaded from the API.
- [ ] Search works without distinguishing uppercase and lowercase letters.
- [ ] Category filtering works for Bebidas, Snacks, Aseo and Hogar.
- [ ] The screen displays loading state.
- [ ] The screen displays empty state.
- [ ] The screen displays no-results state.
- [ ] The screen displays error state.
- [ ] The error state includes a retry button.
- [ ] Every product is displayed using `ProductCard`.
- [ ] The user can navigate to product detail.
- [ ] The user can navigate to create a new product.