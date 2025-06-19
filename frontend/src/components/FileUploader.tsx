import React, { useState } from "react";
import axios from "axios";
import { Upload, Calculator, Users, FileText } from "lucide-react";

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
    <div className="w-full max-w-2xl mx-auto">
      {/* Card principal com gradiente granulado */}
      <div className="relative bg-gradient-to-br from-purple-900/20 via-indigo-800/30 to-blue-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-indigo-500/5 to-blue-700/10 rounded-3xl"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 bg-clip-text text-transparent mb-2">
              Análise de PDFs
            </h2>
            <p className="text-gray-300 text-lg">Envie seus documentos para calcular automaticamente os valores</p>
          </div>

          {/* Upload de arquivos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Selecionar arquivos PDF
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full text-white bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-purple-500/30 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-400/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-purple-600 file:to-blue-600 file:text-white hover:file:from-purple-700 hover:file:to-blue-700"
              />
              {files && files.length > 0 && (
                <div className="mt-2 text-sm text-green-300 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {files.length} arquivo(s) selecionado(s)
                </div>
              )}
            </div>
          </div>

          {/* Número de pessoas */}
          <div className="mb-8">
            <label htmlFor="pessoas" className="block text-sm font-medium text-gray-200 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Número de pessoas
            </label>
            <div className="relative">
              <input
                type="number"
                id="pessoas"
                min={1}
                value={numPessoas}
                onChange={(e) => {
                  const val = e.target.value;
                  setNumPessoas(val === "" ? "" : Math.max(1, Number(val)));
                }}
                className="w-full text-white bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-purple-500/30 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:border-purple-400/50"
                placeholder="Ex: 4"
              />
              <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Botão de envio */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Analisando...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                Calcular Valores
              </>
            )}
          </button>

          {/* Resultados */}
          {total !== null && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 via-emerald-800/20 to-teal-900/30 rounded-2xl border border-green-500/20 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mb-2">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-1">Total calculado</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-300 to-teal-300 bg-clip-text text-transparent">
                    R$ {total.toFixed(2)}
                  </p>
                </div>
                <div className="border-t border-green-500/20 pt-4">
                  <p className="text-gray-300 text-sm mb-1">Valor por pessoa ({numPessoas})</p>
                  <p className="text-2xl font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    R$ {(total / Number(numPessoas || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-xl border border-red-500/20 backdrop-blur-sm">
              <p className="text-red-300 text-center flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;