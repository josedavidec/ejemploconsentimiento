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
        .from("clientes")
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

  // Resumen: total y top 3 más próximos
  const totalAlertas = alertas.length;
  const topAlertas = alertas.slice(0, 3);

  if (loading || alertas.length === 0) return null;

  return (
    <div className="alertas-sanitizacion">
      <h3>Alertas de procesos de sanitización próximos a vencer</h3>
      <div className="alertas-resumen">
        <span>Total próximos a vencer: <b>{totalAlertas}</b></span>
        {topAlertas.length > 0 && (
          <span style={{marginLeft: 16}}>
            Top 3:
            {topAlertas.map((c, i) => (
              <span key={c.id} style={{marginLeft: 8}}>
                <b>{c.nombre}</b> ({c.diasRestantes} días{c.diasRestantes <= 7 ? ' ⚠️' : c.diasRestantes <= 15 ? ' ⏳' : ''}){i < topAlertas.length-1 ? ',' : ''}
              </span>
            ))}
          </span>
        )}
      </div>
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
