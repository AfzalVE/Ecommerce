import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import CategoryHeader from "../../shared/components/caegories/CategoryHeader";
import CategoryFilters from "../../shared/components/caegories/CategoryFilters";
import CategorySortBar from "../../shared/components/caegories/CaegorySortBar";
import CategoryProductGrid from "../../shared/components/caegories/CategoryProductGrid";
import Pagination from "../../shared/components/caegories/Pagination";

export default function CategoryPage() {
  const { categoryId } = useParams(); // ✅ get categoryId from URL
  const [searchParams] = useSearchParams();
  const [total, setTotal] = useState(0);

  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || 1;

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Pass categoryId to header and product grid */}
      <CategoryHeader categoryId={categoryId} total={total} />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-4">
        <div className="col-span-3 sticky top-20 h-fit">
          <CategoryFilters />
        </div>

        <div className="col-span-9">
          <CategorySortBar total={total} />
          <CategoryProductGrid
            categoryId={categoryId}
            sort={sort}
            page={page}
            setTotal={setTotal}
          />
          <Pagination />
        </div>
      </div>
    </div>
  );
}