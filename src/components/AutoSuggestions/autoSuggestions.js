import React from 'react';
import Autosuggest from 'react-autosuggest';
import { filter } from 'fuzzaldrin';
import { highlightChars } from "highlight-matches-utils";
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
        };
    }

    getSuggestionValue = suggestion => suggestion.label;

    renderSuggestion = suggestion => (
        <div>
            {highlightChars(suggestion.label, this.state.value, s => (
                <span className={"highlightedText"} key={suggestion.label + s}>{s}</span>
            ))}
        </div>
    );

    getSuggestions = inputValue => {
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : filter(this.props.parties, inputValue, { key: 'label', maxResults: 5 });
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
        },100);
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