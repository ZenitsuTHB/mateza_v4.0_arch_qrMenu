// src/components/WelcomeAnimation/WelcomeAnimation.jsx

import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import './css/welcomeAnimation.css';

const WelcomeAnimation = ({ onComplete }) => {
  const sketchRef = useRef();
  const [showMessage, setShowMessage] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Constants for adjustable parameters
  const DURATION = 4000; // Animation duration in ms
  const NUM_SHAPES = 10; // Number of squares
  const MAX_SCALE = 20; // Maximum zoom scale
  const ROTATION_SPEED = 0.5; // Rotation speed multiplier
  const COLOR_BRIGHTNESS = 100; // Brightness of colors (0 - 100)

  useEffect(() => {
    let animationEnded = false;

    const sketch = (p) => {
      let startTime;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        p.noFill();
        p.colorMode(p.HSB, 360, 100, 100); // HSB color mode
        startTime = p.millis();
      };

      p.draw = () => {
        const elapsedTime = p.millis() - startTime;

        // Calculate normalized progress (0 to 1)
        const progress = p.constrain(elapsedTime / DURATION, 0, 1);

        // Clear background to white
        p.background(255);

        // Easing function for smooth zoom (easeInOutCubic)
        const easeInOutCubic = (t) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const easedProgress = easeInOutCubic(progress);

        // Calculate the scaling factor for steady zoom
        const scaleFactor = p.lerp(1, MAX_SCALE, easedProgress);

        // Slow down rotation
        const rotationSpeed = ROTATION_SPEED * easedProgress * p.TWO_PI;

        for (let i = 0; i < NUM_SHAPES; i++) {
          const t = i / NUM_SHAPES;

          // Size decreases with each shape
          const size = p.map(t, 0, 1, p.min(p.width, p.height), 0);

          // Each shape rotates slightly more than the last
          const rotation = rotationSpeed * t;

          p.push();
          // Translate to center
          p.translate(p.width / 2, p.height / 2);
          // Apply steady zoom
          p.scale(scaleFactor);
          // Rotate
          p.rotate(rotation);

          // Set stroke color with vibrant hues
          const hue = p.map(i, 0, NUM_SHAPES, 0, 360);
          p.stroke(hue, 100, COLOR_BRIGHTNESS);

          // Draw rounded rectangle
          p.rect(0, 0, size, size, size / 10);
          p.pop();
        }

        if (progress >= 1 && !animationEnded) {
          animationEnded = true;
          p.noLoop();
          setShowMessage(true);
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myp5 = new p5(sketch, sketchRef.current);

    return () => {
      myp5.remove();
    };
  }, []);

  const handleButtonClick = () => {
    setAnimationComplete(true);
    onComplete(); // Notify parent component to proceed to the next step
  };

  return (
    <div className="welcome-animation-container">
      <div ref={sketchRef}></div>
      {showMessage && (
        <div className="welcome-message">
          <h1>Welkom bij Mateza Booking 4.0</h1>
        </div>
      )}
    </div>
  );
};

export default WelcomeAnimation;
