import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Autosuggest from 'react-autosuggest';

// Search bar function that returns filtered recipe objects based on entered keywords
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getTestStr = this.getTestStr.bind(this);
    this.state = {
      selectedKeySet: 'Title',
      currentSearch: '',
      suggestions: [],
      value: '',
    };
  }

  onSuggestionsFetchRequested({ value }) {
    const suggestions = this.getSuggestions(value);
    this.props.updateParent(suggestions);
    this.setState({
      suggestions,
    });
  }

  onSuggestionsClearRequested() {

  }

  onChange(event, { newValue }) {
    if (newValue === '') {
      this.props.updateParent([]);
      this.setState({
        suggestions: [],
      });
    }
    this.setState({
      value: newValue,
    });
  }

  getTestStr(recipe) {
    if (this.state.selectedKeySet === 'Title') {
      return `${recipe.title}`;
    }
    if (this.state.selectedKeySet === 'Description') {
      return `${recipe.description}`;
    }
    return `${recipe.tags.toString()}`;
  }

  getSuggestions(value) {
    const escapedValue = value.toString().trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp(`\\b${escapedValue}`, 'i');

    return this.props.recipes.filter((recipe) => regex.test(
      `${this.getTestStr(recipe)}`,
    ));
  }

  render() {
    const inputProps = {
      placeholder: 'Enter a recipe keyword',
      value: this.state.value,
      onChange: this.onChange,
    };
    return (
      <div style={{
        display: 'flex', width: '100%', justifyContent: 'center', marginTop: '1%', flexDirection: 'row',
      }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}>
          <div>
            {' '}
            <Dropdown>
              <Dropdown.Toggle
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  width: 120,
                  height: 37,
                }}
                id="dropdown-basic"
              >
                {this.state.selectedKeySet}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.setState({ selectedKeySet: 'Title', value: '' })} href="#/Title">Title</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ selectedKeySet: 'Tag', value: '' })} href="#/Tag">Tag</Dropdown.Item>
                <Dropdown.Item onClick={() => this.setState({ selectedKeySet: 'Description', value: '' })} href="#/Description">Description</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {' '}
            {this.state.currentSearch}
          </div>
          <div style={{ width: '20%', paddingLeft: '2%' }}>
            <Autosuggest
              renderSuggestion={() => <div />}
              theme={{
                inputFocused: {
                  width: 400,
                  height: 37,
                  color: this.state.suggestions.length === 0 ? 'red' : 'black',
                  borderWidth: 2,
                },
                input: {
                  width: 400,
                  height: 37,
                },
              }}
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={(suggestion) => suggestion.name}
              inputProps={inputProps}
              renderSuggestionsContainer={() => false}
            />

          </div>
        </div>

      </div>
    );
  }
}
