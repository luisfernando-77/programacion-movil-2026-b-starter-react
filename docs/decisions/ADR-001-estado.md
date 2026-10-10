# ADR-001 — State Management

- **Status:** Accepted
- **Date:** 2026-10-10
- **Feature:** Product Catalog

## Context

The Product Catalog application needs to manage data for the product list, product detail, and product form screens. Each screen has its own temporary state such as loading indicators, API errors, filters, form values, validation errors, and the selected product. The application is small and does not require shared global state between unrelated screens.

## Decision

Use local React state with `useState` for screen state and `useEffect` for loading data from the API when a screen is mounted or when a route parameter changes. Each page will manage only the state that belongs to that page. Product filtering and validation logic will remain in the domain layer instead of being implemented directly inside the UI components.

## Consequences

This approach keeps the application simple and avoids adding unnecessary state-management libraries. The state remains close to the components that use it, which makes the code easier to understand and test. The main disadvantage is that state is not automatically shared between screens, so data may need to be loaded again after navigation. For the size and requirements of this practical exam, this trade-off is acceptable.