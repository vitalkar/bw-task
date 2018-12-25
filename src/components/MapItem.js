import React, { Component } from 'react';
import './styles/MapItem.css';

class MapItem extends Component {
  constructor(props){
    super(props)
    this.geoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    this.mapsUrl = 'https://maps.googleapis.com/maps/api/js';
    this.apiKey = 'AIzaSyCMx4iDaFk3yaGp6YZhrQK1bn-aYi_5SLg';
  }
  /**
   * get the current company location and display a proper map by location
   * @return {[type]} [description]
   */
  getLocation(){
    const data = this.props.location;
    const url = `${this.geoCodeUrl}?key=${this.apiKey}&address=${data.address},${data.city},${data.country},${data.postal}`;
    //fetch map geocode
    fetch(url)
    .then(res => res.json())
    .then(res => {
       if (res.results.length > 0){
            this.initMap(res.results[0].geometry.location);
       }
    })
    .catch(err => console.log(err));
  }

  /**
   * initiate map & marker
   * @param location current company location
   */
  initMap(location) {
    const map = new window.google.maps.Map(window.document.getElementById('map'), {
    center: location,
    zoom: 12
  });

    const marker = new window.google.maps.Marker({
      position: location,
      map: map
    });
  }
  /**
   * load map for view
   */
  loadMap() {
    window.initMap = this.initMap; //bind initMap to global object
    loadScript(`${this.mapsUrl}?key=${this.apiKey}`);
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(){
    this.getLocation();
  }

  render() {
    return (
      <div className='map_container'>
        <h3 className='title'>Map</h3>
        <div id='map'></div>
      </div>
      );
    }
  }

/**
 * create & append the maps script to the global object
 * @param url map url
 */
function loadScript(url) {
  let index = window.document.getElementById('root'),
      script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.after(script);
}

export default MapItem;
