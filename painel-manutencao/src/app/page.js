
"use client";
import React, { useEffect, useState } from "react";
import { format, parseISO, isBefore, isToday } from "date-fns";

const SHEET_ID = "SUA_PLANILHA_ID";
const API_KEY = "SUA_API_KEY";
const RANGE = "Agendamento!A2:D";

const getStatus = (dateStr) => {
  const date = parseISO(dateStr);
  if (isToday(date)) return "hoje";
  if (isBefore(date, new Date())) return "atrasada";
  return "pendente";
};

export default function PainelManutencao() {
  const [dados, setDados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao acessar a planilha");
        return res.json();
      })
      .then((data) => {
        const rows = data.values || [];
        const formatado = rows.map((r) => ({
          maquina: r[0],
          ultima: r[1],
          proxima: r[2],
          observacao: r[3] || "",
        }));
        setDados(formatado);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setDados([]);
        setCarregando(false);
      });
  }, []);

  const filtrado = dados.filter((item) =>
    item.maquina.toLowerCase().includes(filtro.toLowerCase())
  );

  const total = filtrado.length;
  const atrasadas = filtrado.filter((m) => getStatus(m.proxima) === "atrasada").length;
  const hoje = filtrado.filter((m) => getStatus(m.proxima) === "hoje").length;

  const exportarCSV = () => {
    const csv = [
      ["Máquina", "Última", "Próxima", "Observação"],
      ...filtrado.map((item) => [
        item.maquina,
        item.ultima,
        item.proxima,
        item.observacao,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "manutencoes.csv";
    link.click();
  };

  if (carregando) return <p>Carregando dados...</p>;
  if (!filtrado.length) return <p>Nenhuma manutenção encontrada.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Painel de Manutenções</h1>
      <input
        type="text"
        placeholder="Filtrar por máquina..."
        className="p-2 border rounded w-full"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Total</h2>
          <p className="text-3xl">{total}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Hoje</h2>
          <p className="text-3xl text-yellow-500">{hoje}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Atrasadas</h2>
          <p className="text-3xl text-red-500">{atrasadas}</p>
        </div>
      </div>

      <button
        onClick={exportarCSV}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Exportar CSV
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        {filtrado.map((item, idx) => (
          <div
            key={idx}
            className={\`p-4 border rounded \${getStatus(item.proxima) === "atrasada"
              ? "bg-red-50"
              : getStatus(item.proxima) === "hoje"
              ? "bg-yellow-50"
              : "bg-white"
            }\`}
          >
            <h3 className="text-lg font-bold">{item.maquina}</h3>
            <div className="text-sm mt-2">Última: {format(parseISO(item.ultima), "dd/MM/yyyy")}</div>
            <div className="text-sm">
              Próxima: {format(parseISO(item.proxima), "dd/MM/yyyy")} - <strong>{getStatus(item.proxima)}</strong>
            </div>
            {item.observacao && (
              <p className="mt-2 text-sm text-gray-600">Obs: {item.observacao}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
