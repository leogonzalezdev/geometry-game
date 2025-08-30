import React from 'react';

export default function StageToast({ text }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      {text}
    </div>
  );
}

