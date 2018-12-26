import { EventEmitter } from 'events';
import dispatcher from '../inc/dispatcher';
import * as clients from '../inc/clients.json';

class DataStore extends EventEmitter {

  constructor() {
    super();
    this.current = {
      country: '',
      city: '',
      company: '',
      location: ''
    };
    this.constructData(clients.Customers); //construct raw data
  }

  /**
   * constructs the raw data into items map & locations map
   * @param data: raw data
   */
  constructData(data){
    //initiate the result maps
    this.items = new Map();
    this.locations = new Map();
    for (var i = 0; i < data.length; i++) {
      // console.log(i);
      // console.log(data[i]);
      //if country already exists
      if(this.items.has(data[i].Country)) {
        //if city already exists
        if(this.items.get(data[i].Country).has(data[i].City)) {
          //add company
          let companies = (this.items.get(data[i].Country)).get(data[i].City);
          companies.push(data[i].CompanyName);
          this.items.get(data[i].Country).set(data[i].City, companies);
        } else {
          //add city & company
          this.items.get(data[i].Country).set(data[i].City, [ data[i].CompanyName ]);
        }
      } else {
        //set new item entry
        let value =  new Map().set(data[i].City, [ data[i].CompanyName ]);
        this.items.set(data[i].Country, value);
      }

      //set location of company
      this.locations.set(data[i].CompanyName, {
        id: data[i].Id,
        country: data[i].Country,
        city: data[i].City,
        address: data[i].Address,
        postal: data[i].PostalCode,
      });
    }
    //sort data
    //sort countries by ascending order
    this.items = new Map([...this.items].sort( (a, b) => b[1].size - a[1].size ));
    //sort cities by number of companies
    this.items.forEach((cities, countryName, country) => {
      // sort companies in alphabetic order
      cities.forEach( (companies) => {
        companies.sort((a, b) => b - a );
      });
      //sort cities by ascending order
      let newItem = new Map([...(cities.entries())].sort( (a, b) => b[1].length - a[1].length ));
      this.items.set(countryName, newItem);
    });
    //assign current state
    this.current.country = this.items.keys().next().value;
    this.setInitCityState();
    this.setInitCompanyState();
}

  /**
   * determine current city
   */
  setInitCityState(){
    this.current.city = this.items.get(this.current.country).keys().next().value;
  }
  /**
   * determine current comapny and location
   */
  setInitCompanyState(){
    this.current.company = this.items.get(this.current.country).get(this.current.city)[0];
    this.current.location = this.locations.get(this.current.company);
  }

  /**
   * get all countries
   */
  getCountries(){
    return [...this.items.keys()];
  }

  /**
   * get cities of current country
   */
  getCities(){
    return [...this.items.get(this.current.country).keys()]
  }

  /**
   * get companies of current city
   */
  getCompanies(){
    let item = this.items.get(this.current.country);
    return item.get(this.current.city);
  }
  /**
   * get location of current city
   */
  getLocation(){
    return this.locations.get(this.current.company);
  }

  /**
   * handle actions recieved from DataActions and emit proper events
   * @param action object whith proper action information
   */
  handleActions(action){
    switch (action.type) {
      case 'INIT':
        this.emit('init');
        break;
      case 'GET_CITIES':
        this.current.country = action.data; // set current country
        this.setInitCityState();
        this.setInitCompanyState();
        this.emit('get_cities'); //pass country name
        this.emit('get_companies');
        this.emit('get_company_loc');
        break;
      case 'GET_COMPANIES':
        this.current.city = action.data;
        this.setInitCompanyState();
        this.emit('get_companies');
        this.emit('get_company_loc');
        break;
      case 'GET_COMPANY_LOC':
        this.current.company = action.data;
        this.emit('get_company_loc');
        break;
      default:
    }
  }

}
const dataStore = new DataStore();
dispatcher.register(dataStore.handleActions.bind(dataStore));
export default dataStore;
