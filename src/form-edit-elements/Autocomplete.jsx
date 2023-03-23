import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Example from "./MultiSelectAll";
import makeAnimated from "react-select/animated";
import MySelect from "./MySelect";
import { components } from "react-select";
import { remove } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { ro } from "date-fns/locale";

const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const MultiValue = (props) => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const animatedComponents = makeAnimated();

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    suggestions: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
      utilities: [],
      optionSelected: "",
      number: 0,
    };
  }

  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.title.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (params) => {
    console.log(this.state.utilities);
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: params.title,
      properties: params.key,
      addProperties: false,
    });
    this.setState({
      utilities: [...this.state.utilities, ...[{ name: params.title }]],
    });
  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  handleChange = (selected) => {
    this.setState({
      optionSelected: selected,
      addProperties: false,
    });

    // const result =this.state.utilities.map((value,index)=>  console.log(value))
  };

  deleteUtilities = (name, indexvalue) => {
    let result;
    let result2;
    let delRes;
    this.state.utilities.map((value) => {
      result = value?.properties?.filter((row, index) => index != indexvalue);
    });
    result2 = this.state.utilities.filter((data, index) => data.name === name);
    result2[0].properties = result;
    // this.setState({utilities: ...this.state.utilities, ...result2});

    // this.setState({ optionSelected: result });
    // console.log(this.state.optionSelected);
  };

  finalSelectedData = (params) => {
    console.log(params);
    console.log(this.state.utilities);
    this.state.utilities?.map((row, index) => {
      this.state.utilities[params].properties = this.state.optionSelected;
    });
    params++;
    this.setState({ number: params });
  };
  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      deleteUtilities,
      finalSelectedData,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        utilities,
        properties,
        addProperties,
        number,
        optionSelected,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="suggestions">
            {filteredSuggestions?.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                // <option onClick={onClick}value={suggestion.key} className={className}>{suggestion.title}</option>
                <li
                  className={className}
                  key={suggestion.title}
                  onClick={() => onClick(suggestion)}
                >
                  {suggestion.title}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <>
        {addProperties && utilities ? (
          <>
            {utilities?.map((data) => {
              return (
                <>
                  <h6>{data.name}:</h6>
                  <div>
                    {data?.properties?.map((value, index) => {
                      return (
                        <>
                          <div className="row" key={index}>
                            <div className="col-sm-4 position-relative">
                              <label>
                                {value?.label}
                                <button
                                  style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    width: "32px",
                                    height: "100%",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "#f5f5f5",
                                    textAlign: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    deleteUtilities(data.name, index)
                                  }
                                >
                                  <i
                                    className="fa fa-times"
                                    style={{ lineHeight: "36px" }}
                                  />
                                </button>
                              </label>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </>
        ) : null}

        <div className="row">
          <div className="col">
            <label>Select Utlities</label>
          </div>
          <div className="col">
            <label>Select Properties</label>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="text"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={userInput}
            />
            {suggestionsListComponent}
          </div>
          {properties && userInput ? (
            <>
              <div className="col">
                <MySelect
                  options={properties}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option, MultiValue, animatedComponents }}
                  onChange={this.handleChange}
                  allowSelectAll={true}
                  value={this.state.optionSelected}
                />
              </div>
              <div className="col-sm-3">
                <div className="dynamic-options-actions-buttons">
                  <button
                    onClick={() => {
                      this.setState({ addProperties: true });
                      this.setState({ userInput: "" });
                      this.setState({ optionSelected: "" });
                      finalSelectedData(this.state.number);
                    }}
                    className="btn btn-success"
                  >
                    <i className="fas fa-plus-circle" />
                  </button>
                  <button className="btn btn-danger">
                    <i className="fas fa-minus-circle" />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
        <br></br>
      </>
    );
  }
}

export default Autocomplete;
