import { useState } from "react";

export default function Habilidades() {
  
  const [habilidades, setHabilidades] = useState({
    Fue: 0,
    Des: 0,
  });
  const [modificador, setModificador] = useState({
    Fue: 0,
    Des: 0,
  });
  const handleChange = (e) => {
    setHabilidades({
      ...habilidades,
      [e.target.name]: e.target.value,
    });
  };
    const calcularModificador = (valor) => {
        return Math.floor((valor - 10) / 2);
    };
  return (
    <>
      <h1>Habilidades de dungeons and dragons 5e</h1>
      <input type="number" placeholder="fue" name="Fue" value={habilidades.Fue} onChange={handleChange}/>
        <p>Modificador de Fuerza: {calcularModificador(habilidades.Fue)}</p>
        <input type="number" placeholder="des" name="Des" value={habilidades.Des} onChange={handleChange}/>
        <p>Modificador de Destreza: {calcularModificador(habilidades.Des)}</p>
    </>
  );
}
