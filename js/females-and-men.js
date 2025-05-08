addMdToPage("# Jämförelse mellan män och kvinnor i undersökningen");

addMdToPage(`Denna visar hur stor procentandel av undersökningen som är män och kvinnor och i dropdownen så kann man byta från en piechart till en columnchart
  där man istället kan se totalt antal kvinnor och män`)

// Hämta kön från databasen
let students = await dbQuery("SELECT Gender FROM results");

// Räkna antal män och kvinnor
let maleCount = students.filter(s => s.Gender === 'Male').length;
let femaleCount = students.filter(s => s.Gender === 'Female').length;

// Skapa data för Google Charts
let genderData = [
  ['Kön', 'Antal'],
  ['Kvinnor', femaleCount],
  ['Män', maleCount]
];

// Skapa en dropdown för diagramtyp
let chartType = addDropdown("Diagramtyp", ["PieChart", "BarChart"]);

addMdToPage(`## Vald diagramtyp: ${chartType}`);

let chartOptions = {
  title: 'Könsfördelning',
  height: 600,
  width: 800
};

// Lägg till extra alternativ om det är ett BarChart
if (chartType === 'BarChart') {
  chartOptions.hAxis = { title: 'Antal personer' };
  chartOptions.vAxis = { title: 'Kön' };
  chartOptions.legend = { position: 'none' };
  chartOptions.colors = ['#1E88E5'];
}

// Rita diagrammet baserat på vald typ
drawGoogleChart({
  type: chartType,
  data: genderData,
  options: chartOptions
});