// 2. The Weathered Blueprint Grid
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export default function WeatheredGridBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      
      {/* Tactile Grid System */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.09] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Structural Micro-Grain Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.09] mix-blend-multiply dark:opacity-[0.1] dark:mix-blend-screen dark:invert">
        <filter id="blueprint-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noisy" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3.5 -1.2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#blueprint-grain)" />
      </svg>

      {/* Neon Targeting Vector Spotlight */}
      <motion.div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(20, 184, 165, 0.14),
              rgba(16, 185, 129, 0.02) 50%,
              transparent 80%
            )
          `,
        }}
      />
    </div>
  );
}

// // Original Grid
// import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
// import { useEffect } from "react";

// export default function FancyBackground() {
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   useEffect(() => {
//     function handleMouseMove(e: MouseEvent) {
//       mouseX.set(e.clientX);
//       mouseY.set(e.clientY);
//     }
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [mouseX, mouseY]);

//   return (
//     <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
//       {/* Sharp Grid Patterns */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_2px,transparent_2px),linear-gradient(to_bottom,#8080800a_2px,transparent_2px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff03_2px,transparent_2px),linear-gradient(to_bottom,#ffffff03_2px,transparent_2px)]" />
      
//       {/* Hover Spotlight Tracking Layer */}
//       <motion.div
//         className="absolute inset-0 transition-opacity duration-300"
//         style={{
//           background: useMotionTemplate`
//             radial-gradient(
//               500px circle at ${mouseX}px ${mouseY}px,
//               rgba(20, 184, 165, 0.12),
//               transparent 80%
//             )
//           `,
//         }}
//       />
//     </div>
//   );
// }

// // Smoth Noise
// import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
// import { useEffect } from "react";

// export default function FineMatteBackground() {
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   useEffect(() => {
//     function handleMouseMove(e: MouseEvent) {
//       mouseX.set(e.clientX);
//       mouseY.set(e.clientY);
//     }
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [mouseX, mouseY]);

//   return (
//     <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      
//       {/* 
//         Perfectly Balanced Video Editor Surface Roughness
//         - Light Mode: Creates a subtle, crisp matte texture at 7% opacity.
//         - Dark Mode: Inverts to a fine, sharp silver micro-glow at 4% opacity.
//       */}
//       <svg 
//         className="absolute inset-0 w-full h-full opacity-[0.12] mix-blend-multiply dark:opacity-[0.12] dark:mix-blend-screen dark:invert transition-all duration-300"
//       >
//         <filter id="balanced-grain">
//           <feTurbulence 
//             type="fractalNoise" 
//             baseFrequency="0.95" 
//             numOctaves="4" 
//             result="noisy" 
//           />
//           {/* 
//             Maintains the ultra-sharp contrast curve [4.0 -1.5] so the grains 
//             stay pixel-perfect, without turning into blurry clouds.
//           */}
//           <feColorMatrix 
//             type="matrix" 
//             values="0 0 0 0 0  
//                     0 0 0 0 0  
//                     0 0 0 0 0  
//                     0 0 0 4.0 -1.5" 
//           />
//         </filter>
//         <rect width="100%" height="100%" filter="url(#balanced-grain)" />
//       </svg>

//       {/* Dynamic Tracking Spotlight */}
//       <motion.div
//         className="absolute inset-0 transition-opacity duration-300"
//         style={{
//           background: useMotionTemplate`
//             radial-gradient(
//               550px circle at ${mouseX}px ${mouseY}px,
//               rgba(20, 184, 165, 0.15),
//               transparent 80%
//             )
//           `,
//         }}
//       />
//     </div>
//   );
// }

// // The Topographic Fluid Map (Macro Roughness)
// import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
// import { useEffect } from "react";

// export default function TopoFluidBackground() {
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   useEffect(() => {
//     function handleMouseMove(e: MouseEvent) {
//       mouseX.set(e.clientX);
//       mouseY.set(e.clientY);
//     }
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [mouseX, mouseY]);

//   return (
//     <div className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      
//       {/* 
//         Macro Topo/Fluid Strata Layer
//         Low baseFrequency (0.015) creates sweeping visual bands instead of tight dust.
//       */}
//       <svg className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-multiply dark:opacity-[0.03] dark:mix-blend-screen dark:invert">
//         <filter id="topo-fluid">
//           <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
//           {/* High scaling factors pinch the gradients into clean, high-contrast ridges */}
//           <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 5.0 -2.2" />
//         </filter>
//         <rect width="100%" height="100%" filter="url(#topo-fluid)" />
//       </svg>

//       {/* Soft Ambient Heatwave Spotlight */}
//       <motion.div
//         className="absolute inset-0 transition-opacity duration-300"
//         style={{
//           background: useMotionTemplate`
//             radial-gradient(
//               700px circle at ${mouseX}px ${mouseY}px,
//               rgba(20, 184, 165, 0.16),
//               rgba(99, 102, 241, 0.04) 60%,
//               transparent 90%
//             )
//           `,
//         }}
//       />
//     </div>
//   );
// }