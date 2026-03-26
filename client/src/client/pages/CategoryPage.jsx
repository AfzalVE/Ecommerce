import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import CategoryHeader from "../../shared/components/caegories/CategoryHeader";
import CategoryFilters from "../../shared/components/caegories/CategoryFilters";
import CategorySortBar from "../../shared/components/caegories/CaegorySortBar";
import CategoryProductGrid from "../../shared/components/caegories/CategoryProductGrid";


export default function CategoryPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const [total, setTotal] = useState(0);

  // ✅ safer parsing
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  // ✅ KEY FIX → normalize category
  const normalizedCategoryId = categoryId || null;

  return (
    <div className="bg-gray-100 min-h-screen">
      
      {/* ✅ Works for BOTH cases */}
      <CategoryHeader
        categoryId={normalizedCategoryId}
        total={total}
      />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-4">
        
        <div className="col-span-3 sticky top-20 h-fit">
          <CategoryFilters />
        </div>

        <div className="col-span-9">
          <CategorySortBar total={total} />

          <CategoryProductGrid
            categoryId={normalizedCategoryId} // ✅ important
            sort={sort}
            page={page}
            setTotal={setTotal}
          />

         
        </div>
      </div>
    </div>
  );
}