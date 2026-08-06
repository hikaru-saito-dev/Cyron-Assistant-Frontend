import React, { useRef, useEffect } from "react";

/** Inline Noise overlay */
interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

export const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      // Cover viewport
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0"
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export function NoiseBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-neutral-950">
      {/* spotlight */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_560px_at_50%_220px,#22d3ee33,transparent_70%)]" />
      {/* grid with top fade mask */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,#64748b3a_1px,transparent_1px),linear-gradient(to_bottom,#64748b3a_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_90%_60%_at_50%_20%,#000_70%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_90%_60%_at_50%_20%,#000_70%,transparent_100%)] [mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]" />
      <Noise patternAlpha={18} />
    </div>
  );
}
