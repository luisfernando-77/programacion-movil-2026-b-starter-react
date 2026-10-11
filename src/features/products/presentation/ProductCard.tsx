import {
  IonBadge,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';
import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  onSelect?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const stockColor = product.isOutOfStock
    ? 'danger'
    : product.isLowStock
      ? 'warning'
      : 'success';

  return (
    <IonItem
      button={Boolean(onSelect)}
      detail={Boolean(onSelect)}
      onClick={() => onSelect?.(product.id)}
    >
      <IonLabel>
        <h2>{product.name}</h2>

        <p>
          <IonText color="medium">
            {product.category}
          </IonText>
        </p>

        <p>
          <strong>{product.priceLabel}</strong>
        </p>

        <IonBadge color={stockColor}>
          {product.stockLabel}
        </IonBadge>

        <p>
          <IonText color="medium">
            Stock: {product.stock}
          </IonText>
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default ProductCard;