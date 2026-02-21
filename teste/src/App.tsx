import { useState, useEffect, useCallback } from "react";
import  Toast,  { type ToastItem } from "./components/Toast";
import TokenButton from "./components/TokenButton";
import GeneratedText from "./components/GeneratedText";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [manualToken, setManualToken] = useState<string>("");
  const [sanitizeInput, setSanitizeInput] = useState<string>("");
  const [cte, setCte] = useState<string>("");
  const [mdfe, setMdfe] = useState<string>("");
  const [motorista, setMotorista] = useState<string>("");
  const [mergeIndex, setMergeIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, icon: string = "✓") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, icon, fading: false }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, fading: true } : t))
      );
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        320
      );
    }, 1800);
  }, []);

  useEffect(() => {
    if (!inputValue.trim()) {
      setTokens([]);
      return;
    }
    setTokens(inputValue.split(/\s+/).filter(Boolean));
  }, [inputValue]);

  const removeToken = (index: number) => {
    setTokens((prev) => prev.filter((_, i) => i !== index));
    addToast("Botão removido", "×");
  };

  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("Copiado!", "✓");
  };

  const handleMergeStart = (index: number) => {
    setMergeIndex(index);
    addToast("Clique no próximo botão para fundir", "⊕");
  };

  const handleMergeTarget = (targetIndex: number) => {
    if (mergeIndex === null) return;

    setTokens((prev) => {
      const sourceText = prev[mergeIndex];
      const targetText = prev[targetIndex];
      const merged = `${sourceText} ${targetText}`;
      const updated = [...prev];
      updated[mergeIndex] = merged;
      return updated.filter((_, i) => i !== targetIndex);
    });

    addToast("Botões fundidos!", "⊕");
    setMergeIndex(null);
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
    addToast("Tudo limpo", "↺");
  };

  const handleSanitize = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
    if (!cleaned) return;
    navigator.clipboard.writeText(cleaned);
    setSanitizeInput("");
    addToast("Texto sanitizado copiado", "✓");
  };

  const cancelMerge = () => setMergeIndex(null);

  return (
    <>
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Excel Copy Tool</h1>
          <div className="header-divider" />
        </div>

        {/* Main Input */}
        <div className="section">
          <label className="section-label">Colar dados</label>
          <textarea
            className="main-input"
            placeholder="Cole aqui uma linha do Excel ou CSV..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* Manual + Sanitize */}
        <div className="grid-two">
          <div className="section">
            <label className="section-label">Criar botão</label>
            <div className="input-row">
              <input
                placeholder="Texto do botão..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualAdd()}
              />
              <button className="btn" onClick={handleManualAdd}>
                +
              </button>
            </div>
          </div>

          <div className="section">
            <label className="section-label">Sanitizar &amp; copiar</label>
            <input
              placeholder="Cole para remover pontuação..."
              value={sanitizeInput}
              onChange={(e) => handleSanitize(e.target.value)}
            />
          </div>
        </div>

        {/* Tokens */}
        {tokens.length > 0 && (
          <div className="section">
            <div className="tokens-header">
              <label className="section-label no-margin">Botões gerados</label>
              <div className="tokens-actions">
                {mergeIndex !== null && (
                  <button className="btn btn--subtle" onClick={cancelMerge}>
                    cancelar fusão
                  </button>
                )}
                <button className="btn btn--danger" onClick={handleClearAll}>
                  limpar tudo
                </button>
              </div>
            </div>

            {mergeIndex !== null && (
              <div className="merge-banner">
                ⊕ Modo fusão ativo — clique no botão destino
              </div>
            )}

            <div className="tokens-container">
              {tokens.map((token, index) => (
                <TokenButton
                  key={index}
                  text={token}
                  onDelete={() => removeToken(index)}
                  onCopy={() => handleCopyToken(token)}
                  onMergeStart={() => handleMergeStart(index)}
                  onMergeTarget={() => handleMergeTarget(index)}
                  isMergeSource={mergeIndex === index}
                  isMergeMode={mergeIndex !== null}
                />
              ))}
            </div>

            <p className="tokens-hint">
              1× clique → copiar &nbsp;·&nbsp; 2× clique → remover
              &nbsp;·&nbsp; segurar → fundir
            </p>
          </div>
        )}

        {/* Extra Info */}
        <div className="section">
          <label className="section-label">Informações extras</label>
          <div className="grid-three">
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

        {/* Generated Texts */}
        {cte && motorista && (
          <div className="section">
            <label className="section-label">Textos gerados</label>
            <div className="generated-container">
              <GeneratedText
                text={`(CTe ${cte}) • ${motorista}`}
                onCopy={addToast}
              />
              {mdfe && (
                <GeneratedText
                  text={`(MDFe ${mdfe}) • ${motorista}`}
                  onCopy={addToast}
                />
              )}
              <GeneratedText
                text={`(CTRB ${cte}) • ${motorista}`}
                onCopy={addToast}
              />
              <GeneratedText
                text={`(Vale Pedagio ${cte}) • ${motorista}`}
                onCopy={addToast}
              />
            </div>
          </div>
        )}
      </div>

      <Toast toasts={toasts} />
    </>
  );
}

export default App;