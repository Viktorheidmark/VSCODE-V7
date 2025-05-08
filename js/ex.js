// Hämta data från databasen
let data = await dbQuery(`SELECT Age, Depression FROM results`);
data = data.filter(d => d.Age !== null && d.Depression !== null);

// Definiera åldersintervall
const intervals = [[15,19],[20,24],[25,29],[30,34],[35,39],[40,44],[45,49],[50,54],[55,59]];

// Dropdown-meny för diagramtyp
let chartType = addDropdown("Diagramtyp", [
  "Normalfördelning + T-test",
  "Histogram: Åldersfördelning",
  "Andel depression per åldersgrupp"
]);



// ➤ 2. HISTOGRAM: Åldersfördelning
if (chartType === "Histogram: Åldersfördelning") {
  let histogramData = [["Åldersintervall", "Antal personer", { role: "annotation" }]];
  let ageGroupCount = {};
  intervals.forEach(([start, end]) => ageGroupCount[`${start}-${end}`] = 0);

  data.forEach(d => {
    let age = Number(d.Age);
    for (let [start, end] of intervals) {
      if (age >= start && age <= end) {
        ageGroupCount[`${start}-${end}`]++;
        break;
      }
    }
  });

  Object.entries(ageGroupCount).forEach(([label, count]) => {
    histogramData.push([label, count, count.toString()]);
  });

  addMdToPage("### Förklaring\nDetta histogram visar hur deltagarna är fördelade över olika åldersintervall.");

  drawGoogleChart({
    type: "ColumnChart",
    data: histogramData,
    options: {
      title: "Åldersfördelning",
      hAxis: { title: "Åldersintervall", slantedText: true, slantedTextAngle: 45 },
      vAxis: { title: "Antal personer" },
      legend: "none",
      colors: ["#3366cc"],
      bar: { groupWidth: "75%" },
      chartArea: { width: '80%', height: '70%' },
      annotations: {
        alwaysOutside: true,
        textStyle: { fontSize: 12, color: '#555' }
      }
    }
  });
}

// ➤ 3. Andel med depression per åldersgrupp
else if (chartType === "Andel depression per åldersgrupp") {
  let depressionGroupData = [["Åldersintervall", "Andel depression"]];
  let ageGroups = {};
  intervals.forEach(([start, end]) => ageGroups[`${start}-${end}`] = []);

  data.forEach(d => {
    let age = Number(d.Age);
    let depression = Number(d.Depression);
    for (let [start, end] of intervals) {
      if (age >= start && age <= end) {
        ageGroups[`${start}-${end}`].push(depression);
        break;
      }
    }
  });

  Object.entries(ageGroups).forEach(([group, values]) => {
    depressionGroupData.push([group, s.mean(values)]);
  });
  
  
  addMdToPage("### Förklaring\nDetta didagram visar andel med depression per ålders intervall");

  drawGoogleChart({
    type: "ColumnChart",
    data: depressionGroupData,
    options: {
      title: "Andel med depression per åldersintervall",
      vAxis: { title: "Andel", format: "percent" },
      hAxis: { title: "Åldersintervall" },
      legend: "none",
      colors: ["#1a73e8"]
    }
  });
}

// ➤ 4. Normalfördelningsanalys + T-test
else if (chartType === "Normalfördelning + T-test") {
  let ageData = data.map(d => Number(d.Age));
  let skewness = s.sampleSkewness(ageData);
  let kurtosis = s.sampleKurtosis(ageData);
  let normal = Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 1;

  let medianAge = s.median(ageData);
  let younger = data.filter(d => Number(d.Age) <= medianAge).map(d => Number(d.Depression));
  let older = data.filter(d => Number(d.Age) > medianAge).map(d => Number(d.Depression));

  let t = s.tTestTwoSample(younger, older);
  let meanY = s.mean(younger);
  let meanO = s.mean(older);

  addMdToPage(`
  ### Normalfördelningsanalys (Ålder)
  - **Skewness (symmetri)**: ${skewness.toFixed(3)}
  - **Kurtosis (toppighet)**: ${kurtosis.toFixed(3)}
  - ${normal ? 'Åldern verkar vara normalfördelad' : 'Åldern verkar **inte** vara normalfördelad'}

  ### T-test: Depression hos yngre vs äldre (medianålder = ${medianAge})
  - Andel med depression (yngre): ${(meanY * 100).toFixed(1)}%
  - Andel med depression (äldre): ${(meanO * 100).toFixed(1)}%
  - T-värde: ${t.toFixed(3)}

  > *högt absolut t-värde tyder på signifikant skillnad.*
  `);

  drawGoogleChart({
    type: "ColumnChart",
    data: [
      ['Grupp', 'Andel depression'],
      ['Yngre (≤ ' + medianAge + ')', meanY],
      ['Äldre (> ' + medianAge + ')', meanO]
    ],
    options: {
      title: 'Andel med depression – yngre vs äldre',
      vAxis: { title: 'Andel', format: 'percent' },
      legend: 'none',
      colors: ['#e6693e']
    }
  });
}
