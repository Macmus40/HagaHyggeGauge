
import React from 'react';

interface GaugeSwatchProps {
  stitchesLabel: string;
  rowsLabel: string;
  width: string;
  height: string;
}

const STITCH_COUNT = 10;
const ROW_COUNT = 10;
const STITCH_WIDTH = 10;
const ROW_HEIGHT = 10;
const MAX_DIMENSION = 160; // The maximum width or height of the swatch in pixels

// A simple 'v' shape for a single crochet stitch
const stitchPath = `m 0 0 l ${STITCH_WIDTH / 2} ${ROW_HEIGHT} l ${STITCH_WIDTH / 2} -${ROW_HEIGHT} z`;

export const GaugeSwatch: React.FC<GaugeSwatchProps> = ({ stitchesLabel, rowsLabel, width, height }) => {

  const numWidth = parseFloat(width);
  const numHeight = parseFloat(height);

  let displayWidth = MAX_DIMENSION;
  let displayHeight = MAX_DIMENSION;

  if (!isNaN(numWidth) && numWidth > 0 && !isNaN(numHeight) && numHeight > 0) {
    const aspectRatio = numWidth / numHeight;
    if (aspectRatio > 1) {
      // Wider than it is tall
      displayHeight = MAX_DIMENSION / aspectRatio;
    } else {
      // Taller than it is wide
      displayWidth = MAX_DIMENSION * aspectRatio;
    }
  } else {
    // Default to a square if inputs are invalid or empty
    displayWidth = MAX_DIMENSION;
    displayHeight = MAX_DIMENSION;
  }
  
  const viewBoxWidth = STITCH_COUNT * STITCH_WIDTH + 40;
  const viewBoxHeight = ROW_COUNT * ROW_HEIGHT + 40;

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center" 
      aria-hidden="true"
    >
      <div 
        className="relative transition-all duration-300 ease-in-out" 
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px`}}
      >
        <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
            className="absolute inset-0"
            preserveAspectRatio="none"
        >
          {/* Swatch Body */}
          <rect 
            x="20" 
            y="20" 
            width={STITCH_COUNT * STITCH_WIDTH} 
            height={ROW_COUNT * ROW_HEIGHT} 
            rx="8" 
            className="fill-brand-bg stroke-brand-accent" 
            strokeWidth="2"
          />

          {/* Crochet stitch texture */}
          <g className="fill-brand-soft-accent/60 stroke-brand-soft-accent/60" strokeWidth="0.5">
            {Array.from({ length: ROW_COUNT }).map((_, rowIndex) => (
              <g key={rowIndex} transform={`translate(20, ${20 + rowIndex * ROW_HEIGHT})`}>
                {Array.from({ length: STITCH_COUNT }).map((_, stitchIndex) => (
                  <path 
                    key={stitchIndex} 
                    d={stitchPath} 
                    transform={`translate(${stitchIndex * STITCH_WIDTH + (rowIndex % 2 === 0 ? 0 : STITCH_WIDTH / 2)}, 0)`}
                    style={{transformBox: 'fill-box', transformOrigin: 'center'}}
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>
        
        {/* Top Measurement Line & Label */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] flex flex-col items-center text-brand-primary text-xs">
          <span>{stitchesLabel}</span>
          <svg width="100%" height="10" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M 0 5 L 100 5" stroke="currentColor" strokeWidth="1"/>
            <path d="M 0 0 L 0 10 M 100 0 L 100 10" stroke="currentColor" strokeWidth="1"/>
            <path d="M 5 5 L 0 2 L 0 8 z M 95 5 L 100 2 L 100 8 z" fill="currentColor"/>
          </svg>
        </div>

        {/* Side Measurement Line & Label */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 h-[calc(100%-1.25rem)] flex items-center text-brand-primary text-xs">
          <span className="-rotate-90 whitespace-nowrap">{rowsLabel}</span>
           <svg height="100%" width="10" viewBox="0 0 10 100" preserveAspectRatio="none" className="ml-1">
            <path d="M 5 0 L 5 100" stroke="currentColor" strokeWidth="1"/>
            <path d="M 0 0 L 10 0 M 0 100 L 10 100" stroke="currentColor" strokeWidth="1"/>
            <path d="M 5 5 L 2 0 L 8 0 z M 5 95 L 2 100 L 8 100 z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
};