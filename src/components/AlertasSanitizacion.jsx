import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AlertasSanitizacion.css";

function calcularDiasRestantes(fecha_inicio, dias_sanitizacion) {
  if (!fecha_inicio || !dias_sanitizacion) return null;
  const inicio = new Date(fecha_inicio);
  const vencimiento = new Date(inicio);
  vencimiento.setDate(inicio.getDate() + Number(dias_sanitizacion));
  const hoy = new Date();
  const diff = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function AlertasSanitizacion() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("datos")
        .select("id, nombre, fecha_inicio, dias_sanitizacion");
      if (!error) setClientes(data);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const alertas = clientes
    .map((c) => {
      const dias = calcularDiasRestantes(c.fecha_inicio, c.dias_sanitizacion);
      return { ...c, diasRestantes: dias };
    })
    .filter((c) => c.diasRestantes !== null && c.diasRestantes <= 15)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  if (loading || alertas.length === 0) return null;

  return (
    <div className="alertas-sanitizacion">
      <h3>Alertas de procesos de sanitización próximos a vencer</h3>
      <ul className="alertas-list">
        {alertas.map((c) => (
          <li
            key={c.id}
            className={
              "alerta-item " + (c.diasRestantes <= 7 ? "rojo" : "amarillo")
            }
          >
            <span>
              <strong>{c.nombre}</strong> vence en{" "}
              <strong>{c.diasRestantes} días</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
