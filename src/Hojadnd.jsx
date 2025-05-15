import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const getModifier = (score) => {
  const parsed = parseInt(score);
  if (isNaN(parsed)) return "";
  const mod = Math.floor((parsed - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const getProficiencyBonus = (level) => {
  const parsed = parseInt(level);
  if (isNaN(parsed) || parsed <= 0) return "";
  return 2 + Math.floor((parsed - 1) / 4);
};

const CharacterForm = () => {
  const [form, setForm] = useState({
    name: "",
    race: "",
    class: "",
    alignment: "",
    background: "",
    playerName: "",
    experience: "",
    level: "",
    str: "",
    dex: "",
    con: "",
    int: "",
    wis: "",
    cha: "",
    ac: "",
    hp: "",
    initiative: "",
  });

  const [proficiencies, setProficiencies] = useState({
    saves: {},
    skills: {},
  });

  const [pdfUrl, setPdfUrl] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfChange = (type, key) => {
    setProficiencies((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key],
      },
    }));
  };

  const savePdf = async () => {
    const existingPdfBytes = await fetch("/public/5E_CharacterSheet_Fillable.pdf").then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPage(0);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10;
    const fontSizeBig = 15;

    const profBonus = getProficiencyBonus(form.level);

    const getModWithProf = (score, isProf) => {
      const base = parseInt(score);
      if (isNaN(base)) return "";
      let mod = Math.floor((base - 10) / 2);
      if (isProf) mod += profBonus;
      return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    // Datos generales
    page.drawText(form.name, { x: 50, y: 717, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(form.race, { x: 270, y: 704, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(form.class, { x: 270, y: 730, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(form.alignment, { x: 380, y: 704, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(form.background, { x: 380, y: 730, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(form.playerName, { x: 480, y: 730, size: fontSize, font, color: rgb(0, 0, 0) });
    page.drawText(form.experience, { x: 480, y: 704, size: fontSize, font, color: rgb(0, 0, 0) });

    // AC, HP, iniciativa
    page.drawText(form.ac, { x: 355, y: 655, size: fontSizeBig, font, color: rgb(0, 0, 0) });
    page.drawText(form.hp, { x: 415, y: 655, size: fontSizeBig, font, color: rgb(0, 0, 0) });
    page.drawText(form.initiative, { x: 470, y: 655, size: fontSizeBig, font, color: rgb(0, 0, 0) });

    // Atributos
    const attributes = [
      { name: "str", y: 595, modY: 620 },
      { name: "dex", y: 524, modY: 544 },
      { name: "con", y: 453, modY: 478 },
      { name: "int", y: 382, modY: 402 },
      { name: "wis", y: 311, modY: 336 },
      { name: "cha", y: 240, modY: 260 },
    ];
    attributes.forEach(({ name, y, modY }) => {
      page.drawText(form[name], { x: 52, y, size: fontSize, font, color: rgb(0, 0, 0) });
      page.drawText(getModifier(form[name]), {
        x: 46,
        y: modY,
        size: fontSizeBig,
        font,
        color: rgb(0, 0, 0),
      });
    });

    // Proficiency bonus
    page.drawText(`+${profBonus}`, { x: 100, y: 612, size: fontSize + 2, font, color: rgb(0, 0, 0) });

    // Saving Throws
    const saves = ["str", "dex", "con", "int", "wis", "cha"];
    saves.forEach((stat, i) => {
      const mod = getModWithProf(form[stat], proficiencies.saves[stat]);
      page.drawText(mod, {
        x: 112,
        y: 579 - i * 14,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      if (proficiencies.saves[stat]) {
        page.drawText("•", { x: 100, y: 572 - i * 14, size: 28, font, color: rgb(0, 0, 0) });
      }
    });
  // Skills
   const skillList = [
  { name: "acrobatics", mod: "dex", y: 464, dotY: 457 },
  { name: "animalHandling", mod: "wis", y: 450, dotY: 443 },
  { name: "arcana", mod: "int", y: 436, dotY: 430 },
  { name: "athletics", mod: "str", y: 422, dotY: 416 },
  { name: "deception", mod: "cha", y: 408, dotY: 403 },
  { name: "history", mod: "int", y: 395, dotY: 389 },
  { name: "insight", mod: "wis", y: 382, dotY: 376 },
  { name: "intimidation", mod: "cha", y: 366, dotY: 362 },
  { name: "investigation", mod: "int", y: 354, dotY: 349 },
  { name: "medicine", mod: "wis", y: 340, dotY: 335 },
  { name: "nature", mod: "int", y: 326, dotY: 322 },
  { name: "perception", mod: "wis", y: 314, dotY: 308 },
  { name: "performance", mod: "cha", y: 301, dotY: 294 },
  { name: "persuasion", mod: "cha", y: 287, dotY: 281 },
  { name: "religion", mod: "int", y: 275, dotY: 268 },
  { name: "sleightOfHand", mod: "dex", y: 262, dotY: 254},
  { name: "stealth", mod: "dex", y: 248, dotY: 241 },
  { name: "survival", mod: "wis", y: 234, dotY: 227 },
];

   skillList.forEach(({ name, mod, y, dotY }) => {
  const score = getModWithProf(form[mod], proficiencies.skills[name]);
  page.drawText(score, {
    x: 112,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  if (proficiencies.skills[name]) {
    page.drawText("•", {
      x: 100,
      y: dotY,
      size: 25,
      font,
      color: rgb(0, 0, 0),
    });
  }
});

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setPdfUrl(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Creación de Personaje (D&D 5e)</h2>

        {["name", "race", "class", "level", "alignment", "background", "playerName", "experience", "ac", "hp", "initiative"].map(
          (field) => (
            <div key={field} className="mb-4">
              <label className="block capitalize mb-1">{field}</label>
              <input
                type="text"
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />
            </div>
          )
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
            <div key={stat}>
              <label className="block mb-1 uppercase">{stat}</label>
              <input
                type="number"
                name={stat}
                value={form[stat] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded mb-1"
              />
              <div className="text-sm text-gray-600">Mod: {getModifier(form[stat])}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block mb-1">Tiradas de salvación competentes:</label>
          <div className="grid grid-cols-3 gap-2">
            {["str", "dex", "con", "int", "wis", "cha"].map((save) => (
              <label key={save} className="flex items-center">
                <input
                  type="checkbox"
                  checked={proficiencies.saves[save] || false}
                  onChange={() => handleProfChange("saves", save)}
                  className="mr-2"
                />
                {save.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1">Habilidades competentes:</label>
          <div className="grid grid-cols-2 gap-2">
            {["acrobatics","animalHandling","arcana","athletics","deception","history","insight","intimidation","investigation","medicine","nature","perception","performance","persuasion","religion","sleightOfHand","stealth","survival"].map((skill) => (
              <label key={skill} className="flex items-center">
                <input
                  type="checkbox"
                  checked={proficiencies.skills[skill] || false}
                  onChange={() => handleProfChange("skills", skill)}
                  className="mr-2"
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={savePdf}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </div>

      {pdfUrl && (
        <div className="bg-gray-100 rounded shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Vista previa del PDF</h3>
          <iframe
            src={pdfUrl}
            title="Vista previa PDF"
            width="100%"
            height="600px"
            className="border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default CharacterForm;
