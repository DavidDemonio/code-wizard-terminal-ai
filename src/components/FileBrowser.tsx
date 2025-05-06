
import { useState } from "react";
import { 
  File, 
  FileText, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Home, 
  RefreshCw, 
  Upload,
  Trash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Sample file structure - in production this would come from your backend
const SAMPLE_FILES = [
  {
    name: "home",
    type: "directory",
    children: [
      {
        name: "documents",
        type: "directory",
        children: [
          { name: "project-notes.md", type: "file", size: "12KB" },
          { name: "meeting-minutes.txt", type: "file", size: "5KB" },
        ],
      },
      {
        name: "downloads",
        type: "directory",
        children: [
          { name: "image.png", type: "file", size: "1.2MB" },
          { name: "archive.zip", type: "file", size: "4.5MB" },
        ],
      },
      { name: "config.json", type: "file", size: "2KB" },
      { name: ".bashrc", type: "file", size: "1KB" },
    ],
  },
];

interface FileItemProps {
  item: {
    name: string;
    type: string;
    children?: any[];
    size?: string;
  };
  level: number;
}

function FileItem({ item, level }: FileItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const isDirectory = item.type === "directory";
  const marginLeft = `${level * 1}rem`;

  const toggleDirectory = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center py-1 px-2 cursor-pointer file-item rounded-md",
          isSelected && "active"
        )}
        style={{ marginLeft }}
        onClick={handleClick}
        onDoubleClick={toggleDirectory}
      >
        {isDirectory ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 mr-1"
            onClick={(e) => {
              e.stopPropagation();
              toggleDirectory();
            }}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <span className="w-5"></span>
        )}
        
        {isDirectory ? (
          <Folder className="h-4 w-4 mr-2 text-yellow-500" />
        ) : (
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
        )}
        
        <span className="text-sm truncate">{item.name}</span>
        
        {!isDirectory && item.size && (
          <span className="ml-auto text-xs text-muted-foreground">{item.size}</span>
        )}
      </div>
      
      {isDirectory && isOpen && (
        <div>
          {item.children?.map((child, index) => (
            <FileItem key={`${child.name}-${index}`} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </>
  );
}

export function FileBrowser() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-medium">File Browser</h3>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Home className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto p-2">
        {SAMPLE_FILES.map((file, index) => (
          <FileItem key={`${file.name}-${index}`} item={file} level={0} />
        ))}
      </div>
    </div>
  );
}
