import React from "react";

function ImagePreview({ prev }) {
  if (!prev) return null;
  return <img src={prev} className="w-24 h-20 rounded mb-2" alt="Preview" />;
}

export default ImagePreview;
