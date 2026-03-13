import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation
} from "../cart/cartApi";

export const useCart = () => {
  const { data, isLoading, error } = useGetCartQuery();

  const [removeItem] = useRemoveFromCartMutation();
  const [updateItem] = useUpdateCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const items = data?.cart?.items ?? [];

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.finalPrice || item.priceSnapshot || 0) * item.quantity,
    0
  );

  return {
    items,
    subtotal,
    isLoading,
    error,
    removeItem,
    updateItem,
    clearCart
  };
};