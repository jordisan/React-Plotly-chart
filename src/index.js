import React from 'react';
import ReactDOM from 'react-dom';
import BudgetChart from './BudgetChart.js';

ReactDOM.render(
  <BudgetChart dataurl="/data.json"></BudgetChart>,
  document.getElementById('app')
);

module.hot.accept();