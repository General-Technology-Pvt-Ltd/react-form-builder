import React  from 'react';


export default class Toc extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleChange(e) {
    if(this.props.handleChange) {
      this.props.handleChange(e);
    }
  }

  _handleView(e) {
    if(this.props.handleView) {
      this.props.handleView(e);
    }
  }


  render() {
    return (
      <div className="jumbotron mt-3 mb-0 p-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            onChange={this._handleChange.bind(this)}
            name={`other-services-switch`}
            id="terms-condition"
          />
          <label className="custom-control-label" htmlFor="terms-condition">
            {this.props.text ? this.props.text : 'Terms & Conditions Apply.'}
          </label>
          <button
            type="button"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'blue',
            }}
            onClick={this._handleView.bind(this)}
          >
            {this.props.buttonText ? this.props.buttonText : 'View'}
          </button>
        </div>
      </div>
    );
  }
}
