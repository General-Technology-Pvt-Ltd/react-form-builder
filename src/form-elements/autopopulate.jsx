import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import { get } from '../stores/requests';

class AutoPopulate extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      value: '',
    }
  }

  componentDidMount() {
    const populateBaseUrl = this.props.data.autoPopulateUrl ? this.props.data.autoPopulateUrl : null;
    const populateKey = this.props.data.populateKey ? this.props.data.populateKey : null;
    if(populateBaseUrl && populateKey) {
      const populateUrl = populateBaseUrl + "?field=" + this.props.data.populateKey;
      get(populateUrl, this.props.data.accessToken)
        .then((data) => {
          this.setState({
            value: data.data,
          });
        });
    }
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

    if (this.props.data.element === "AutoPopulate") {
      props.disabled = this.props?.data?.allowEdit ? this.props.allowEdit : true;
    }

    return (
      <div className={baseClasses}>
        <ComponentHeader {...this.props} />
        <div className="form-group">
          <ComponentLabel {...this.props} />
          <input value={this.state.value} {...props} />
        </div>
      </div>
    );
  }
}

export default AutoPopulate;
