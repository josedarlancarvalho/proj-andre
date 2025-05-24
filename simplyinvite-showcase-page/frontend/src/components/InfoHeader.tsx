import React from 'react';

const InfoHeader = () => {
  return (
    <div className="bg-gray-100 p-4 border-b border-gray-300">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-2">SimplyInvite - Instruções</h2>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Como fazer login:</h3>
          <p className="mb-2">Este sistema possui três tipos de perfis: Jovem Talento, Profissional RH e Gestor.</p>
          
          <div className="mb-3">
            <p className="font-medium">Para fazer login em modo de desenvolvimento:</p>
            <ol className="list-decimal ml-5 space-y-1">
              <li>Selecione o tipo de perfil na página inicial (Jovem, RH ou Gestor)</li>
              <li>Na tela de login, use os botões na caixa laranja para login rápido</li>
              <li>Ou digite as credenciais de teste fornecidas abaixo</li>
            </ol>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="border p-3 rounded-md bg-blue-50">
              <h4 className="font-medium">Perfil Jovem Talento</h4>
              <p>Email: jovem@example.com</p>
              <p>Senha: senha123</p>
            </div>
            <div className="border p-3 rounded-md bg-green-50">
              <h4 className="font-medium">Perfil RH</h4>
              <p>Email: rh@example.com</p>
              <p>Senha: senha123</p>
            </div>
            <div className="border p-3 rounded-md bg-purple-50">
              <h4 className="font-medium">Perfil Gestor</h4>
              <p>Email: gestor@example.com</p>
              <p>Senha: senha123</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Para usar a autenticação em produção,
              será necessário configurar a URL da API na variável de ambiente
              VITE_API_URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeader;
