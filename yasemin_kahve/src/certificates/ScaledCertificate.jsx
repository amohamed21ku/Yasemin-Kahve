// ScaledCertificate.jsx - on-screen certificate preview, scaled to the available width
import React, { useLayoutEffect, useRef, useState } from 'react';
import Certificate from './Certificate';
import { DESIGNS } from './certificateDesign';

/* ---------- On-screen preview, scaled to the available width ---------- */
const ScaledCertificate = ({ cert, qrDataUrl, maxHeight }) => {
  const box = useRef(null);
  const [scale, setScale] = useState(0.5);
  const { width, height } = DESIGNS[cert.design] || DESIGNS.modern;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const update = () => {
      let s = el.clientWidth / width;
      if (maxHeight) s = Math.min(s, maxHeight / height);
      setScale(s > 0 ? s : 0.5);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, maxHeight]);

  return (
    <div ref={box} className="ykc-scaled" style={{ height: height * scale, maxWidth: maxHeight ? (maxHeight * width) / height : undefined, margin: '0 auto' }}>
      <div className="ykc-scaled-inner" style={{ transform: `scale(${scale})` }}>
        <Certificate cert={cert} qrDataUrl={qrDataUrl} />
      </div>
    </div>
  );
};

export default ScaledCertificate;
