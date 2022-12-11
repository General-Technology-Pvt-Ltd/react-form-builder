import React from 'react';


export default class PopulateTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      data: this.props.data,
      dirty: false,
      inputValueUrl: this.props.element.inputValueUrl ? this.props.element.inputValueUrl : "",
    };
  }

  handleChange(e) {
    const element = this.state.element;
    element.inputValueUrl = e.target.value;
    this.props.updateElement.call(this.props.preview, element);
    this.setState({
      element: element,
      dirty: true,
      inputValueUrl: e.target.value,
    });
  }

  render() {
    if (this.state.dirty) {
      this.state.element.dirty = true;
    }
    return (
      <>
        <div className="form-group">
          <label className="" htmlFor="inputValueUrl-editor">Input Url</label>
          <input value={this.state.inputValueUrl} onChange={this.handleChange.bind(this)} type="text" id="inputValueUrl-editor" className="form-control" placeholder='Eg. http://localhost:8080/api/data:{key}'/>
        </div>
      </>
    );
  }
}
