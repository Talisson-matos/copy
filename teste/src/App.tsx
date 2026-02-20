import { useState, useEffect } from "react";
import TokenButton from "./components/TokenButton";
import GeneratedText from "./components/GeneratedText";

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [manualToken, setManualToken] = useState<string>("");
  const [sanitizeInput, setSanitizeInput] = useState<string>("");

  const [cte, setCte] = useState<string>("");
  const [mdfe, setMdfe] = useState<string>("");
  const [motorista, setMotorista] = useState<string>("");

  const [mergeIndex, setMergeIndex] = useState<number | null>(null);

  // Separação por 1+ espaços
  useEffect(() => {
    if (!inputValue.trim()) {
      setTokens([]);
      return;
    }

    const parts = inputValue.split(/\s+/).filter(Boolean);
    setTokens(parts);
  }, [inputValue]);

  const removeToken = (index: number) => {
    setTokens((prev) => prev.filter((_, i) => i !== index));
  };

  const updateToken = (index: number, value: string) => {
    setTokens((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleManualAdd = () => {
    if (!manualToken.trim()) return;
    setTokens((prev) => [...prev, manualToken.trim()]);
    setManualToken("");
  };

  const handleClearAll = () => {
    setInputValue("");
    setTokens([]);
    setManualToken("");
    setSanitizeInput("");
    setCte("");
    setMdfe("");
    setMotorista("");
    setMergeIndex(null);
  };

  const handleSanitize = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
    if (!cleaned) return;

    navigator.clipboard.writeText(cleaned);
    setSanitizeInput("");
  };

  // 🔥 MODO FUSÃO
  const handleMerge = (index: number) => {
    if (mergeIndex === null) {
      setMergeIndex(index);
      return;
    }

    if (mergeIndex === index) {
      setMergeIndex(null);
      return;
    }

    setTokens((prev) => {
      const first = prev[mergeIndex];
      const second = prev[index];
      const merged = `${first} ${second}`;

      const newTokens = prev.filter(
        (_, i) => i !== mergeIndex && i !== index
      );

      newTokens.push(merged);
      return newTokens;
    });

    setMergeIndex(null);
  };

  return (
    <div className="container">
      <h1>Excel Copy Tool</h1>

      <textarea
        placeholder="Cole aqui uma linha do Excel ou CSV..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="main-input"
      />

      <button onClick={handleClearAll} className="danger-btn">
        Limpar Tudo
      </button>

      <div className="input-group">
        <input
          placeholder="Criar botão manualmente..."
          value={manualToken}
          onChange={(e) => setManualToken(e.target.value)}
        />
        <button onClick={handleManualAdd}>Adicionar</button>
      </div>

      <div className="sanitize-box">
        <input
          placeholder="Colar aqui para remover pontuação e copiar automaticamente..."
          value={sanitizeInput}
          onChange={(e) => {
            setSanitizeInput(e.target.value);
            handleSanitize(e.target.value);
          }}
        />
      </div>

      <div className="tokens-container">
        {tokens.map((token, index) => (
          <TokenButton
            key={index}
            text={token}
            onDelete={() => removeToken(index)}
            onUpdate={(val) => updateToken(index, val)}
            onTripleClick={() => handleMerge(index)}
            isMerging={mergeIndex === index}
          />
        ))}
      </div>

      <div className="form-section">
        <h3>Informações Extras</h3>

        <div className="form-row">
          <input
            placeholder="CTe"
            value={cte}
            onChange={(e) => setCte(e.target.value)}
          />
          <input
            placeholder="MDFe"
            value={mdfe}
            onChange={(e) => setMdfe(e.target.value)}
          />
          <input
            placeholder="Motorista"
            value={motorista}
            onChange={(e) => setMotorista(e.target.value)}
          />
        </div>
      </div>

      <div className="generated-container">
        {cte && motorista && (
          <>
            <GeneratedText text={`(CTe ${cte}) • ${motorista}`} />
            {mdfe && (
              <GeneratedText text={`(MDFe ${mdfe}) • ${motorista}`} />
            )}
            <GeneratedText text={`(CTRB ${cte}) • ${motorista}`} />
            <GeneratedText text={`(Vale Pedagio ${cte}) • ${motorista}`} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;