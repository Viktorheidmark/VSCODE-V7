
addMdToPage("## academic pressure and CGPA")

// Hämta data från databasen
let students = await dbQuery("SELECT Academic_Pressure, CGPA FROM results");

// Omvandla till rena arrayer
let pressureLevels = students.map(s => s.Academic_Pressure);
let cgpaValues = students.map(s => s.CGPA);

// Beräkna Pearson-korrelation
let correlation = s.sampleCorrelation(pressureLevels, cgpaValues);

console.log("Korrelationskoefficient:", correlation);


//Korrelationskoefficient = -0.022238849696490755

//	•	Om r ≈ 1, starkt positiv korrelation (hög stress → hög CGPA)
//	•	Om r ≈ -1, starkt negativ korrelation (hög stress → låg CGPA)
//	•	Om r ≈ 0, ingen korrelation


// Skapa data för scatterplot
let scatterData = [['Akademisk press', 'CGPA']];
students.forEach(s => {
  scatterData.push([s.Academic_Pressure, s.CGPA]);
});


// Omvandla data till Google Charts-format
let formattedData = makeChartFriendly(students, 'Academic_Pressure', 'CGPA');

// Lägg till scatter plot
drawGoogleChart({
  type: 'ScatterChart',
  data: formattedData,
  options: {
    title: 'Samband mellan Akademisk Stress och CGPA',
    height: 500,
    width: 800,
    hAxis: { title: 'Akademisk Stress' },
    vAxis: { title: 'CGPA' },
    legend: 'none',
    trendlines: { 0: {} } // Lägger till en trendlinje
  }
});


// Skapa data för linjediagrammet
let lineChartData = [['Academic Pressure', 'CGPA']];
students.forEach(s => {
  lineChartData.push([s.Academic_Pressure, s.CGPA]);
});


// Omvandla data till Google Charts-format
let lineChartFormattedData = makeChartFriendly(students, 'Academic_Pressure', 'CGPA');



// Lägg till linjediagram
drawGoogleChart({
  type: 'LineChart',
  data: lineChartFormattedData,
  options: {
    title: 'Jämförelse mellan Akademisk Stress och CGPA',
    height: 500,
    width: 800,
    hAxis: { title: 'Akademisk Stress' },
    vAxis: { title: 'CGPA' },
    legend: { position: 'bottom' }
  }
});









