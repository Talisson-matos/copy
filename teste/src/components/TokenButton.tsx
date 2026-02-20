import { useState, useRef } from "react";
import type { TokenButtonProps } from "../types";

const TokenButton: React.FC<TokenButtonProps> = ({
  text,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const holdTimeout = useRef<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleMouseDown = () => {
    holdTimeout.current = window.setTimeout(() => {
      setIsEditing(true);
    }, 600);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onUpdate(e.currentTarget.innerText);
  };

  if (isEditing) {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        className="token editing"
        onBlur={handleBlur}
      >
        {text}
      </div>
    );
  }

  return (
    <button
      className="token"
      onClick={handleCopy}
      onDoubleClick={onDelete}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {text}
    </button>
  );
};

export default TokenButton;