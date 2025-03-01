"use client";;
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PulseBeams = ({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = "var(--slate-800)",
  accentColor = "var(--slate-600)",
  gradientColors
}) => {
  return (
    (<div
      className={cn(
        "w-full h-screen relative flex items-center justify-center antialiased overflow-hidden",
        className
      )}>
      {background}
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <SVGs
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors} />
      </div>
    </div>)
  );
};

const SVGs = ({ beams, width, height, baseColor, accentColor, gradientColors }) => {
  return (
    (<svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex flex-shrink-0">
      {beams.map((beam, index) => (
        <React.Fragment key={index}>
          <path d={beam.path} stroke={baseColor} strokeWidth="1" />
          <path
            d={beam.path}
            stroke={`url(#grad${index})`}
            strokeWidth="2"
            strokeLinecap="round" />
          {beam.connectionPoints?.map((point, pointIndex) => (
            <circle
              key={`${index}-${pointIndex}`}
              cx={point.cx}
              cy={point.cy}
              r={point.r}
              fill={baseColor}
              stroke={accentColor} />
          ))}
        </React.Fragment>
      ))}
      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={index}
            id={`grad${index}`}
            gradientUnits="userSpaceOnUse"
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition}>
            <GradientColors colors={gradientColors} />
          </motion.linearGradient>
        ))}
      </defs>
    </svg>)
  );
};

const GradientColors = ({ colors = {
  start: "#18CCFC",
  middle: "#6344F5",
  end: "#AE48FF"
} }) => {
  return (<>
    <stop offset="0%" stopColor={colors.start} stopOpacity="0" />
    <stop offset="20%" stopColor={colors.start} stopOpacity="1" />
    <stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
    <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
  </>);
};