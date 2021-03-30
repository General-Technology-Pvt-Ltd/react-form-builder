import React, { Component } from 'react';

class Conditionals extends Component {
  render() {
    return (
      <div>
        <div className="form-group">
          <label className="control-label" htmlFor="optionsApiUrl">Conditionals</label>
          <div className="row">
            <div className="col-sm-5">
              <label htmlFor="field">Field</label>
              <select className="form-control">
                <option value="1">Field 1</option>
              </select>
            </div>
            <div className="col-sm-4">
              <label htmlFor="operator">Operator</label>
              <select className="form-control">
                <option value="1">is Equal</option>
              </select>
            </div>
            <div className="col-sm-3">
              <label htmlFor="operator">Value</label>
              <input className="form-control" type="text"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Conditionals;
