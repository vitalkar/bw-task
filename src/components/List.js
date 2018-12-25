import React, { Component } from 'react';
import Item from './Item';
import './styles/List.css';

class List extends Component {
  render() {
    const listItems = this.props.items.map( item =>
      <Item className='item' key={item} type={this.props.type} name={item}  /> );
    return (
      <div className='container'>
        <h3 className='title'>{this.props.title}</h3>
        <ul className='list'>{listItems}</ul>
      </div>
    );
  }
}
export default List;
