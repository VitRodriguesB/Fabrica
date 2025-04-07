"use client";
import { useEffect, useState } from "react";

export default function Painel() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRxYIxvBp_U8PX3p6wUAm87WHri40iqqQ-3Dhc333p0pnxZMW3NwhLtCdLZwg0bdbS1JJBIXRG_9SGU/pub?output=csv")
      .then((res) => res.text())
      .then((csv) => {
        const linhas = csv.split("\n").map((linha) => linha.split(","));
        const cabecalho = linhas[0];
        const dadosFormatados = linhas.slice(1).map((linha) => {
          const obj = {};
          cabecalho.forEach((coluna, i) => {
            obj[coluna.trim().toLowerCase()] = linha[i];
          });
          return obj;
        });
        setDados(dadosFormatados);
      });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Painel de Manutenções</h1>
      {dados.length === 0 ? (
        <p>Carregando...</p>
      ) : (
        dados.map((item, idx) => (
          <div key={idx} className="border p-4 rounded">
            <p><strong>Máquina:</strong> {item.maquina}</p>
            <p><strong>Última:</strong> {item.ultima}</p>
            <p><strong>Próxima:</strong> {item.proxima}</p>
            <p><strong>Observação:</strong> {item.observacao}</p>
          </div>
        ))
      )}
    </div>
  );
}