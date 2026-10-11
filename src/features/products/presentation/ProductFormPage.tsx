import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ApiError, getErrorMessage } from '../data/api-error';
import {
  createProduct,
  getProduct,
  updateProduct,
} from '../data/products-api';
import {
  CATEGORIES,
  validateProduct,
  type ProductField,
  type ProductInput,
} from '../domain/product';

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();

  const isEditing = id !== undefined;
  const productId = id ? Number(id) : null;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const [errors, setErrors] = useState<
    Partial<Record<ProductField, string>>
  >({});

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const loadProduct = async () => {
      if (
        productId === null ||
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        setServerError('El identificador del producto no es válido.');
        setLoading(false);
        return;
      }

      try {
        const product = await getProduct(productId);

        setName(product.name);
        setPrice(String(product.price));
        setCategory(product.category);
        setStock(String(product.stock));
      } catch (error) {
        setServerError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [isEditing, productId]);

  const handleSubmit = async () => {
    setServerError('');
    setServerDetails([]);

    const input: ProductInput = {
      name,
      price: Number(price),
      category,
      stock: Number(stock),
    };

    const validation = validateProduct(input);

    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && productId !== null) {
        await updateProduct(productId, input);
        history.replace(`/productos/${productId}`);
      } else {
        await createProduct(input);
        history.replace('/productos');
      }
    } catch (error) {
      setServerError(getErrorMessage(error));

      if (error instanceof ApiError) {
        setServerDetails(error.details);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/productos" />
          </IonButtons>

          <IonTitle>
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <p>Cargando producto…</p>}

        {!loading && (
          <>
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              value={name}
              onIonInput={(event) =>
                setName(String(event.detail.value ?? ''))
              }
            />

            {errors.name && (
              <IonText color="danger">
                <p>{errors.name}</p>
              </IonText>
            )}

            <IonInput
              className="ion-margin-top"
              label="Precio"
              labelPlacement="floating"
              fill="outline"
              type="number"
              value={price}
              onIonInput={(event) =>
                setPrice(String(event.detail.value ?? ''))
              }
            />

            {errors.price && (
              <IonText color="danger">
                <p>{errors.price}</p>
              </IonText>
            )}

            <div className="ion-margin-top">
              <p>
                <strong>Categoría</strong>
              </p>

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

            {errors.category && (
              <IonText color="danger">
                <p>{errors.category}</p>
              </IonText>
            )}

            <IonInput
              className="ion-margin-top"
              label="Stock"
              labelPlacement="floating"
              fill="outline"
              type="number"
              value={stock}
              onIonInput={(event) =>
                setStock(String(event.detail.value ?? ''))
              }
            />

            {errors.stock && (
              <IonText color="danger">
                <p>{errors.stock}</p>
              </IonText>
            )}

            {serverError && (
              <IonText color="danger">
                <p>
                  <strong>{serverError}</strong>
                </p>
              </IonText>
            )}

            {serverDetails.length > 0 && (
              <IonText color="danger">
                <ul>
                  {serverDetails.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </IonText>
            )}

            <IonButton
              expand="block"
              className="ion-margin-top"
              disabled={submitting}
              onClick={() => void handleSubmit()}
            >
              {submitting
                ? 'Guardando…'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear producto'}
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              disabled={submitting}
              onClick={() => {
                if (isEditing && productId !== null) {
                  history.push(`/productos/${productId}`);
                } else {
                  history.push('/productos');
                }
              }}
            >
              Cancelar
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;