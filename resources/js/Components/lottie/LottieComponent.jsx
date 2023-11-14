import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieComponent = ({ animationData ,height,width,loop,autoplay, }) => {
  const animationContainer = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current, // the dom element that will contain the animation
      renderer: 'svg',
      loop: loop,
      autoplay: autoplay,
      animationData: animationData // the animation data
    });

    return () => anim.destroy(); // optional clean up for unmounting
  }, [animationData]);

  return <div ref={animationContainer} style={{ height: height, width: width }} />;
};

export default LottieComponent;
