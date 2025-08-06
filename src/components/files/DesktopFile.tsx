import React from "react";
import type { DesktopFile } from "~/types/DesktopFile";

interface DesktopFileProps extends DesktopFile {
  onFileClick: (file: DesktopFile) => void;
  selected: boolean;
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
  onFileClick,
  selected
}: DesktopFileProps) {
  return (
    <div
      className={`absolute z-60 flex flex-col items-center cursor-pointer select-none p-2 rounded ${
        selected ? "bg-blue-500 bg-opacity-50" : "hover:bg-white hover:bg-opacity-10"
      }`}
      style={{ left: x, top: y }}
      onClick={() => onFileClick({ id, name, type, content, imageSrc, x, y, icon })}
    >
      <img src={icon} alt={name} className="w-12 h-12 mb-1" draggable={false} />
      <span className="text-white text-xs text-center max-w-16 truncate">{name}</span>
    </div>
  );
}
