import { useState, useEffect } from 'react';

export default function DnDCharacterSheet() {
  const initialCharacterState = {
    // Información básica
    nombre: '',
    clase: '',
    nivel: 1,
    raza: '',
    alineamiento: '',
    experiencia: 0,
    // Características
    fuerza: 10,
    destreza: 10,
    constitucion: 10,
    inteligencia: 10,
    sabiduria: 10,
    carisma: 10,
    // Combate
    ca: 10,
    iniciativa: 0,
    velocidad: 30,
    puntosGolpeMaximos: 0,
    puntosGolpeActuales: 0,
    // Salvaciones
    salvacionFuerza: false,
    salvacionDestreza: false,
    salvacionConstitucion: false,
    salvacionInteligencia: false,
    salvacionSabiduria: false,
    salvacionCarisma: false,
    // Habilidades
    acrobacias: false,
    arcanos: false,
    atletismo: false,
    engaño: false,
    historia: false,
    interpretacion: false,
    intimidacion: false,
    investigacion: false,
    juegoDeManos: false,
    medicina: false,
    naturaleza: false,
    percepcion: false,
    perspicacia: false,
    persuasion: false,
    religion: false,
    sigilo: false,
    supervivencia: false,
    tratoConAnimales: false,
    // Personalidad y antecedentes
    rasgosPersonalidad: '',
    ideales: '',
    vinculos: '',
    defectos: '',
    historias: '',
    // Equipamiento
    equipamiento: '',
    tesoro: '',
    // Hechizos y rasgos
    hechizos: '',
    rasgosEspeciales: ''
  };

  const [character, setCharacter] = useState(initialCharacterState);
  const [dataSaved, setDataSaved] = useState(false);

  useEffect(() => {
    // Cargar datos guardados cuando el componente se monta
    const savedCharacter = localStorage.getItem('dndCharacter');
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter));
      setDataSaved(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCharacter(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    setDataSaved(false);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setCharacter(prevState => ({
      ...prevState,
      [name]: value === '' ? '' : parseInt(value, 10) || 0
    }));
    setDataSaved(false);
  };

  const calculateModifier = (stat) => {
    return Math.floor((stat - 10) / 2);
  };

  const saveCharacter = () => {
    localStorage.setItem('dndCharacter', JSON.stringify(character));
    setDataSaved(true);
    alert('¡Personaje guardado con éxito!');
  };

  const downloadPDF = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(22);
      doc.text("HOJA DE PERSONAJE D&D 5E", 105, 15, { align: 'center' });
      
      // Información básica
      doc.setFontSize(14);
      doc.text("INFORMACIÓN BÁSICA", 20, 30);
      doc.setFontSize(12);
      doc.text(`Nombre: ${character.nombre}`, 20, 40);
      doc.text(`Clase: ${character.clase}`, 20, 50);
      doc.text(`Nivel: ${character.nivel}`, 20, 60);
      doc.text(`Raza: ${character.raza}`, 20, 70);
      doc.text(`Alineamiento: ${character.alineamiento}`, 20, 80);
      doc.text(`Experiencia: ${character.experiencia}`, 20, 90);
      
      // Características
      doc.setFontSize(14);
      doc.text("CARACTERÍSTICAS", 110, 30);
      doc.setFontSize(12);
      doc.text(`Fuerza: ${character.fuerza} (${calculateModifier(character.fuerza) >= 0 ? '+' : ''}${calculateModifier(character.fuerza)})`, 110, 40);
      doc.text(`Destreza: ${character.destreza} (${calculateModifier(character.destreza) >= 0 ? '+' : ''}${calculateModifier(character.destreza)})`, 110, 50);
      doc.text(`Constitución: ${character.constitucion} (${calculateModifier(character.constitucion) >= 0 ? '+' : ''}${calculateModifier(character.constitucion)})`, 110, 60);
      doc.text(`Inteligencia: ${character.inteligencia} (${calculateModifier(character.inteligencia) >= 0 ? '+' : ''}${calculateModifier(character.inteligencia)})`, 110, 70);
      doc.text(`Sabiduría: ${character.sabiduria} (${calculateModifier(character.sabiduria) >= 0 ? '+' : ''}${calculateModifier(character.sabiduria)})`, 110, 80);
      doc.text(`Carisma: ${character.carisma} (${calculateModifier(character.carisma) >= 0 ? '+' : ''}${calculateModifier(character.carisma)})`, 110, 90);
      
      // Combate
      doc.setFontSize(14);
      doc.text("COMBATE", 20, 110);
      doc.setFontSize(12);
      doc.text(`CA: ${character.ca}`, 20, 120);
      doc.text(`Iniciativa: ${character.iniciativa}`, 20, 130);
      doc.text(`Velocidad: ${character.velocidad}`, 20, 140);
      doc.text(`PG Máximos: ${character.puntosGolpeMaximos}`, 20, 150);
      doc.text(`PG Actuales: ${character.puntosGolpeActuales}`, 20, 160);
      
      // Personalidad y antecedentes
      doc.setFontSize(14);
      doc.text("PERSONALIDAD Y ANTECEDENTES", 20, 180);
      doc.setFontSize(12);
      
      // Truncar texto largo para que quepa en el PDF
      const truncateText = (text, maxLength = 50) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
      };
      
      doc.text(`Rasgos: ${truncateText(character.rasgosPersonalidad)}`, 20, 190);
      doc.text(`Ideales: ${truncateText(character.ideales)}`, 20, 200);
      doc.text(`Vínculos: ${truncateText(character.vinculos)}`, 20, 210);
      doc.text(`Defectos: ${truncateText(character.defectos)}`, 20, 220);
      
      // Guardar el PDF
      doc.save(`${character.nombre || 'personaje'}_dnd5e.pdf`);
    };
    
    document.body.appendChild(script);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-red-800">Hoja de Personaje D&D 5e</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-red-700">Información Básica</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={character.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Clase</label>
                <select
                  name="clase"
                  value={character.clase}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="Bárbaro">Bárbaro</option>
                  <option value="Bardo">Bardo</option>
                  <option value="Brujo">Brujo</option>
                  <option value="Clérigo">Clérigo</option>
                  <option value="Druida">Druida</option>
                  <option value="Explorador">Explorador</option>
                  <option value="Guerrero">Guerrero</option>
                  <option value="Hechicero">Hechicero</option>
                  <option value="Mago">Mago</option>
                  <option value="Monje">Monje</option>
                  <option value="Paladín">Paladín</option>
                  <option value="Pícaro">Pícaro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nivel</label>
                <input
                  type="number"
                  name="nivel"
                  min="1"
                  max="20"
                  value={character.nivel}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Raza</label>
                <select
                  name="raza"
                  value={character.raza}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="Elfo">Elfo</option>
                  <option value="Enano">Enano</option>
                  <option value="Humano">Humano</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Dracónido">Dracónido</option>
                  <option value="Gnomo">Gnomo</option>
                  <option value="Semielfo">Semielfo</option>
                  <option value="Semiorco">Semiorco</option>
                  <option value="Tiefling">Tiefling</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Alineamiento</label>
                <select
                  name="alineamiento"
                  value={character.alineamiento}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="Legal Bueno">Legal Bueno</option>
                  <option value="Neutral Bueno">Neutral Bueno</option>
                  <option value="Caótico Bueno">Caótico Bueno</option>
                  <option value="Legal Neutral">Legal Neutral</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Caótico Neutral">Caótico Neutral</option>
                  <option value="Legal Malvado">Legal Malvado</option>
                  <option value="Neutral Malvado">Neutral Malvado</option>
                  <option value="Caótico Malvado">Caótico Malvado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Experiencia</label>
                <input
                  type="number"
                  name="experiencia"
                  value={character.experiencia}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Características</h2>
            <div className="grid grid-cols-2 gap-4">
              {['fuerza', 'destreza', 'constitucion', 'inteligencia', 'sabiduria', 'carisma'].map((stat) => (
                <div key={stat} className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <label className="block text-sm font-medium text-gray-700 capitalize">{stat}</label>
                  <input
                    type="number"
                    name={stat}
                    min="1"
                    max="30"
                    value={character[stat]}
                    onChange={handleNumberChange}
                    className="mt-1 block w-full text-center rounded-md border-gray-300 shadow-sm p-2 border"
                  />
                  <div className="text-lg font-bold mt-1">
                    {calculateModifier(character[stat]) >= 0 ? '+' : ''}
                    {calculateModifier(character[stat])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-green-700">Combate</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Clase de Armadura</label>
                <input
                  type="number"
                  name="ca"
                  value={character.ca}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Iniciativa</label>
                <input
                  type="number"
                  name="iniciativa"
                  value={character.iniciativa}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Velocidad</label>
                <input
                  type="number"
                  name="velocidad"
                  value={character.velocidad}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Puntos de Golpe Máximos</label>
                <input
                  type="number"
                  name="puntosGolpeMaximos"
                  value={character.puntosGolpeMaximos}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Puntos de Golpe Actuales</label>
                <input
                  type="number"
                  name="puntosGolpeActuales"
                  value={character.puntosGolpeActuales}
                  onChange={handleNumberChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-purple-700">Salvaciones</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'salvacionFuerza', label: 'Fuerza' },
                { name: 'salvacionDestreza', label: 'Destreza' },
                { name: 'salvacionConstitucion', label: 'Constitución' },
                { name: 'salvacionInteligencia', label: 'Inteligencia' },
                { name: 'salvacionSabiduria', label: 'Sabiduría' },
                { name: 'salvacionCarisma', label: 'Carisma' }
              ].map((save) => (
                <div key={save.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={save.name}
                    name={save.name}
                    checked={character[save.name]}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={save.name} className="ml-2 block text-sm text-gray-700">
                    {save.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-yellow-700">Habilidades</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'acrobacias', label: 'Acrobacias (Des)' },
                { name: 'arcanos', label: 'Arcanos (Int)' },
                { name: 'atletismo', label: 'Atletismo (Fue)' },
                { name: 'engaño', label: 'Engaño (Car)' },
                { name: 'historia', label: 'Historia (Int)' },
                { name: 'interpretacion', label: 'Interpretación (Car)' },
                { name: 'intimidacion', label: 'Intimidación (Car)' },
                { name: 'investigacion', label: 'Investigación (Int)' },
                { name: 'juegoDeManos', label: 'Juego de Manos (Des)' },
                { name: 'medicina', label: 'Medicina (Sab)' },
                { name: 'naturaleza', label: 'Naturaleza (Int)' },
                { name: 'percepcion', label: 'Percepción (Sab)' },
                { name: 'perspicacia', label: 'Perspicacia (Sab)' },
                { name: 'persuasion', label: 'Persuasión (Car)' },
                { name: 'religion', label: 'Religión (Int)' },
                { name: 'sigilo', label: 'Sigilo (Des)' },
                { name: 'supervivencia', label: 'Supervivencia (Sab)' },
                { name: 'tratoConAnimales', label: 'Trato con Animales (Sab)' }
              ].map((skill) => (
                <div key={skill.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={skill.name}
                    name={skill.name}
                    checked={character[skill.name]}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={skill.name} className="ml-2 block text-sm text-gray-700">
                    {skill.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Personalidad y Antecedentes</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rasgos de Personalidad</label>
                <textarea
                  name="rasgosPersonalidad"
                  value={character.rasgosPersonalidad}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ideales</label>
                <textarea
                  name="ideales"
                  value={character.ideales}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Vínculos</label>
                <textarea
                  name="vinculos"
                  value={character.vinculos}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Defectos</label>
                <textarea
                  name="defectos"
                  value={character.defectos}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Equipamiento</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Equipamiento</label>
                <textarea
                  name="equipamiento"
                  value={character.equipamiento}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tesoro</label>
                <textarea
                  name="tesoro"
                  value={character.tesoro}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-pink-700">Hechizos y Rasgos</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hechizos</label>
                <textarea
                  name="hechizos"
                  value={character.hechizos}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Rasgos Especiales</label>
                <textarea
                  name="rasgosEspeciales"
                  value={character.rasgosEspeciales}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 space-x-4">
          <button 
            onClick={saveCharacter} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Guardar Personaje
          </button>
          <button 
            onClick={downloadPDF} 
            disabled={!dataSaved}
            className={`px-6 py-2 rounded-lg font-medium ${dataSaved 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}