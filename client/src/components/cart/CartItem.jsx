import { memo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { API_URL } from "../../utils/constants";

const CartItem = ({ item, onUpdate, onRemove }) => {

  const price = item.finalPrice || item.priceSnapshot || 0;

  /* FIND CORRECT VARIANT */

  const variant = item.product?.variants?.find(
    v => v._id === item.variantId
  );

  const image = variant?.images?.[0]?.url;
  console.log(image)

  return (

    <div className="flex gap-4 p-4 border rounded-lg bg-white">

      <img
        src={image ? `${API_URL}${image}` : "/vite.svg"}
        alt={item.product?.title}
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex-1">

        <h3 className="font-semibold">
          {item.product?.title}
        </h3>

        <p className="text-sm text-gray-500">
          {variant?.color} / {variant?.size}
        </p>

        <div className="flex items-center gap-3 mt-2">

          <div className="flex items-center border rounded px-3 py-1 gap-2">

            <button
              disabled={item.quantity <= 1}
              onClick={() => onUpdate(item._id, item.quantity - 1)}
            >
              <Minus size={16} />
            </button>

            <span className="w-6 text-center">
              {item.quantity}
            </span>

            <button
              onClick={() => onUpdate(item._id, item.quantity + 1)}
            >
              <Plus size={16} />
            </button>

          </div>

          <span className="font-semibold">
            ${(price * item.quantity).toFixed(2)}
          </span>

        </div>

      </div>

      <Button
        variant="ghost"
        onClick={() => onRemove(item._id)}
      >
        <Trash2 size={18} />
      </Button>

    </div>

  );
};

export default memo(CartItem);