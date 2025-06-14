import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/FileUploader.css"

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPessoas, setNumPessoas] = useState<number | "">(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setTotal(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Por favor, selecione ao menos um arquivo PDF");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTotal(response.data.total);
    } catch (err) {
      setError("Erro ao enviar arquivos. Tente novamente.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Envie seus PDFs para análise</h2>

      <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />

      <div className="label-pessoas">
        <label htmlFor="pessoas">Número de pessoas:</label>
        <input
          type="number"
          id="pessoas"
          min={1}
          value={numPessoas}
          onChange={(e) => {
            const val = e.target.value;
            setNumPessoas(val === "" ? "" : Math.max(1, Number(val)));
          }}
          className="input-pessoas"
        />
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>

      {total !== null && (
        <div className="result">
          <p>
            Total calculado: <strong>R$ {total.toFixed(2)}</strong>
          </p>
          <p>
            Valor por pessoa ({numPessoas}): <strong>R$ {(total / Number(numPessoas || 1)).toFixed(2)}</strong>
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUploader;
