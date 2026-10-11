import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import {
  toProductView,
  type ProductView,
} from '../domain/product';
import EmptyState from './EmptyState';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const productId = Number(id);

  const [product, setProduct] = useState<ProductView | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!Number.isInteger(productId) || productId <= 0) {
        setErrorMessage('El identificador del producto no es válido.');
        setStatus('error');
        return;
      }

      setStatus('loading');
      setErrorMessage('');

      try {
        const result = await getProduct(productId);
        setProduct(toProductView(result));
        setStatus('ready');
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        setStatus('error');
      }
    };

    void loadProduct();
  }, [productId]);

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMessage('');

    try {
      await deleteProduct(productId);
      history.replace('/productos');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>
          <IonTitle>Detalle del producto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {status === 'loading' && <p>Cargando producto…</p>}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar el producto"
            message={errorMessage}
            actionLabel="Volver"
            onAction={() => history.replace('/productos')}
          />
        )}

        {status === 'ready' && product && (
          <>
            <h2>{product.name}</h2>

            <p>
              <strong>ID:</strong> {product.id}
            </p>

            <p>
              <strong>Categoría:</strong> {product.category}
            </p>

            <p>
              <strong>Precio:</strong> {product.priceLabel}
            </p>

            <p>
              <strong>Stock:</strong> {product.stock}
            </p>

            <p>
              <strong>Estado:</strong> {product.stockLabel}
            </p>

            <IonButton
              expand="block"
              onClick={() => history.push(`/productos/${product.id}/editar`)}
            >
              Editar
            </IonButton>

            {!showDeleteConfirmation && (
              <IonButton
                expand="block"
                color="danger"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Eliminar
              </IonButton>
            )}

            {showDeleteConfirmation && (
              <div className="ion-margin-top">
                <p>
                  <strong>¿Eliminar este producto?</strong>
                </p>

                {errorMessage && (
                  <p>
                    {errorMessage}
                  </p>
                )}

                <IonButton
                  color="danger"
                  disabled={deleting}
                  onClick={() => void handleDelete()}
                >
                  {deleting ? 'Eliminando…' : 'Confirmar'}
                </IonButton>

                <IonButton
                  fill="outline"
                  disabled={deleting}
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancelar
                </IonButton>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;