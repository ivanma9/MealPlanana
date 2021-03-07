import React, { Component } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
  }

  handleOnFocus() {

  }

  handleOnSearch() {

  }

  handleOnSelect() {

  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1%' }}>
        <div style={{ width: '20%' }}>
          <ReactSearchAutocomplete
            items={['test1', 'test2', 'testred', 'testblue']}
            onSearch={this.handleOnSearch}
            onSelect={this.handleOnSelect}
            onFocus={this.handleOnFocus}
            autoFocus
          />
        </div>
      </div>
    );
  }
}
