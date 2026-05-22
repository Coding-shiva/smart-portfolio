import React from 'react';

export const TextSkeleton = ({ lines = 3, height = '16px', className = '' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }} className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height,
            width: i === lines - 1 && lines > 1 ? '70%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card skeleton-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '24px', width: '60%' }} />
      <TextSkeleton lines={2} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="skeleton" style={{ height: '32px', width: '80px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '32px', width: '80px', borderRadius: '4px' }} />
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 3 }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '24px',
      width: '100%',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
