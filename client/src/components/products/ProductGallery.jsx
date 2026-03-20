import { useState } from "react";
import { API_URL } from "../../utils/constants";

export default function ProductGallery({ variants }){

 const images =
  variants?.flatMap(v => v.images.map(i => i.url)) || [];

 const [active,setActive] = useState(images[0]);

 return(

  <div className="space-y-4">

   <img
    src={`${API_URL}${active}`}
    className="w-full h-[500px] object-cover rounded-xl"
   />

   <div className="flex gap-3 overflow-x-auto">

    {images.map((img,i)=>(
     <img
      key={i}
      src={`${API_URL}${img}`}
      onClick={()=>setActive(img)}
      className="w-20 h-20 object-cover border rounded cursor-pointer hover:scale-105 transition"
     />
    ))}

   </div>

  </div>

 );
}