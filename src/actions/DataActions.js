import dispatcher from '../inc/dispatcher';

export function getCities(country){
  dispatcher.dispatch({
    type: 'GET_CITIES',
    data: country
  });
}

export function getCompanies(city){
  dispatcher.dispatch({
    type: 'GET_COMPANIES',
    data: city
  });
}

export function getLocation(company){
  dispatcher.dispatch({
    type: 'GET_COMPANY_LOC',
    data: company
  });
}
