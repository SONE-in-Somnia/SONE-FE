"use client";

import React, { useEffect, useRef } from 'react';
import styles from '../styles/MatrixRain.module.css';

const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const background = containerRef.current;
    const sentences = [
      "<Somnia network is rock>",
      "<Let's get hyped on Somnia network>",
    ];
    
    const retroColors = [
      "#00FF00", // retro-green
      "#FFA500", // retro-orange
      "#FF0000", // retro-red
      "#FFFF00", // retro-yellow
      "#F764FF", // retro-pink
    ];

    const spacing = 150; // Increased spacing for longer sentences
    const streamCount = Math.floor(window.innerWidth / spacing);

    const totalStreamsWidth = streamCount * spacing;
    const offset = (window.innerWidth - totalStreamsWidth) / 2;

    // Clear any existing streams before adding new ones
    background.innerHTML = '';

    for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = styles.stream;
        
        // Pick a random sentence for each stream
        const randomSentenceIndex = Math.floor(Math.random() * sentences.length);
        stream.textContent = sentences[randomSentenceIndex];

        // Pick a random color for each stream
        const randomColorIndex = Math.floor(Math.random() * retroColors.length);
        stream.style.color = retroColors[randomColorIndex];

        stream.style.left = `${offset + i * spacing}px`;
        
        const randomDuration = Math.random() * 8 + 5;
        const randomDelay = Math.random() * -20;      
        
        stream.style.animationDuration = `${randomDuration}s`;
        stream.style.animationDelay = `${randomDelay}s`;
        
        background.appendChild(stream);
    }
  }, []);

  return <div id="matrix-background" ref={containerRef} className={styles.matrixBackground}></div>;
};

export default MatrixRain;

