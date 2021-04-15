import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';

class PrefixedTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.prefix = this.props.data.prefix ? this.props.data.prefix : '';
  }

  render() {
    const props = {};
    props.type = 'text';
    props.className = 'form-control';
    props.name = this.props.data.field_name;
    if (this.props.mutable) {
      props.defaultValue = this.props.defaultValue;
      props.ref = this.inputField;
    }

    let baseClasses = 'SortableItem rfb-item';
    if (this.props.data.pageBreakBefore) {
      baseClasses += ' alwaysbreak';
    }

    if (this.props.read_only) {
      props.disabled = 'disabled';
    }
    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <div className="input-group mb-3">
            {
              this.props.data.element === 'PrefixedTextInput' && (
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">{ this.prefix }</span>
                </div>
              )
            }
            <input {...props} />
          </div>
        </div>
      </div>
    );
  }
}

export default PrefixedTextInput;
