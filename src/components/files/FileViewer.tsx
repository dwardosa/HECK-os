import React from "react";
import type { DesktopFile } from "~/types/desktop";

interface FileViewerProps {
  file: DesktopFile;
  onClose: () => void;
}

export default function FileViewer({ file, onClose }: FileViewerProps) {
  const renderContent = () => {
    switch (file.type) {
      case "text":
        return (
          <div className="p-4 bg-white text-black h-full overflow-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {file.content || "Empty file"}
            </pre>
          </div>
        );
      case "image":
        return (
          <div className="p-4 bg-gray-100 h-full flex items-center justify-center">
            <img
              src={file.imageSrc}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      default:
        return (
          <div className="p-4 bg-white text-black h-full">
            <p>Cannot preview this file type</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl max-h-4xl w-3/4 h-3/4 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-lg font-semibold text-black">{file.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      </div>
    </div>
  );
}
