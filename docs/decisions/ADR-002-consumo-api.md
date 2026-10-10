# ADR-002 — API Consumption

- **Status:** Accepted
- **Date:** 2026-10-10
- **Feature:** Product Catalog

## Context

The Ionic React application needs to communicate with the Express API to list, retrieve, create, update, and delete products. The starter already provides `API_URL`, the `ApiError` class, and `getProducts` as an example of the HTTP client structure. The application must also distinguish validation errors, not-found responses, and unexpected server errors.

## Decision

Use the native `fetch` API inside the data layer to communicate with the Express backend. All product requests will use `API_URL` from the existing configuration. Successful responses will be converted to application data, while unsuccessful responses will be represented with `ApiError` so the presentation layer can distinguish the HTTP status and the server error payload. The application will implement `getProduct`, `createProduct`, `updateProduct`, and `deleteProduct` following the structure already used by `getProducts`.

## Consequences

This decision keeps HTTP access centralized in the data layer and prevents UI components from duplicating request logic. It also provides consistent handling of API errors across the product screens. Validation errors returned with status `400` can expose the `details` messages to the form, while status `404` can be handled as a product-not-found state. The application remains simple because no additional HTTP library is required.