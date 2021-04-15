/**
 * <DynamicOptionList />
 */

import React from 'react';


export default class DynamicDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      dropdownUrl: this.props.element.dropdownUrl ? this.props.element.dropdownUrl : "",
    };
  }

  handleChange(e) {
    const element = this.state.element;
    element.dropdownUrl = e.target.value;
    this.props.updateElement.call(this.props.preview, element);
    this.setState({
      element: element,
      dirty: true,
      dropdownUrl: e.target.value,
    });
  }

  render() {
    console.log(this.props);
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }
    return (
      <>
        <div className="form-group">
          <label className="" htmlFor="dropdownUrl-editor">Dropdown Url</label>
          <input value={this.state.dropdownUrl} onChange={this.handleChange.bind(this)} type="text" id="dropdownUrl-editor" className="form-control"/>
        </div>
      </>
    );
  }
}
