export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 font-medium">
          {label}
        </label>
      )}

      <input
        className="border rounded-lg p-2"
        {...props}
      />
    </div>
  );
}