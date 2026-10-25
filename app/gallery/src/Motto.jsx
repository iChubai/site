import React from 'react';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// The local handwritten font is subset to these Chinese characters.
const CHINESE_LINES = ['一以贯之的努力', '不得懈怠的人生'];
const ENGLISH_LINES = ['Unwavering effort.', 'A life of tireless dedication.'];
const CHINESE_SIZE = 0.18;

export default function Motto({ textScale }) {
  const width = useThree(state => state.viewport.width);
  // Keep the seven-character Chinese lines inside narrow phone viewports.
  const scale = Math.min(textScale, width * 0.82 / (7 * CHINESE_SIZE));

  return (
    <>
      {CHINESE_LINES.map((line, index) => (
        <Text
          key={line}
          position={[0, scale * (0.2 - index * 0.2), 0]}
          scale={[scale, scale, scale]}
          fontSize={CHINESE_SIZE}
          sdfGlyphSize={128}
          color={index === 0 ? '#94A6FF' : '#FBA90A'}
          anchorX="center"
          anchorY="middle"
          font="../fonts/long-cang-motto.woff"
          castShadow
        >
          {line}
        </Text>
      ))}
      <Text
        position={[0, -scale * 0.2, 0]}
        scale={[scale, scale, scale]}
        fontSize={0.08}
        lineHeight={1.45}
        color="#c9cbd1"
        anchorX="center"
        anchorY="top"
        textAlign="center"
        font="../fonts/sacramento.woff"
      >
        {ENGLISH_LINES.join('\n')}
      </Text>
    </>
  );
}
