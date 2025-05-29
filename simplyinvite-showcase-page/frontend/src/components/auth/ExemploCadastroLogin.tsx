import React, { useState } from "react";
import { registrar, login } from "../../servicos/usuario";

const ExemploCadastroLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState<"talent" | "hr" | "manager">("talent");
  const [token, setToken] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string>("");

  const handleCadastro = async () => {
    try {
      const novoUsuario = {
        email,
        senha,
        nomeCompleto,
        tipoPerfil,
      };
      const response = await registrar(novoUsuario);
      setMensagem("Usuário cadastrado com sucesso! ID: " + response.id);
    } catch (error) {
      setMensagem("Erro ao cadastrar usuário: " + (error as Error).message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, senha);
      setToken(response.token);
      setMensagem("Login realizado com sucesso! Token recebido.");
    } catch (error) {
      setMensagem("Erro ao fazer login: " + (error as Error).message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Cadastro de Usuário</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Nome Completo"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <select
        value={tipoPerfil}
        onChange={(e) => setTipoPerfil(e.target.value as "talent" | "hr" | "manager")}
        style={{ width: "100%", marginBottom: 8 }}
      >
        <option value="talent">Talent</option>
        <option value="hr">HR</option>
        <option value="manager">Manager</option>
      </select>
      <button onClick={handleCadastro} style={{ width: "100%", marginBottom: 16 }}>
        Cadastrar
      </button>

      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={handleLogin} style={{ width: "100%", marginBottom: 16 }}>
        Logar
      </button>

      {mensagem && <p>{mensagem}</p>}
      {token && (
        <div>
          <strong>Token JWT:</strong>
          <pre style={{ wordWrap: "break-word" }}>{token}</pre>
        </div>
      )}
    </div>
  );
};

export default ExemploCadastroLogin;
