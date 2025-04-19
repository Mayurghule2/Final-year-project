"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

interface SparklesCoreProps {
  id?: string;
  background?: "transparent" | string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  className?: string;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.5,
  maxSize = 1.5,
  particleDensity = 100,
  particleColor = "#FFFFFF",
  className = "",
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [init, setInit] = useState(false);

  const updateDimensions = useCallback(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    const initParticles = async () => {
      if (dimensions.width > 0 && dimensions.height > 0) {
        await import("tsparticles-slim");
        const particles = await import("tsparticles-slim");
        await particles.load(id, {
          fullScreen: {
            enable: false,
            zIndex: -1,
          },
          particles: {
            number: {
              value: Math.floor((dimensions.width * dimensions.height * particleDensity) / 10000),
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: particleColor,
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.5,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: { min: minSize, max: maxSize },
              random: true,
              anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
            },
          },
          retina_detect: true,
        });
        setInit(true);
      }
    };

    initParticles();
  }, [dimensions, id, maxSize, minSize, particleColor, particleDensity]);

  return (
    <div
      id={id}
      className={`absolute inset-0 -z-10 ${className}`}
      style={{
        backgroundColor: background,
        opacity: init ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    />
  );
};