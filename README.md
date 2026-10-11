# Catálogo de productos · Ionic React

Parcial práctico del corte 2 · Programación Móvil · CORHUILA 2026-B · Modalidad individual.

Este proyecto implementa un catálogo de productos compuesto por una API Express, una aplicación Ionic React y un ejercicio en Kotlin. El desarrollo sigue la organización propuesta por el Mobile Governance Framework y mantiene separadas las capas `data`, `domain` y `presentation`.

## Funcionalidades

La aplicación permite:

- Listar productos desde la API.
- Buscar productos por nombre.
- Filtrar productos por categoría.
- Consultar el detalle de un producto.
- Crear productos.
- Editar productos.
- Eliminar productos con confirmación.
- Mostrar el precio en formato de pesos colombianos.
- Mostrar el estado del inventario como `Agotado`, `Pocas unidades` o `Disponible`.
- Validar los datos antes de enviarlos al servidor.
- Mostrar errores de validación y errores provenientes de la API.

## Tecnologías

- Ionic React
- React
- TypeScript
- Express
- Node.js
- Vitest
- Kotlin
- Git y GitHub

## Cómo ejecutar

Requisito: Node.js 22.12 o superior.

Primero instale las dependencias:

    npm install

Copie el archivo de configuración:

PowerShell:

    Copy-Item .env.example .env

Luego ejecute la API en una terminal:

    npm run server

La API queda disponible en:

    http://localhost:3000

En otra terminal ejecute la aplicación:

    npm run dev

La aplicación queda disponible en:

    http://localhost:5173

La ruta principal del catálogo es:

    http://localhost:5173/productos

## Pruebas y calidad

Para ejecutar las pruebas:

    npm test

Resultado verificado durante el desarrollo:

    Test Files  2 passed (2)
    Tests       10 passed (10)

Para revisar el código con ESLint:

    npm run lint

Para comprobar tipos y generar la compilación de producción:

    npm run build

El proyecto fue verificado correctamente con `npm test` y `npm run build`.

## Rutas de la aplicación

- `/productos` — lista de productos.
- `/productos/nuevo` — creación de productos.
- `/productos/:id` — detalle de un producto.
- `/productos/:id/editar` — edición de un producto.

## API

El recurso principal es:

    /api/products

Los productos tienen la siguiente estructura:

    {
      "id": 1,
      "name": "Agua mineral 600 ml",
      "price": 1800,
      "category": "Bebidas",
      "stock": 120
    }

### Endpoints

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/api/products` | Lista de productos |
| GET | `/api/products/:id` | Obtiene un producto |
| POST | `/api/products` | Crea un producto |
| PUT | `/api/products/:id` | Actualiza un producto |
| DELETE | `/api/products/:id` | Elimina un producto |

La lista admite los filtros:

    GET /api/products?search=agua

y:

    GET /api/products?category=Bebidas

Los dos filtros también pueden combinarse.

## Validación

Las reglas utilizadas por la aplicación y por la API son:

- `name` es obligatorio, no puede estar vacío y tiene máximo 60 caracteres.
- `price` debe ser un número mayor que 0.
- `category` debe ser una de estas categorías:
  - Bebidas
  - Snacks
  - Aseo
  - Hogar
- `stock` debe ser un número entero mayor o igual que 0.

Los errores de la API utilizan el formato:

    {
      "error": "mensaje",
      "details": [
        "detalle"
      ]
    }

## Arquitectura

La funcionalidad de productos está organizada en:

    src/features/products/
      data/
      domain/
      presentation/
      __tests__/

### Data

Contiene el cliente HTTP y la configuración para comunicarse con la API.

Funciones principales:

- `getProducts`
- `getProduct`
- `createProduct`
- `updateProduct`
- `deleteProduct`

### Domain

Contiene los tipos y la lógica independiente de React e Ionic.

Funciones principales:

- `formatCOP`
- `validateProduct`
- `toProductView`
- `filterProducts`

### Presentation

Contiene las páginas y componentes de la interfaz:

- `ProductListPage`
- `ProductDetailPage`
- `ProductFormPage`
- `ProductCard`
- `EmptyState`

## Estados de la lista

La pantalla `/productos` contempla:

- Loading.
- Empty.
- No results.
- Error with retry.

También incluye búsqueda por texto y filtros mediante los botones:

- Todas
- Bebidas
- Snacks
- Aseo
- Hogar

## Stock

La presentación del inventario sigue estas reglas:

- `0` → `Agotado`
- Entre `1` y `4` → `Pocas unidades`
- `5` o más → `Disponible`

## Kotlin

El archivo:

    kotlin/Product.kt

incluye la clase `Product` con:

- `id`
- `name`
- `price`
- `category`
- `stock`, que admite `null`

También implementa:

    stockLabel(stock: Int?): String

y:

    applyDiscount(price: Double, percent: Int): Double

El método `main()` crea tres productos, contempla un producto agotado y otro con stock desconocido, e imprime el precio con un descuento del 10 %.

## State management decision

The application uses local React state because each product screen manages a small and independent set of values. `useState` stores products, filters, form data, loading states and errors, while `useEffect` is used to load data when required. This approach keeps state close to the screen that uses it and avoids adding an unnecessary global state library. Domain operations such as filtering and validation remain outside the UI components so they can be tested independently.

## API error handling

The data layer uses a shared request function and the `ApiError` class to represent API and network failures. Network errors are identified with a null status, while HTTP errors preserve the status code and the `details` returned by the Express server. The presentation layer uses `getErrorMessage` to show understandable messages and displays server validation details when a form request is rejected. This keeps HTTP error handling consistent across the product list, detail and form screens.

## Pruebas

Las pruebas se encuentran en:

    src/features/products/__tests__/

Se incluyen pruebas para:

- Datos semilla.
- `formatCOP`.
- `validateProduct`.
- `toProductView`.
- `filterProducts`.
- Error 404 en ruta inexistente.
- POST inválido con respuesta 400.
- GET de producto inexistente con respuesta 404.

Todas las pruebas implementadas pasan correctamente con:

    npm test

## Documentación

La documentación del proyecto está en:

    docs/

Incluye:

- `features/productos.md`
- `screens/productos-lista.md`
- `screens/producto-detalle.md`
- `screens/producto-formulario.md`
- `decisions/ADR-001-estado.md`
- `decisions/ADR-002-consumo-api.md`
- `api/products-endpoints.md`
- `api/product-entity.md`
- `definition-of-done.md`

La documentación fue creada antes del primer commit de implementación.

## Git y entrega

El desarrollo se realiza en la rama:

    feature/catalogo-productos

Se utilizan Conventional Commits con el formato:

    type(scope): summary

Al finalizar se abre un Pull Request desde:

    feature/catalogo-productos

hacia:

    main

del mismo fork del estudiante.

No se incluyen en el repositorio:

    node_modules
    .env

La entrega en Moodle consiste en pegar como texto en línea el enlace del Pull Request.

## Entrega

Fecha límite:

Lunes 12 de octubre de 2026 a las 11:59 p. m.

No se reciben entregas después del cierre.