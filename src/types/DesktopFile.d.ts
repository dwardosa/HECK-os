export interface DesktopFile {
  id: string;
  name: string;
  type: "text" | "image" | "folder" | "special";
  content?: string; // for text files
  imageSrc?: string; // for image files
  x: number; // position on desktop
  y: number;
  icon: string; // icon path
}
