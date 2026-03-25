import { useState } from "react";
import { API_URL } from "../../utils/constants";

export default function ProductGallery({ variants }) {

  const images =
    variants?.flatMap(v => v.images.map(i => i.url)) || [];

  const [active, setActive] = useState(images[0]);

  return (

    <div className="flex gap-4">

      {/* THUMBNAILS (LEFT SIDE) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px]">

        {images.map((img, i) => (

          <img
            key={i}
            src={`${API_URL}${img}`}
            onClick={() => setActive(img)}
            className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition
              ${active === img
                ? "border-indigo-600"
                : "border-gray-200 hover:border-gray-400"}
            `}
          />

        ))}

      </div>

      {/* MAIN IMAGE */}
      <div className="flex-1 relative group bg-gray-100 rounded-xl overflow-hidden">

        <img
          src={`${API_URL}${active}`}
          className="w-full h-[500px] object-contain transition duration-300 group-hover:scale-110"
        />

        {/* ZOOM HINT */}
        <span className="absolute bottom-3 right-3 text-xs bg-black text-white px-2 py-1 rounded opacity-70">
          Hover to zoom 🔍
        </span>

      </div>

    </div>

  );
}