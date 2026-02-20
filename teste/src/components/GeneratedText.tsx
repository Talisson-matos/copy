interface Props {
  text: string;
}

const GeneratedText: React.FC<Props> = ({ text }) => {
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