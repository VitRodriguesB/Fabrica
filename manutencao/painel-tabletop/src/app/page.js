"use client";
import { useEffect, useState } from "react";
import Tabletop from "tabletop";

export default function Painel() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    Tabletop.init({
      key: "1c1Hrw0slf_D-MUoCV1q5iImMp94yJCdcqXlJg58rxcs",
      simpleSheet: true,
      callback: function (data, tabletop) {
        setDados(data);
      },
    });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Painel de Manutenções</h1>
      {dados.length === 0 && <p>Carregando dados...</p>}
      {dados.map((item, index) => (
        <div key={index} className="border p-4 rounded shadow">
          <p><strong>Máquina:</strong> {item.maquina}</p>
          <p><strong>Última:</strong> {item.ultima}</p>
          <p><strong>Próxima:</strong> {item.proxima}</p>
          <p><strong>Observação:</strong> {item.observacao}</p>
        </div>
      ))}
    </div>
  );
}