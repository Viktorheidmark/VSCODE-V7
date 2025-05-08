
let genders = (await dbQuery(
  'SELECT DISTINCT Gender FROM results'
)).map(x => x.Gender);

let currentage = addDropdown('kön', genders);

addMdToPage(`
  ## ${currentage}
`);

let dataForChart = await dbQuery(
  `SELECT Age FROM results WHERE Gender = '${currentage}'`
);

drawGoogleChart({
  type: 'Histogram',
  data: makeChartFriendly(dataForChart, 'Age'),
  options: {
    height: 500,
    width: 1250,
    histogram: { bucketSize: 5 },
    hAxis: { title: 'Ålder' },
    vAxis: { title: 'Antal studenter' }
  }
});
addMdToPage(`I detta diagram så kan man se att ålder och antal studenter i skillnad mellan män och kvinnor`)