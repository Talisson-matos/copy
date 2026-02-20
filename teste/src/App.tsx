import { useState, useEffect } from "react";
import TokenButton from "./components/TokenButton";
import GeneratedText from "./components/GeneratedText";

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [manualToken, setManualToken] = useState<string>("");

  const [cte, setCte] = useState<string>("");
  const [mdfe, setMdfe] = useState<string>("");
  const [motorista, setMotorista] = useState<string>("");

  // 🔥 Geração automática sempre que input muda
  useEffect(() => {
    if (!inputValue.trim()) {
      setTokens([]);
      return;
    }

    const parts = inputValue.split(/\s{2,}/).filter(Boolean);
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
    setCte("");
    setMdfe("");
    setMotorista("");
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

      <button onClick={handleClearAll} className="parse-btn">
        Limpar Tudo
      </button>

      {/* 🔥 Input Manual */}
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Criar botão manualmente..."
          value={manualToken}
          onChange={(e) => setManualToken(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "none",
          }}
        />
        <button onClick={handleManualAdd} className="parse-btn">
          Adicionar
        </button>
      </div>

      <div className="tokens-container">
        {tokens.map((token, index) => (
          <TokenButton
            key={index}
            text={token}
            onDelete={() => removeToken(index)}
            onUpdate={(val) => updateToken(index, val)}
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