interface Props {
  text: string;
  onCopy: (message: string, icon?: string) => void;
}

const GeneratedText: React.FC<Props> = ({ text, onCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onCopy("Texto copiado");
  };

  return (
    <div className="generated-item">
      <span className="generated-text">{text}</span>
      <button className="generated-copy-btn" onClick={handleCopy}>
        copiar
      </button>
    </div>
  );
};

export default GeneratedText;