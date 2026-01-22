import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export function HappenlyLogo({ size = 56 }: { size?: number }) {
  const w = size;
  const h = size;

  return (
    <Svg width={w} height={h} viewBox="0 0 64 64" fill="none" accessibilityLabel="Happenly logo">
      <Circle cx="18" cy="18" r="4" fill="#6C63FF" />
      <Circle cx="46" cy="46" r="4" fill="#00C2A8" />

      <Path
        d="M18 46V22c0-2.2 1.8-4 4-4s4 1.8 4 4v8h12v-8c0-2.2 1.8-4 4-4s4 1.8 4 4v24c0 2.2-1.8 4-4 4s-4-1.8-4-4v-8H26v8c0 2.2-1.8 4-4 4s-4-1.8-4-4Z"
        fill="#111827"
      />
    </Svg>
  );
}
