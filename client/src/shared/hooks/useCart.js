import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation
} from "../../modules/cart/cartApi";

export const useCart = () => {

  const {
  data,
  isLoading,
  isFetching,
  error,
  refetch
} = useGetCartQuery(undefined, {
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,      // 🔥 ADD THIS
  refetchOnReconnect: true   // 🔥 ADD THIS
});

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
    isLoading: isLoading || isFetching, // ✅ smoother UI
    error,
    refetch, // ✅ expose this
    removeItem,
    updateItem,
    clearCart
  };
};