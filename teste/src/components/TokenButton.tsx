import { useRef } from "react";

interface Props {
  text: string;
  onDelete: () => void;
  onCopy: () => void;
  onMergeStart: () => void;
  onMergeTarget: () => void;
  isMergeSource: boolean;
  isMergeMode: boolean;
}

const TokenButton: React.FC<Props> = ({
  text,
  onDelete,
  onCopy,
  onMergeStart,
  onMergeTarget,
  isMergeSource,
  isMergeMode,
}) => {
  const holdTimeout = useRef<number | null>(null);
  const didHold = useRef<boolean>(false);
  const clickTimeout = useRef<number | null>(null);
  const clickCount = useRef<number>(0);

  const handleMouseDown = () => {
    didHold.current = false;
    holdTimeout.current = window.setTimeout(() => {
      didHold.current = true;
      onMergeStart();
    }, 600);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
  };

  const handleClick = () => {
    if (didHold.current) return;

    if (isMergeMode && !isMergeSource) {
      onMergeTarget();
      return;
    }

    clickCount.current += 1;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);

    clickTimeout.current = window.setTimeout(() => {
      const count = clickCount.current;
      clickCount.current = 0;
      if (count === 1) {
        onCopy();
      } else if (count >= 2) {
        onDelete();
      }
    }, 260);
  };

  const tokenClass = [
    "token",
    isMergeSource ? "token--merge-source" : "",
    isMergeMode && !isMergeSource ? "token--merge-target" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={tokenClass}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default TokenButton;