import { describe, expect, it } from 'vitest';
import seedProducts from '../../../../server/data/products.json';
import {
  CATEGORIES,
  filterProducts,
  formatCOP,
  LOW_STOCK_THRESHOLD,
  toProductView,
  validateProduct,
} from '../domain/product';

describe('datos semilla de la API', () => {
  it('trae 8 productos con ids 1 a 8', () => {
    expect(seedProducts).toHaveLength(8);
    expect(seedProducts.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('usa solo categorías permitidas y stock entero no negativo', () => {
    for (const item of seedProducts) {
      expect(CATEGORIES).toContain(item.category);
      expect(Number.isInteger(item.stock)).toBe(true);
      expect(item.stock).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades para probar las etiquetas', () => {
    expect(seedProducts.some((item) => item.stock === 0)).toBe(true);
    expect(
      seedProducts.some(
        (item) => item.stock > 0 && item.stock < LOW_STOCK_THRESHOLD,
      ),
    ).toBe(true);
  });
});

describe('formatCOP', () => {
  it('separa los miles con punto y antepone el signo de pesos', () => {
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
    expect(formatCOP(8500)).toBe('$ 8.500');
    expect(formatCOP(950)).toBe('$ 950');
  });
});

describe('validateProduct', () => {
  it('rechaza un nombre vacío, un precio menor o igual que 0 y una categoría no permitida', () => {
    const result = validateProduct({
      name: '   ',
      price: 0,
      category: 'Otra',
      stock: -1,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.price).toBeDefined();
    expect(result.errors.category).toBeDefined();
    expect(result.errors.stock).toBeDefined();
  });
});

describe('toProductView', () => {
  it('formatea el precio en pesos y marca «Agotado» y «Pocas unidades»', () => {
    const outOfStock = toProductView({
      id: 1,
      name: ' Producto agotado ',
      price: 1250000,
      category: 'Hogar',
      stock: 0,
    });

    expect(outOfStock.name).toBe('Producto agotado');
    expect(outOfStock.priceLabel).toBe('$ 1.250.000');
    expect(outOfStock.stockLabel).toBe('Agotado');
    expect(outOfStock.isOutOfStock).toBe(true);
    expect(outOfStock.isLowStock).toBe(false);

    const lowStock = toProductView({
      id: 2,
      name: 'Producto con pocas unidades',
      price: 8500,
      category: 'Snacks',
      stock: 3,
    });

    expect(lowStock.priceLabel).toBe('$ 8.500');
    expect(lowStock.stockLabel).toBe('Pocas unidades');
    expect(lowStock.isOutOfStock).toBe(false);
    expect(lowStock.isLowStock).toBe(true);
  });
});

describe('filterProducts', () => {
  it('filtra por texto sin distinguir mayúsculas y por categoría exacta', () => {
    const products = seedProducts.map((item) => ({ ...item }));

    const bySearch = filterProducts(products, {
      search: 'AGUA',
      category: '',
    });

    expect(bySearch).toHaveLength(1);
    expect(bySearch[0].name).toBe('Agua mineral 600 ml');

    const byCategory = filterProducts(products, {
      search: '',
      category: 'Bebidas',
    });

    expect(byCategory).toHaveLength(3);
    expect(byCategory.every((item) => item.category === 'Bebidas')).toBe(true);

    const combined = filterProducts(products, {
      search: 'jugo',
      category: 'Bebidas',
    });

    expect(combined).toHaveLength(1);
    expect(combined[0].name).toBe('Jugo de naranja 1 L');
  });
});