import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef, useState } from "react";

function Celebrations({isstatus}) {
  const canvasRef = useRef(null);
  const [dotLottie, setDotLottie] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const instance = new DotLottie({
        autoplay: false,
        loop: false,
        canvas: canvasRef.current,
        src: "https://lottie.host/408cc6ec-49ce-4d4d-9e45-4f672a84ebef/Hmp5TYwJeS.lottie",
      });
      setDotLottie(instance);

      return () => instance.destroy();
    }
  }, []);
  useEffect(() => {
  if (!dotLottie) return;

  if (isstatus === "mate" || isstatus === "resign") {
    dotLottie.play();
  }
}, [isstatus, dotLottie]); 

  return(
    <div className = "overlay-canvas">
        <canvas
           ref = {canvasRef}
           id = "dotLottie-canvas"
           style = {{width: "500px", height: "500px"}}>
            
           </canvas>
      </div>
  );
}
export default Celebrations;