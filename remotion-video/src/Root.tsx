import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';

const Main: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#111', color: 'white', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', fontSize: 80}}>
    Remotion hazır
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={150} fps={30} width={1920} height={1080} />
);
