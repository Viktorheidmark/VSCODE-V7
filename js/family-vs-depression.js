addMdToPage(`
# Familjehistorik av psykisk sjukdom och självmordstankar
Vi analyserar sambandet mellan familjehistorik av psykisk sjukdom och självmordstankar.
`);

// Hämta data från databasen
let data = await dbQuery("SELECT Family_History_of_Mental_Illness, Have_you_ever_had_suicidal_thoughts FROM results");

// Räkna antalet personer i varje kategori
let counts = {
    "Ja - Har familjehistorik": { "Ja - Självmordstankar": 0, "Nej - Inga självmordstankar": 0 },
    "Nej - Ingen familjehistorik": { "Ja - Självmordstankar": 0, "Nej - Inga självmordstankar": 0 }
};

data.forEach(row => {
    let familyHistory = row.Family_History_of_Mental_Illness === 1 ? "Ja - Har familjehistorik" : "Nej - Ingen familjehistorik";
    let suicidalThoughts = row.Have_you_ever_had_suicidal_thoughts === 1 ? "Ja - Självmordstankar" : "Nej - Inga självmordstankar";
    counts[familyHistory][suicidalThoughts]++;
});

// Dropdown för diagramtyp
let diagramTyp = addDropdown("Diagramtyp", ["Stapeldiagram", "Cirkeldiagram (per grupp)"]);

if (diagramTyp === "Stapeldiagram") {
  // Stapeldiagramdata
  let chartData = [
      ["Familjehistorik", "Ja - Självmordstankar", "Nej - Inga självmordstankar"],
      [
        "Ja - Har familjehistorik",
        counts["Ja - Har familjehistorik"]["Ja - Självmordstankar"],
        counts["Ja - Har familjehistorik"]["Nej - Inga självmordstankar"]
      ],
      [
        "Nej - Ingen familjehistorik",
        counts["Nej - Ingen familjehistorik"]["Ja - Självmordstankar"],
        counts["Nej - Ingen familjehistorik"]["Nej - Inga självmordstankar"]
      ]
  ];

  drawGoogleChart({
      type: 'ColumnChart',
      data: chartData,
      options: {
          title: "Självmordstankar vs Familjehistorik av psykisk sjukdom",
          hAxis: { title: "Familjehistorik" },
          vAxis: { title: "Antal personer" },
          height: 500,
          width: 800,
          isStacked: true
      }
  });

} else if (diagramTyp === "Cirkeldiagram (per grupp)") {
  // PieChart för "Har familjehistorik"
  let pie1 = [
    ['Svar', 'Antal'],
    ['Ja - Självmordstankar', counts["Ja - Har familjehistorik"]["Ja - Självmordstankar"]],
    ['Nej - Inga självmordstankar', counts["Ja - Har familjehistorik"]["Nej - Inga självmordstankar"]]
  ];
  drawGoogleChart({
    type: 'PieChart',
    data: pie1,
    options: {
      title: 'Har familjehistorik',
      height: 400,
      width: 500
    }
  });

  // PieChart för "Ingen familjehistorik"
  let pie2 = [
    ['Svar', 'Antal'],
    ['Ja - Självmordstankar', counts["Nej - Ingen familjehistorik"]["Ja - Självmordstankar"]],
    ['Nej - Inga självmordstankar', counts["Nej - Ingen familjehistorik"]["Nej - Inga självmordstankar"]]
  ];
  drawGoogleChart({
    type: 'PieChart',
    data: pie2,
    options: {
      title: 'Ingen familjehistorik',
      height: 400,
      width: 500
    }
  });
}