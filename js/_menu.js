createMenu('Psykisk-ohälsa-bland-studerande', [
  { name: 'intro', script: 'intro.js' },
  { name: 'ålder män och kvinnor', sub: [
    { name: 'ålder män kvinnor tillsammans', script: 'age.js' },
    { name: 'ålder män kvinnor separat', script: 'test.js' },
  ]},

  { name: 'KolmorgovSmirnov_test', script: 'kolmogorovSmirnov.js' },


  { name: 'könsfördelning', script: 'females-and-men.js' },
  { name: 'självmords tankar', script: 'suicide-men-female.js' },
  { name: 'depression', script: 'depression-man-women.js' },
  { name: 'familjehistorik', script: 'family-vs-depression.js' },
  { name: 'Normalfördelning och T-test', script: 'ex.js' },
  { name: 'p-value', script: 'p-value.js' }

]);