let students = await dbQuery("SELECT Academic_Pressure, CGPA FROM results");


// Gruppindelning av CGPA per stressnivå
let stressGroups = { 1: [], 2: [], 3: [], 4: [], 5: [] };

students.forEach(s => {
  const level = parseInt(s.Academic_Pressure);
  if (stressGroups[level]) {
    stressGroups[level].push(parseFloat(s.CGPA));
  }
});

// Funktion för att hämta boxplotvärden (min, Q1, Q3, max)
function getBoxStats(values) {
  values.sort((a, b) => a - b);
  const q1 = values[Math.floor(values.length * 0.25)];
  const q2 = values[Math.floor(values.length * 0.5)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  return [min, q1, q3, max]; // CandlestickChart använder [low, open, close, high]
}

// Förbered chartData
let boxData = [['Stressnivå', '', '', '', '']];
for (let level = 1; level <= 5; level++) {
  let values = stressGroups[level];
  if (values.length >= 4) {
    let [min, q1, q3, max] = getBoxStats(values);
    boxData.push([`Stress ${level}`, min, q1, q3, max]);
  }
}

// Visa rubrik
addMdToPage("## Boxplot (simulerad): CGPA per akademisk stressnivå");

// Rita candlestick-boxploten
drawGoogleChart({
  type: 'CandlestickChart',
  data: boxData,
  options: {
    title: 'CGPA-fördelning per nivå av akademisk stress',
    legend: 'none',
    height: 500,
    width: 900,
    bar: { groupWidth: '60%' },
    vAxis: { title: 'CGPA' },
    hAxis: { title: 'Stressnivå (1=låg, 5=hög)' },
    candlestick: {
      hollowIsRising: true,
      fallingColor: { strokeWidth: 0, fill: '#1E88E5' },
      risingColor: { strokeWidth: 0, fill: '#1E88E5' }
    }
  }
});