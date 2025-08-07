import type { DesktopFile } from "~/types/DesktopFile";

export const desktopFiles: DesktopFile[] = [
  {
    id: "readme",
    name: "README.txt",
    type: "text",
    content: `SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes in position 2-3: truncated \UXXXXXXXX escape`,
    x: 50,
    y: 100,
    icon: "/img/icons/text-file.png"
  },
  {
    id: "sample-image",
    name: "Sample.jpg",
    type: "image",
    imageSrc: "/img/images/lean.png",
    x: 50,
    y: 200,
    icon: "/img/icons/image-file.png"
  },
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    x: 50,
    y: 300,
    icon: "/img/icons/folder.png"
  },
  {
    id: "water-cooler",
    name: "Water Cooler",
    type: "special",
    x: -100, // Will be positioned via CSS
    y: -100, // Will be positioned via CSS
    icon: "/img/icons/terminal.png" // Using terminal icon temporarily
  }
];
