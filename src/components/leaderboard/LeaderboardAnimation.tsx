"use client";
import React from 'react';
import styled, { keyframes } from 'styled-components';

const lateral = keyframes`
  from {
    transform: translateX(12%);
  }
  to {
    transform: translateX(-12%);
  }
`;

const blockIntro = keyframes`
  40% {
    transform: rotate(0deg) translate3d(0, 0, 0) rotate3d(1, 0, 0, -90deg) rotate3d(0, 1, 0, 90deg);
    animation-timing-function: cubic-bezier(.95, .05, .8, .04);
  }
  70% {
    transform: rotate(0deg) translate3d(0, 0, 0) rotate3d(1, 0, 0, -90deg) rotate3d(0, 1, 0, 90deg);
    animation-timing-function: linear;
  }
  80% {
    transform: rotate(0deg) translate3d(0, 0, 0) rotate3d(1, 0, 0, 0deg) rotate3d(0, 1, 0, 0deg);
    animation-timing-function: linear;
  }
  100% {
    transform: rotate(0deg) translate3d(150vw, 0, 0) rotate3d(1, 0, 0, 0deg) rotate3d(0, 1, 0, 0deg);
    animation-timing-function: ease-out;
  }
`;

const shimmer = keyframes`
  from, 25% {
    transform: scale(2, 1) rotate(-45deg) translate(-100%);
  }
  35%, to {
    transform: scale(2, 1) rotate(-45deg) translate(0%);
  }
`;

const LeaderboardContainer = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(11, 1fr); /* Changed to 11 for LEADERBOARD */
  animation: ${lateral} 15000ms linear infinite both;
  animation-delay: 625ms;
`;

const Letter = styled.div`
  display: grid;
  grid-gap: 2px;
`;

const L = styled(Letter)`
  grid-template-areas:
    "a1 . ."
    "a2 . ."
    "a3 . ."
    "a4 . ."
    "a5 a6 a7";
`;

const E = styled(Letter)`
  grid-template-areas:
    "a1 a6 a9"
    "a2 . ."
    "a3 a7 a10"
    "a4 . ."
    "a5 a8 a11";
`;

const A = styled(Letter)`
  grid-template-areas:
    ". a1 ."
    "a2 . a7"
    "a3 . a8"
    "a4 a6 a9"
    "a5 . a10";

  > :nth-child(2) {
    left: 12.5px;
    position: relative;
  }
  > :nth-child(7) {
    left: -12.5px;
    position: relative;
  }
`;

const D = styled(Letter)`
  grid-template-areas:
    "a1 a6 a8"
    "a2 . a9"
    "a3 . a10"
    "a4 . a11"
    "a5 a7 .";
  > :nth-child(n + 8) {
    top: 12.5px;
    position: relative;
  }
`;

const R = styled(Letter)`
  grid-template-areas:
    "a1 a6 a8"
    "a2 . a9"
    "a3 a7 ."
    "a4 . a10"
    "a5 . a11";

  > :nth-child(8),
  > :nth-child(9) {
    top: 12.5px;
    position: relative;
  }
  > :nth-child(10) {
    left: -12.5px;
    position: relative;
  }
`;

const B = styled(Letter)`
  grid-template-areas:
    "a1 a6 a9"
    "a2 . a10"
    "a3 a7 a11"
    "a4 . a12"
    "a5 a8 a13";
`;

const O = styled(Letter)`
  grid-template-areas:
    ". a1 ."
    "a2 . a5"
    "a3 . a6"
    "a4 . a7"
    ". a8 .";
`;

const Block = styled.div<{ index: number; angle: number; sign: number }>`
  --ratio: calc(${props => props.index} / 100);
  --delay: calc(calc(var(--ratio) * 625ms) + 625ms);

  transform-style: preserve-3d;
  transform: rotate(calc(${props => props.angle} * 1deg)) translate3d(calc(${props => props.sign} * 200vw), 0, 0) rotate3d(1, 0, 0, -90deg) rotate3d(0, 1, 0, 90deg);
  animation-name: ${blockIntro};
  animation-timing-function: ease-in;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-delay: var(--delay);
  animation-direction: reverse;
  animation-duration: 15000ms;
  position: relative;
  z-index: -1;
  height: 15px;
  width: 15px;
  will-change: transform;
`;

const Face = styled.div`
  display: block;
  position: absolute;
  background-color: #2e92de;
  backface-visibility: visible;
  width: 15px;
  height: 15px;
  border: solid 1px #2f454f;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Face1 = styled(Face)`
  transform-origin: bottom center;
`;

const Face2 = styled(Face)`
  transform: rotateX(-90deg);
  transform-origin: bottom center;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    background-color: #00d2ff99;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    animation: ${shimmer} 15000ms linear;
    animation-delay: var(--delay);
    animation-fill-mode: both;
    animation-iteration-count: infinite;
  }
`;

const Face3 = styled(Face)`
  transform: rotateY(90deg);
  transform-origin: right center;
`;

const LeaderboardAnimation = () => {
  let t = -1;

  const renderBlocks = (count: number, angleFn: (i: number) => number) => {
    return Array.from({ length: count }).map((_, n) => {
      t++;
      return (
        <Block
          key={t}
          style={{ gridArea: `a${n + 1}` }}
          index={t}
          angle={angleFn(t)}
          sign={t % 2 ? 1 : -1}
        >
          <Face1 className="face face-1" />
          <Face2 className="face face-2" />
          <Face3 className="face face-3" />
        </Block>
      );
    });
  };

  return (
    <LeaderboardContainer>
      <L className="letter">
        {renderBlocks(7, (i) => (147 * i) % 360)}
      </L>
      <E className="letter">
        {renderBlocks(11, (i) => (-147 * i) % 360)}
      </E>
      <A className="letter">
        {renderBlocks(10, (i) => (147 * i) % 360)}
      </A>
      <D className="letter">
        {renderBlocks(11, (i) => (-147 * i) % 360)}
      </D>
      <E className="letter">
        {renderBlocks(11, (i) => (147 * i) % 360)}
      </E>
      <R className="letter">
        {renderBlocks(11, (i) => (-147 * i) % 360)}
      </R>
      <B className="letter">
        {renderBlocks(13, (i) => (147 * i) % 360)}
      </B>
      <O className="letter">
        {renderBlocks(8, (i) => (-147 * i) % 360)}
      </O>
      <A className="letter">
        {renderBlocks(10, (i) => (147 * i) % 360)}
      </A>
      <R className="letter">
        {renderBlocks(11, (i) => (-147 * i) % 360)}
      </R>
      <D className="letter">
        {renderBlocks(11, (i) => (147 * i) % 360)}
      </D>
    </LeaderboardContainer>
  );
};

export default LeaderboardAnimation;