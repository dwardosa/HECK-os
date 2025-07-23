import React from "react";
import type { DesktopFile } from "~/types/desktopFile";

interface DesktopFileProps extends DesktopFile {
  onDoubleClick: (file: DesktopFile) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function DesktopFile({
  id,
  name,
  type,
  content,
  imageSrc,
  x,
  y,
  icon,
  onDoubleClick,
  selected,
  onSelect
}: DesktopFileProps) {
  const handleDoubleClick = () => {
    onDoubleClick({ id, name, type, content, imageSrc, x, y, icon });
  };

  return (
    <div
      className={`absolute flex flex-col items-center cursor-pointer select-none p-2 rounded ${
        selected ? "bg-blue-500 bg-opacity-50" : "hover:bg-white hover:bg-opacity-10"
      }`}
      style={{ left: x, top: y }}
      onDoubleClick={handleDoubleClick}
      onClick={() => onSelect(id)}
    >
      <img src={icon} alt={name} className="w-12 h-12 mb-1" draggable={false} />
      <span className="text-white text-xs text-center max-w-16 truncate">{name}</span>
    </div>
  );
}
