import React, { Component } from 'react';
import DataStore from '../stores/DataStore';
import  * as DataActions  from '../actions/DataActions';

import List from './List';
import MapItem from './MapItem';
import './styles/App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      countries: [],
      cities: [],
      companies: [],
      location: {}
    };
  }

  componentDidMount(){
    //set event listeners
    DataStore.on('init', () => {
      this.setState({
        countries: DataStore.getCountries(),
        cities: DataStore.getCities(),
        companies: DataStore.getCompanies(),
        location: DataStore.getLocation()
      });
    });

    DataStore.on('get_cities', (value) => {
        this.setState({
          cities: DataStore.getCities()
        });
    });

    DataStore.on('get_companies', (value) => {
      this.setState({
        companies: DataStore.getCompanies()
      });

    });

    DataStore.on('get_company_loc', (value) => {
      this.setState({
        location: DataStore.getLocation()
      });
    });
    // init data
    DataActions.init();
  }

  render() {
    return (
      <div className="App">
        <List title='Countries' type='country' items={this.state.countries} />
        <List title='Cities' type='city' items={this.state.cities} />
        <List title='Companies' type='company' items={this.state.companies} />
        <MapItem location={this.state.location}></MapItem>
      </div>
    );
  }
}
export default App;
