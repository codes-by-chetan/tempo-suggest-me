import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-background rounded-lg overflow-hidden shadow-sm border border-border animate-pulse">
      <div className="w-full h-40 bg-muted"></div>
      <div className="p-4">
        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;