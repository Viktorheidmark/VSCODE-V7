
// Hämta data från databasen
let students = await dbQuery("SELECT Academic_Pressure, CGPA FROM results");

// Omvandla data till rätt format
let pressureLevels = students.map(s => s.Academic_Pressure);
let cgpaValues = students.map(s => s.CGPA);

// Visa en rubrik
addMdToPage("## Samband mellan akademisk stress och CGPA");

// Beräkna Pearson-korrelation
let correlation = s.sampleCorrelation(pressureLevels, cgpaValues);

addMdToPage(`
  ### Pearson-korrelation mellan akademisk stress och CGPA
  * **Korrelationskoefficient (r): ${correlation.toFixed(3)}**  
  * Om r ≈ **1** → starkt positivt samband (hög stress → hög CGPA)  
  * Om r ≈ **-1** → starkt negativt samband (hög stress → låg CGPA)  
  * Om r ≈ **0** → inget samband  
`);

// Skapa data för scatterplot
let scatterData = [['Akademisk stress', 'CGPA']];
students.forEach(s => {
  scatterData.push([s.Academic_Pressure, s.CGPA]);
});

// Rita scatterplot med Google Charts
drawGoogleChart({
  type: 'ScatterChart',
  data: makeChartFriendly(students, 'Academic_Pressure', 'CGPA'),
  options: {
    title: 'Samband mellan akademisk stress och CGPA',
    hAxis: { title: 'Akademisk stress' },
    vAxis: { title: 'CGPA' },
    height: 500,
    width: 700,
    legend: 'none'
  }
});

// Hypotesprövning: T-test på CGPA beroende på hög/låg stress
let medianPressure = s.median(pressureLevels);
let highStressCGPA = students.filter(s => s.Academic_Pressure >= medianPressure).map(s => s.CGPA);
let lowStressCGPA = students.filter(s => s.Academic_Pressure < medianPressure).map(s => s.CGPA);




let highStressVector = new jerzy.Vector(highStressCGPA.slice(0,1000));
let lowStressVector = new jerzy.Vector(lowStressCGPA.slice(0,1000));


let pValue = new jerzy.Nonparametric.kolmogorovSmirnov(lowStressVector, highStressVector).p;



let hypothesisText = `
  ### Hypotesprövning: Påverkar hög stress CGPA?
  * Vi jämför CGPA för studenter med hög och låg akademisk stress.
  * **kolmogorovSmirnov-test: ${pValue.toFixed(3)}
  * kolmogorovSmirnov-testet Används för att jämföra fördelningen av två dataset eller för att testa om ett dataset följer en viss fördelning.
  * Skillnaden mellan p-test och kolmogorovSmirnov-test är att t-test används när du vill jämföra medelvärden mellan två grupper och kolmogorovSmirnov-test när du vill jämföra fördelningar**
`;

if (pValue < 0.05) {
  hypothesisText += `
  * **p < 0.05** → Det finns **statistiskt signifikant skillnad** mellan grupperna.
  * Hög akademisk stress påverkar sannolikt CGPA.
  `;
} else {
  hypothesisText += `
  * **p > 0.05** → Det finns **ingen signifikant skillnad** mellan grupperna.
  * Akademisk stress verkar **inte** påverka CGPA på ett tydligt sätt.
  `;
}

addMdToPage(hypothesisText);

// Visa det faktiska medelvärdet av CGPA
addMdToPage(`
  ### Medelvärde av CGPA
  * **Studenter med hög stress:** ${s.mean(highStressCGPA).toFixed(2)}
  * **Studenter med låg stress:** ${s.mean(lowStressCGPA).toFixed(2)}
`);