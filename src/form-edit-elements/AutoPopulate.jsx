/**
 * <DynamicOptionList />
 */

import React from 'react';


export default class AutoPopulate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      populateKey: this.props.element.populateKey ? this.props.element.populateKey : "0",
      allowEdit: this.props.element.allowEdit ? this.props.element.allowEdit : false,
      populateItems: this.props.element.autoPopulateItems ? this.props.element.autoPopulateItems : [],
    };
  }

  handleChange(e) {
    const element = this.state.element;
    element.populateKey = e.target.value;
    this.props.updateElement.call(this.props.preview, element);
    this.setState({
      element: element,
      dirty: true,
      populateKey: e.target.value,
    });
  }

  handleReadOnlyChange(e) {
    const element = this.state.element;
    element.allowEdit = e.target.checked;
    this.props.updateElement.call(this.props.preview, element);
    this.setState({
      element: element,
      dirty: true,
      allowEdit: e.target.checked,
    });
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }
    return (
      <>
        <div className="form-group">
          <label className="" htmlFor="auto-populate-key">Auto Populate</label>
          <select value={this.state.populateKey} onChange={this.handleChange.bind(this)} id="auto-populate-key" className="form-control">
            <option value="0" disabled>Select auto populate field</option>
            {this.state.populateItems && this.state.populateItems.map(item => {
              return (
                <option value={item.key}>{item.label}</option>
              )
            })}
          </select>
        </div>
        <div className="form-group">
          <input
            id="autopopulate-readonly"
            type="checkbox"
            checked={this.state.allowEdit}
            onChange={this.handleReadOnlyChange.bind(this)}
          />
          <label htmlFor="autopopulate-readonly" style={{ marginLeft: "5px"}}>
            Allow users to edit the field ?
          </label>
        </div>
      </>
    );
  }
}
