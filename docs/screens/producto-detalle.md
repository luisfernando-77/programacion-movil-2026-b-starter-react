# Screen — Product Detail

- **Route:** `/productos/:id`
- **Feature:** Product Catalog
- **Status:** In progress

---

## Purpose

Display all information for a selected product. The screen allows the user to review the product data, navigate to the edit form, or delete the product after a simple confirmation.

---

## UI elements

- Page title: `Detalle del producto`
- Product name
- Product price
- Product category
- Product stock
- Stock status label
- Edit button
- Delete button
- Simple delete confirmation
- Back navigation to the product list

---

## Data

The screen loads one product from:

`GET /api/products/:id`

The route parameter is obtained with:

`useParams<{ id: string }>()`

The numeric identifier is converted before making the request.

---

## State

The screen uses local React state with `useState` and loads the product with `useEffect`.

Main state values:

- `product`
- `loading`
- `error`
- `confirmDelete`
- `deleting`

---

## Screen states

### Loading

Displayed while the selected product is being requested from the API.

### Loaded

Displays all product fields and available actions.

### Not found

Displayed when the API responds with 404 because the product does not exist.

### Error

Displayed when another API error occurs while loading or deleting the product.

---

## Product information

The screen displays:

- `id`
- `name`
- `price`
- `category`
- `stock`

The presentation layer uses `toProductView` so the price is shown with `formatCOP` and the stock label is displayed according to the product stock.

Stock labels:

- `Agotado` when stock is `0`
- `Pocas unidades` when stock is less than `5`
- `Disponible` in any other case

---

## User actions

- Return to the product list.
- Navigate to the edit form.
- Start the delete action.
- Confirm or cancel the deletion.
- Return to the list after successful deletion.

---

## Navigation

| Action | Destination |
|--------|-------------|
| Back | `/productos` |
| Edit product | `/productos/:id/editar` |
| Successful delete | `/productos` |

---

## Delete flow

1. The user presses `Eliminar`.
2. A simple confirmation is displayed on screen.
3. If the user cancels, no request is sent.
4. If the user confirms, the application calls `DELETE /api/products/:id`.
5. A successful deletion returns status `204`.
6. The application navigates back to `/productos`.

---

## Errors

- Invalid identifier.
- Product not found.
- API unavailable.
- Delete request failure.

Errors are displayed to the user without crashing the application.

---

## Acceptance criteria

- [ ] The product is loaded using its route id.
- [ ] All product fields are displayed.
- [ ] The formatted COP price is displayed.
- [ ] The correct stock label is displayed.
- [ ] Loading state is supported.
- [ ] Product-not-found state is supported.
- [ ] General API errors are supported.
- [ ] The user can navigate to edit the product.
- [ ] Delete requires a simple confirmation.
- [ ] Canceling deletion does not remove the product.
- [ ] Confirming deletion calls the API.
- [ ] After successful deletion the application returns to `/productos`.