import { useState } from "react";

export default function ProductGallery({ variants }){

 const images =
  variants?.flatMap(v => v.images.map(i => i.url)) || [];

 const [active,setActive] = useState(images[0]);

 return(

  <div className="space-y-4">

   <img
    src={`http://localhost:5000${active}`}
    className="w-full h-[500px] object-cover rounded-xl"
   />

   <div className="flex gap-3 overflow-x-auto">

    {images.map((img,i)=>(
     <img
      key={i}
      src={`http://localhost:5000${img}`}
      onClick={()=>setActive(img)}
      className="w-20 h-20 object-cover border rounded cursor-pointer hover:scale-105 transition"
     />
    ))}

   </div>

  </div>

 );
}