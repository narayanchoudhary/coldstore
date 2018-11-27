import React from 'react';
import Autosuggest from 'react-autosuggest';
import { filter } from 'fuzzaldrin';
import { Redirect } from 'react-router-dom';
import './autoSuggestion.css';

export default class ReactAutoSuggest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            suggestions: [],
            redirectToParty: false,
            partyId: null,
            parties: []
        };
    }

    getSuggestionValue = suggestion => {
        let address = this.props.addresses.filter(address => address.value === suggestion.address)[0];
        return suggestion.label + (address && address.label);
    }


    renderSuggestion = suggestion => {
        let address = this.props.addresses.filter(address => address.value === suggestion.address)[0];
        return <div> {suggestion.label} <span className="addressOfSuggestion">{address && address.label}</span> </div>;
    }


    getSuggestions = inputValue => {
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : filter(this.props.parties, inputValue, { key: 'label', maxResults: 8 });
    };

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleSelectedSuggetion = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        this.setState({ ...this.state, partyId: suggestion.value, redirectToParty: true });
        setTimeout(() => {
            this.props.closer();
        }, 100);
    }

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Search parties...',
            value,
            onChange: this.onChange,
            autoFocus: true,
            className: 'searchBox form-control',
            onKeyPress: this.handleKeyPress
        };

        return (
            <div className="autoSuggestion">
                {this.state.redirectToParty ? <Redirect to={"/parties/singleParty/" + this.state.partyId} /> : null}
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected={this.handleSelectedSuggetion}
                    highlightFirstSuggestion={true}
                />
            </div>
        );
    }
}