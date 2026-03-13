export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
    >
      {children}
    </button>
  );
}