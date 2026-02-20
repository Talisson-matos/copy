import type { GeneratedTextProps } from "../types";

const GeneratedText: React.FC<GeneratedTextProps> = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="generated-item">
      <span>{text}</span>
      <button onClick={handleCopy}>Copiar</button>
    </div>
  );
};

export default GeneratedText;