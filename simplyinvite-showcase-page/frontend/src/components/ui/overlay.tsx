import React from "react";

interface OverlayProps {
  onClick?: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ onClick }) => {
  return <div className="fixed inset-0 bg-black/70 z-40" onClick={onClick} />;
};

export default Overlay;
