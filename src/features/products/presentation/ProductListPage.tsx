import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import {
  CATEGORIES,
  filterProducts,
  toProductView,
  type Product,
} from '../domain/product';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductListPage: React.FC = () => {
  const history = useHistory();

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setStatus('loading');
    setErrorMessage('');

    try {
      const result = await getProducts();
      setProducts(result);
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useIonViewWillEnter(() => {
    void loadProducts();
  });

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        search,
        category,
      }),
    [products, search, category],
  );

  const productViews = useMemo(
    () => filteredProducts.map(toProductView),
    [filteredProducts],
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <IonInput
            label="Buscar producto"
            labelPlacement="stacked"
            placeholder="Escriba un nombre"
            value={search}
            onIonInput={(event) => setSearch(event.detail.value ?? '')}
          />

          <div className="ion-margin-top">
            <IonButton
              size="small"
              fill={category === '' ? 'solid' : 'outline'}
              onClick={() => setCategory('')}
            >
              Todas
            </IonButton>

            {CATEGORIES.map((item) => (
              <IonButton
                key={item}
                size="small"
                fill={category === item ? 'solid' : 'outline'}
                onClick={() => setCategory(item)}
              >
                {item}
              </IonButton>
            ))}
          </div>

          <IonButton
            expand="block"
            className="ion-margin-top"
            onClick={() => history.push('/productos/nuevo')}
          >
            Nuevo producto
          </IonButton>
        </div>

        {status === 'loading' && (
          <p className="ion-padding">Cargando productos…</p>
        )}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() => void loadProducts()}
          />
        )}

        {status === 'ready' && products.length === 0 && (
          <EmptyState
            title="No hay productos"
            message="La API no tiene productos disponibles."
          />
        )}

        {status === 'ready' &&
          products.length > 0 &&
          productViews.length === 0 && (
            <EmptyState
              title="Sin resultados"
              message="No hay productos que coincidan con la búsqueda o la categoría seleccionada."
            />
          )}

        {status === 'ready' && productViews.length > 0 && (
          <IonList>
            {productViews.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => history.push(`/productos/${id}`)}
              />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;