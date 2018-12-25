import React, { Component } from 'react';
import  DataStore  from '../stores/DataStore';
import  * as DataActions  from '../actions/DataActions';
import './styles/Item.css';

class Item extends Component {
  constructor(props){
    super(props);
    this.getItemsOf = this.getItemsOf.bind(this);
  }

  /**
   * @param type: proper case type
   * @param name: name of the item
   */
  getItemsOf(type, name){
    switch (type) {
      case 'country':
        DataActions.getCities(name);
        break;
      case 'city':
        DataActions.getCompanies(name);
        break;
      case 'company':
        DataActions.getLocation(name);
        break;
      default: console.log('NO SUCH TYPE');
    }
  }

  render() {
    const className = (this.props.name === DataStore.current[this.props.type]) ? 'item selected' : 'item';
    return(
      <li className={className}
         onClick={() => {
           if(this.props.name !== DataStore.current[this.props.type]){
             this.getItemsOf(this.props.type, this.props.name);
           }
         }}>
        {this.props.name}
      </li>
    );
  }
}

export default Item;
