import { useState, useRef } from "react";

interface Props {
  text: string;
  onDelete: () => void;
  onUpdate: (value: string) => void;
  onTripleClick: () => void;
  isMerging: boolean;
}

const TokenButton: React.FC<Props> = ({
  text,
  onDelete,
  onUpdate,
  onTripleClick,
  isMerging,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const holdTimeout = useRef<number | null>(null);
  const clickTimeout = useRef<number | null>(null);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);

    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    clickTimeout.current = window.setTimeout(() => {
      if (clickCount === 0) {
        navigator.clipboard.writeText(text);
      }
      if (clickCount === 1) {
        onDelete();
      }
      if (clickCount >= 2) {
        onTripleClick();
      }
      setClickCount(0);
    }, 250);
  };

  const handleMouseDown = () => {
    holdTimeout.current = window.setTimeout(() => {
      setIsEditing(true);
    }, 600);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
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
      className={`token ${isMerging ? "editing" : ""}`}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {text}
    </button>
  );
};

export default TokenButton;