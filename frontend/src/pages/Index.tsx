import FileUploader from "../components/FileUploader";
import { Wallet, Zap, Users, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Padrão de grade sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 rounded-3xl mb-6 shadow-2xl">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-200 via-indigo-200 to-blue-200 bg-clip-text text-transparent">
              Splitr
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gerencie e divida suas contas de forma inteligente e automática
          </p>

          {/* Cards de recursos */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-800/20 to-indigo-800/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Análise Rápida</h3>
              <p className="text-gray-300 text-sm">Processe seus PDFs em segundos</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-800/20 to-blue-800/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Divisão Justa</h3>
              <p className="text-gray-300 text-sm">Calcule valores por pessoa automaticamente</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-800/20 to-purple-800/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Precisão Total</h3>
              <p className="text-gray-300 text-sm">Resultados confiáveis e detalhados</p>
            </div>
          </div>
        </div>

        {/* Componente FileUploader */}
        <FileUploader />

        {/* Rodapé */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-sm">
            Transforme a forma como você gerencia suas contas compartilhadas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;