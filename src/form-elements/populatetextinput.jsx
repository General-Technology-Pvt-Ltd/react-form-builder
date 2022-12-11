import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import { get } from '../stores/requests';

class PopulateTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
    this.state = {
      value: '',
    }
  }

  componentDidMount() {
    const inputURL = this.props.data.inputValueUrl ? this.props.data.inputValueUrl : null;
    
    if(inputURL) {
      var populateKey = (/\{(.*?)\}/).exec(inputURL)
      if(!populateKey){
        return
      }
      var populateUrl = (/([^{]*){/).exec(inputURL)[1];
      if(this.props.data.dynamicId){
        populateUrl = `${populateUrl}/${this.props.data.dynamicId}`
      }
      get(populateUrl, this.props.data.accessToken)
        .then((data) => {
          this.setState({
            value: data[populateKey[1]],
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

export default PopulateTextInput;
