export default function ProductSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg animate-pulse space-y-3">
      <div className="h-40 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}