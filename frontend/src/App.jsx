import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

async function api(caminho, opcoes = {}) {
  const resp = await fetch(API + caminho, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(dados.mensagem || "Erro na requisição.");
  return dados;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(e) {
    e.preventDefault();
    try {
      onLogin(
        await api("/login", {
          method: "POST",
          body: JSON.stringify({ email, senha }),
        }),
      );
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <form onSubmit={entrar}>
      <h1>Barbearia - Login</h1>
      <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <button>Entrar</button>
      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}

function Clientes() {
  const [lista, setLista] = useState([]);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({ nome: "", telefone: "", cpf: "" });
  const [erro, setErro] = useState("");

  async function carregar(termo = busca) {
    try {
      setLista(await api(`/clientes?busca=${encodeURIComponent(termo)}`));
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregar("");
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      await api("/clientes", { method: "POST", body: JSON.stringify(form) });
      setForm({ nome: "", telefone: "", cpf: "" });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div>
      <h2>Novo cliente</h2>
      <form onSubmit={salvar}>
        <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input placeholder="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required />
        <input placeholder="CPF" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} required />
        <button>Cadastrar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}

      <h2>Clientes</h2>
      <input placeholder="Buscar por nome" value={busca} onChange={(e) => setBusca(e.target.value)} />
      <button onClick={() => carregar()}>Buscar</button>
      <table>
        <thead>
          <tr><th>Nome</th><th>Telefone</th></tr>
        </thead>
        <tbody>
          {lista.map((c) => (
            <tr key={c.id}><td>{c.nome}</td><td>{c.telefone}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Barbeiros() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ nome: "", especialidade: "" });
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setLista(await api("/barbeiros"));
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      await api("/barbeiros", { method: "POST", body: JSON.stringify(form) });
      setForm({ nome: "", especialidade: "" });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div>
      <h2>Novo barbeiro</h2>
      <form onSubmit={salvar}>
        <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input placeholder="Especialidade" value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} required />
        <button>Cadastrar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}

      <h2>Barbeiros</h2>
      <table>
        <thead>
          <tr><th>Nome</th><th>Especialidade</th></tr>
        </thead>
        <tbody>
          {lista.map((b) => (
            <tr key={b.id}><td>{b.nome}</td><td>{b.especialidade}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Servicos() {
  const [lista, setLista] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", barbeiroId: "" });
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setLista(await api("/servicos"));
      setBarbeiros(await api("/barbeiros"));
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      await api("/servicos", { method: "POST", body: JSON.stringify(form) });
      setForm({ nome: "", preco: "", barbeiroId: "" });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div>
      <h2>Novo serviço</h2>
      <form onSubmit={salvar}>
        <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <input type="number" step="0.01" placeholder="Preço" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
        <select value={form.barbeiroId} onChange={(e) => setForm({ ...form, barbeiroId: e.target.value })} required>
          <option value="">Barbeiro</option>
          {barbeiros.map((b) => (
            <option key={b.id} value={b.id}>{b.nome}</option>
          ))}
        </select>
        <button>Cadastrar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}

      <h2>Serviços</h2>
      <table>
        <thead>
          <tr><th>Serviço</th><th>Preço</th><th>Barbeiro</th></tr>
        </thead>
        <tbody>
          {lista.map((s) => (
            <tr key={s.id}>
              <td>{s.nome}</td>
              <td>R$ {Number(s.preco).toFixed(2)}</td>
              <td>{s.barbeiro?.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Agendamentos() {
  const [lista, setLista] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [form, setForm] = useState({ dataHorario: "", clienteId: "", servicoId: "" });
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setLista(await api("/agendamentos"));
      setClientes(await api("/clientes"));
      setServicos(await api("/servicos"));
    } catch (err) {
      setErro(err.message);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    try {
      // "Z" para o horário digitado ser gravado exatamente como foi escolhido
      const corpo = { ...form, dataHorario: form.dataHorario + ":00.000Z" };
      await api("/agendamentos", { method: "POST", body: JSON.stringify(corpo) });
      setForm({ dataHorario: "", clienteId: "", servicoId: "" });
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  // o banco guarda "data" e "horario" separados
  const formatarData = (iso) => (iso ? iso.slice(0, 10).split("-").reverse().join("/") : "");
  const formatarHora = (iso) => (iso ? iso.slice(11, 16) : "");

  return (
    <div>
      <h2>Novo agendamento</h2>
      <form onSubmit={salvar}>
        <input type="datetime-local" value={form.dataHorario} onChange={(e) => setForm({ ...form, dataHorario: e.target.value })} required />
        <select value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} required>
          <option value="">Cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <select value={form.servicoId} onChange={(e) => setForm({ ...form, servicoId: e.target.value })} required>
          <option value="">Serviço</option>
          {servicos.map((s) => (
            <option key={s.id} value={s.id}>{s.nome} - {s.barbeiro?.nome}</option>
          ))}
        </select>
        <button>Agendar</button>
      </form>
      {erro && <p className="erro">{erro}</p>}

      <h2>Agendamentos</h2>
      <table>
        <thead>
          <tr><th>Data</th><th>Hora</th><th>Cliente</th><th>Serviço</th><th>Barbeiro</th></tr>
        </thead>
        <tbody>
          {lista.map((a) => (
            <tr key={a.id}>
              <td>{formatarData(a.data)}</td>
              <td>{formatarHora(a.horario)}</td>
              <td>{a.cliente?.nome}</td>
              <td>{a.servico?.nome}</td>
              <td>{a.servico?.barbeiro?.nome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const abas = {
  Agendamentos: <Agendamentos />,
  Clientes: <Clientes />,
  Barbeiros: <Barbeiros />,
  Serviços: <Servicos />,
};

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState("Agendamentos");

  useEffect(() => {
    api("/me")
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  async function sair() {
    await api("/logout", { method: "POST" });
    setUsuario(null);
  }

  if (carregando) return <p>Carregando...</p>;

  return (
    <>
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : (
        <>
          <h1>Barbearia</h1>
          <p>
            Olá, {usuario.nome} <button onClick={sair}>Sair</button>
          </p>
          <nav>
            {Object.keys(abas).map((nome) => (
              <button key={nome} className={aba === nome ? "ativo" : ""} onClick={() => setAba(nome)}>
                {nome}
              </button>
            ))}
          </nav>
          {abas[aba]}
        </>
      )}
    </>
  );
}