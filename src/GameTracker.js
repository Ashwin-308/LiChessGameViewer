import { DotLottie } from "https://esm.sh/@lottiefiles/dotlottie-web";
import { useEffect, useRef, useState } from "react";

function GameTracker({isOn,onToggle}) {
  const canvasRef = useRef(null);
  const [dotLottie, setDotLottie] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const instance = new DotLottie({
        autoplay: false,
        loop: false,
        canvas: canvasRef.current,
        src: "https://lottie.host/54b74e43-a306-4fff-8541-f9457c044908/2pFBgFbhMk.lottie",
      });
      setDotLottie(instance);

      return () => instance.destroy();
    }
  }, []);

  const playAnimation = () => {
    if (!dotLottie) return;

  ;

    if (!isOn) {
      // Play forward
      dotLottie.setSegment(0, 30);
      dotLottie.setSpeed(3)
      dotLottie.play();
    } else {
      // Play backward
      dotLottie.setSegment(30,60);
      dotLottie.setSpeed(3);
      dotLottie.play();
    }

    onToggle(!isOn);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="dotlottie-canvas"
        style={{ width: "50px", height: "50px" }}
        onClick={playAnimation}
      ></canvas>
     
    </div>
  );
}

export default GameTracker;
