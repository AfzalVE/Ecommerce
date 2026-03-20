export default function PageContainer({ children }) {

  return (

    <div className="w-full min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 py-8">

        {children}

      </div>

    </div>

  );
}