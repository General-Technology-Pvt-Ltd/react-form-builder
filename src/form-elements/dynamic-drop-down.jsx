import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import ID from './UUID';
import { get } from '../stores/requests';

class DynamicDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      options: [],
      value: '',
    };
  }

  componentDidMount() {
    const populateUrl = this.props.data.dropdownUrl ? this.props.data.dropdownUrl : null;
    if(populateUrl) {
      get(populateUrl, this.props.data.accessToken)
        .then((data) => {
          this.setState({
            options: data,
          });
        });
    }
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const props = {};
    props.className = 'form-control';
    props.name = this.props.data.field_name;

    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue ? this.props.defaultValue : '';
      props.ref = this.inputField;
    }

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          {this.state.options.length > 0 && (
            <>
              <select value={this.state.value} {...props} onChange={this.handleChange.bind(this)}>
                <option value="" disabled>Select an option</option>
                {this.state.options.map((option, index) => {
                  return <option value={option.value}
                                 key={`dynamic_dropdown_${index}`}>{option.text}</option>;
                })}
              </select>
              <span style={{ position: 'absolute', bottom: 37, right: 22 }} onClick={(e) => {
                    e.currentTarget.parentNode.querySelector('select').value = this.props.defaultValue ? this.props.defaultValue : '';
                  }}>
                <i className="fa fa-times" />
              </span>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default DynamicDropDown;
