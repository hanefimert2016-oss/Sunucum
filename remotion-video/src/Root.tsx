import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const cyan = '#6FF7FF';
const blue = '#4A74FF';
const violet = '#9A6CFF';
const ink = '#05070D';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const fadeWindow = (frame: number, start: number, end: number, fade = 20) =>
  clamp(
    Math.min(
      interpolate(frame, [start, start + fade], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
      interpolate(frame, [end - fade, end], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );

const GlowText: React.FC<{
  children: React.ReactNode;
  size: number;
  tracking?: number;
  opacity?: number;
}> = ({children, size, tracking = 8, opacity = 1}) => (
  <div
    style={{
      color: '#F8FDFF',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: size,
      fontWeight: 700,
      letterSpacing: tracking,
      textTransform: 'uppercase',
      textShadow: `0 0 12px ${cyan}, 0 0 32px ${blue}88`,
      opacity,
    }}
  >
    {children}
  </div>
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(circle at 50% 46%, transparent 18%, rgba(1,3,9,0.16) 48%, rgba(0,0,0,0.72) 100%)',
      boxShadow: 'inset 0 0 180px rgba(0,0,0,0.72)',
    }}
  />
);

const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  const stars = Array.from({length: 90}, (_, i) => {
    const x = (i * 131.7) % 1920;
    const baseY = (i * 83.3) % 1080;
    const speed = 0.15 + (i % 7) * 0.045;
    const y = (baseY + frame * speed) % 1080;
    const size = 1 + (i % 4) * 0.55;
    const alpha = 0.22 + ((i * 17) % 50) / 100;
    return {x, y, size, alpha};
  });

  return (
    <AbsoluteFill>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: 999,
            background: i % 6 === 0 ? cyan : '#D8E6FF',
            opacity: s.alpha,
            boxShadow: i % 6 === 0 ? `0 0 10px ${cyan}` : undefined,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const PerspectiveGrid: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 7) % 120;
  const glow = 0.35 + Math.sin(frame / 14) * 0.08;

  return (
    <div
      style={{
        position: 'absolute',
        left: -260,
        right: -260,
        bottom: -430,
        height: 790,
        transform: `perspective(900px) rotateX(63deg) translateY(${drift}px)`,
        transformOrigin: '50% 100%',
        opacity,
        overflow: 'hidden',
        maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
      }}
    >
      {Array.from({length: 17}, (_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: i * 55,
            height: 1,
            background: `rgba(86,229,255,${glow})`,
            boxShadow: `0 0 8px ${cyan}66`,
          }}
        />
      ))}
      {Array.from({length: 29}, (_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${(i / 28) * 100}%`,
            width: 1,
            background: 'rgba(89,124,255,0.24)',
            boxShadow: `0 0 6px ${blue}55`,
          }}
        />
      ))}
    </div>
  );
};

const Horizon: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();
  const pulse = 0.7 + Math.sin(frame / 10) * 0.18;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 570,
          height: 1,
          background: cyan,
          opacity: opacity * pulse,
          boxShadow: `0 0 18px ${cyan}, 0 0 60px ${blue}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '20%',
          right: '20%',
          top: 550,
          height: 80,
          background: `radial-gradient(ellipse at center, ${cyan}22, transparent 68%)`,
          opacity,
          filter: 'blur(12px)',
        }}
      />
    </>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeWindow(frame, 0, 155, 24);
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 50});
  const titleY = interpolate(enter, [0, 1], [42, 0]);
  const lineWidth = interpolate(frame, [18, 72], [0, 760], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.exp),
  });
  const subOpacity = interpolate(frame, [50, 82], [0, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity}}>
      <Horizon />
      <PerspectiveGrid opacity={0.45} />
      <div
        style={{
          position: 'absolute',
          top: 330,
          width: '100%',
          textAlign: 'center',
          transform: `translateY(${titleY}px) scale(${0.96 + enter * 0.04})`,
        }}
      >
        <GlowText size={112} tracking={18}>Neon Pulse</GlowText>
        <div
          style={{
            width: lineWidth,
            height: 2,
            margin: '26px auto 22px',
            background: `linear-gradient(90deg, transparent, ${cyan}, ${violet}, transparent)`,
            boxShadow: `0 0 22px ${cyan}`,
          }}
        />
        <div
          style={{
            color: '#BFD0E8',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 24,
            letterSpacing: 10,
            textTransform: 'uppercase',
            opacity: subOpacity,
          }}
        >
          Future Systems / Sequence 01
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeWindow(frame, 115, 360, 30);
  const local = frame - 115;
  const push = interpolate(local, [0, 230], [1.06, 1.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <AbsoluteFill style={{opacity, transform: `scale(${push})`}}>
      <Horizon opacity={0.85} />
      <PerspectiveGrid opacity={0.75} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 346,
          height: 340,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 10,
          padding: '0 150px',
        }}
      >
        {Array.from({length: 34}, (_, i) => {
          const target = 70 + ((i * 97) % 270);
          const build = spring({
            frame: local - i * 2,
            fps,
            config: {damping: 200, stiffness: 120},
            durationInFrames: 40,
          });
          const width = 24 + (i % 5) * 9;
          return (
            <div
              key={i}
              style={{
                width,
                height: target * build,
                border: `1px solid ${i % 3 === 0 ? cyan : '#6C7FFF'}99`,
                background:
                  i % 4 === 0
                    ? 'linear-gradient(to top, rgba(38,80,160,0.34), rgba(7,10,20,0.12))'
                    : 'linear-gradient(to top, rgba(14,35,84,0.48), rgba(3,7,17,0.05))',
                boxShadow: `0 0 ${10 + (i % 4) * 3}px ${i % 3 === 0 ? cyan : blue}44`,
                position: 'relative',
              }}
            >
              {Array.from({length: Math.max(1, Math.floor(target / 34))}, (_, w) => (
                <div
                  key={w}
                  style={{
                    position: 'absolute',
                    left: 6,
                    right: 6,
                    top: 10 + w * 27,
                    height: 2,
                    opacity: 0.34 + ((i + w) % 4) * 0.1,
                    background: i % 3 === 0 ? cyan : '#8BA1FF',
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
      {Array.from({length: 18}, (_, i) => {
        const x = (i * 121) % 1920;
        const y = ((local * (7 + (i % 5) * 2) + i * 77) % 1200) - 120;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: i % 4 === 0 ? 3 : 1,
              height: 80 + (i % 4) * 35,
              background: `linear-gradient(to bottom, transparent, ${i % 3 === 0 ? cyan : violet}, transparent)`,
              opacity: 0.18 + (i % 5) * 0.055,
              filter: 'blur(0.2px)',
            }}
          />
        );
      })}
      <div style={{position: 'absolute', left: 100, top: 110}}>
        <GlowText size={34} tracking={9} opacity={0.8}>City Grid</GlowText>
        <div style={{color: '#91A4C6', marginTop: 12, fontFamily: 'monospace', fontSize: 18, letterSpacing: 2}}>
          SECTOR 7A · NETWORK 99.8% · LATENCY 08MS
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EnergyCore: React.FC<{local: number}> = ({local}) => {
  const pulse = 1 + Math.sin(local / 6) * 0.035;
  const spin = local * 1.25;
  const spin2 = -local * 0.72;
  const beam = 0.52 + Math.sin(local / 4) * 0.12;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 430,
        height: 430,
        transform: `translate(-50%, -50%) scale(${pulse})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, #F4FFFF 0 3%, ${cyan} 4%, ${blue} 17%, rgba(20,39,100,0.42) 38%, transparent 67%)`,
          boxShadow: `0 0 35px ${cyan}, 0 0 110px ${blue}AA, 0 0 240px ${violet}55`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 38,
          borderRadius: '50%',
          border: `3px solid ${cyan}AA`,
          transform: `rotate(${spin}deg) scaleX(0.48)`,
          boxShadow: `0 0 22px ${cyan}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 64,
          borderRadius: '50%',
          border: `2px dashed ${violet}CC`,
          transform: `rotate(${spin2}deg) scaleY(0.62)`,
          boxShadow: `0 0 18px ${violet}`,
        }}
      />
      {Array.from({length: 16}, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 + local / 45;
        const r = 198 + (i % 4) * 16;
        const x = 215 + Math.cos(angle) * r;
        const y = 215 + Math.sin(angle) * r * 0.52;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 5 + (i % 3),
              height: 5 + (i % 3),
              borderRadius: 99,
              background: i % 2 === 0 ? cyan : violet,
              boxShadow: `0 0 14px ${i % 2 === 0 ? cyan : violet}`,
              opacity: 0.6 + (i % 4) * 0.08,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: -280,
          width: 8,
          height: 940,
          transform: 'translateX(-50%)',
          background: `linear-gradient(to bottom, transparent, ${cyan}, #fff, ${cyan}, transparent)`,
          opacity: beam,
          filter: 'blur(3px)',
          boxShadow: `0 0 28px ${cyan}`,
        }}
      />
    </div>
  );
};

const CoreScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeWindow(frame, 315, 535, 28);
  const local = frame - 315;
  const enter = spring({frame: local, fps, config: {damping: 16, stiffness: 90, mass: 1.8}, durationInFrames: 70});
  const scale = interpolate(enter, [0, 1], [0.28, 1]);
  const hud = interpolate(local, [45, 95], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 52%, rgba(24,59,120,0.38), rgba(5,7,13,0.88) 43%, #03050A 76%)',
        }}
      />
      <div style={{transform: `scale(${scale})`, width: '100%', height: '100%'}}>
        <EnergyCore local={local} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 125,
          top: 160,
          width: 520,
          opacity: hud,
        }}
      >
        <GlowText size={42} tracking={10}>Energy Core</GlowText>
        <div style={{marginTop: 20, height: 2, width: 400, background: `linear-gradient(90deg, ${cyan}, transparent)`}} />
        <div style={{fontFamily: 'monospace', color: '#A6BCDA', fontSize: 20, lineHeight: 1.85, marginTop: 18}}>
          OUTPUT&nbsp;&nbsp;&nbsp;&nbsp; 8.42 TW<br />
          STABILITY&nbsp; 99.8%<br />
          PHASE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOCKED<br />
          STATUS&nbsp;&nbsp;&nbsp;&nbsp; NOMINAL
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 110,
          bottom: 125,
          color: '#6F86A7',
          fontFamily: 'monospace',
          fontSize: 16,
          letterSpacing: 2,
          opacity: hud * 0.9,
        }}
      >
        CORE SYNCHRONIZATION // RUN 04
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeWindow(frame, 500, 600, 20);
  const local = frame - 500;
  const enter = spring({frame: local, fps, config: {damping: 200}, durationInFrames: 44});
  const glow = 0.7 + Math.sin(local / 5) * 0.16;
  const type = Math.floor(interpolate(local, [12, 75], [0, 27], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const phrase = 'TOMORROW IS ALREADY RUNNING';

  return (
    <AbsoluteFill style={{opacity, backgroundColor: '#02040A'}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 900,
          height: 900,
          transform: `translate(-50%, -50%) scale(${0.78 + enter * 0.22})`,
          borderRadius: 999,
          background: `radial-gradient(circle, ${cyan}18 0%, ${blue}0D 28%, transparent 64%)`,
          filter: 'blur(1px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 410,
          width: '100%',
          textAlign: 'center',
          opacity: enter,
        }}
      >
        <GlowText size={58} tracking={12} opacity={glow}>{phrase.slice(0, type)}</GlowText>
        <div
          style={{
            width: 150 + enter * 520,
            height: 2,
            margin: '28px auto 0',
            background: `linear-gradient(90deg, transparent, ${cyan}, ${violet}, transparent)`,
            boxShadow: `0 0 18px ${cyan}`,
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          width: '100%',
          textAlign: 'center',
          color: '#6B7E9B',
          fontFamily: 'monospace',
          letterSpacing: 5,
          fontSize: 16,
          opacity: enter * 0.85,
        }}
      >
        NEON PULSE / REMOTION × OPENMONTAGE
      </div>
    </AbsoluteFill>
  );
};

const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = (frame * 3.2) % 1080;
  return (
    <AbsoluteFill style={{backgroundColor: ink, overflow: 'hidden'}}>
      <Audio src={staticFile('score.wav')} volume={0.9} />
      <Stars />
      <IntroScene />
      <CityScene />
      <CoreScene />
      <FinalScene />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: 'rgba(111,247,255,0.09)',
          boxShadow: '0 0 8px rgba(111,247,255,0.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 4px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <Vignette />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={600} fps={30} width={1920} height={1080} />
);
