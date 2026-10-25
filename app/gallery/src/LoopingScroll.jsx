import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { getLoopPosition } from './loop.mjs';

export function LoopingScroll({ children }) {
  const scroll = useScroll();
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Preserve native touch momentum, but omit extra scene lag in reduced motion.
  useFrame(() => {
    if (reducedMotion) scroll.offset = scroll.scroll.current;
  }, -1);

  return children;
}

export function LoopItem({ anchor, length, children }) {
  const group = useRef();
  const scroll = useScroll();

  useFrame(() => {
    // Children keep all their original positions, materials, lights and text.
    // Reuse each exhibit rather than tripling the scene and its shadow lights.
    group.current.position.x = getLoopPosition(anchor, scroll.offset, length) - anchor;
  });

  return <group ref={group} name={`loop-slot-${anchor}`}>{children}</group>;
}
