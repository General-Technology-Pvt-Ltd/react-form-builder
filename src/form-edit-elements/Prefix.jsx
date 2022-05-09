/**
 * <DynamicOptionList />
 */

import React from 'react';


export default class Prefix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      prefix: this.props.element.prefix ? this.props.element.prefix : "",
    };
  }

  handleChange(e) {
    const element = this.state.element;
    element.prefix = e.target.value;
    this.props.updateElement.call(this.props.preview, element);
    this.setState({
      element: element,
      dirty: true,
      prefix: e.target.value,
    });
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }
    return (
      <>
        <div className="form-group">
          <label className="" htmlFor="prefix-editor">Prefix</label>
          <input value={this.state.prefix} onChange={this.handleChange.bind(this)} type="text" id="prefix-editor" className="form-control"/>
        </div>
      </>
    );
  }
}
