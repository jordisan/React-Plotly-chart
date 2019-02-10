import React from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import 'whatwg-fetch';

export default class BudgetChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      revision: 0, 
      data: null, 
      allmarkets: null, 
      currentmarkets: null
    };
  }
  
  componentDidMount() {
    const setState = this.setState.bind(this);
    const state = this.state;
  
    // get data from JSON file
    fetch(this.props.dataurl)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      var bar1 = {type: 'bar', name: 'Brief', x:[], y:[], marker: {color: 'rgb(117,164,68)'}};
      var bar2 = {type: 'bar', name: 'Proposal', x:[], y:[], marker: {color: 'rgb(235,170,68)'}};
      var bar3 = {type: 'bar', name: 'Postlog Spend', x:[], y:[], marker: {color: 'rgb(106,116,124)'}};
      var markets = [];
      
      // parse json to create graph data
      json.forEach(function(val) {
        var x = val['mip']['name'] + ' (' + val['mip']['code'] + ')'
        markets.push({value: x, label: val['mip']['code']});
        bar1.x.push(x);
        bar2.x.push(x);
        bar3.x.push(x);
        bar1.y.push(val['briefNetSpendInEuro']); 
        bar2.y.push(val['proposalSpendInEuro']);
        bar3.y.push(val['postNetSpendInEuro']);
      });
      setState({allmarkets: markets, currentmarkets: markets, data : [bar1, bar2, bar3]});
    }).catch(function(ex) {
      console.log('parsing failed', ex);
    })
  }

  updateMarkets(markets) {
    this.setState({
      currentmarkets: markets, 
      data: this.state.data.map((bar) => {
        var newbar = bar;
        // update chart filter with selected markets
        bar.transforms = [{type: 'filter', target: 'x', operation: '{}', value: markets.map(m => m.value)}];
        return bar;
      }),
      revision: this.state.revision + 1  // to force redraw
    });
  }

  render() {
    const setState = this.setState.bind(this);
    return (
      this.state.data === null ? 'loading...' :
      <div className="budgetchart">
        <Select
          defaultValue={this.state.currentmarkets}
          onChange={s => this.updateMarkets(s)}
          options={this.state.allmarkets}
          isMulti={true}
          className='selector'
        />
        <Plot
          name="plot"
          data={this.state.data}
          layout={{
            title: null, 
            hovermode: 'x', 
            yaxis: {hoverformat: ',.r', ticksuffix: '€', automargin: true},
            legend: {orientation:'h', x:.1, y:9000000}
          }}
          revision={this.state.revision}
        />
      </div>
    );
  }
}
