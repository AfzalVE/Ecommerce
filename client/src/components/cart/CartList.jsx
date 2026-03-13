import CartItem from "./CartItem";

const CartList = ({ items, onUpdate, onRemove }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;