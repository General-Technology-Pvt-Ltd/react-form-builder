/**
 * <Form />
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { EventEmitter } from 'fbemitter';
import FormValidator from './form-validator';
import FormElements from './form-elements';

const {
  Image,
  Checkboxes,
  Signature,
  Download,
  Camera,
  Table,
  Label,
  AutoPopulate,
} = FormElements;

export default class ReactForm extends React.Component {
  form;

  inputs = {};

  answerData;

  constructor(props) {
    super(props);
    this.answerData = this._convert(props.answer_data);
    this.emitter = new EventEmitter();

    this.state = {
      somedata: null,
      reload: ''
    };
  }

  componentDidMount() {
    const data = this.giveMeData('update');
    this.setState({
      somedata: { ...this.state.somedata, ...data },
      reload: '',
    });
  }

  componentDidUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      const data = this.giveMeData('update');
      this.setState({
        somedata: { ...this.state.somedata, ...data },
      });
    }
  }

  _convert(answers) {
    if (Array.isArray(answers)) {
      const result = {};
      answers.forEach((x) => {
        if (x.name.indexOf('tags_') > -1) {
          result[x.name] = x.value.map((y) => y.value);
        } else {
          result[x.name] = x.value;
        }
      });
      return result;
    }
    return answers;
  }

  _getDefaultValue(item) {
    return this.answerData[item.field_name];
  }

  _optionsDefaultValue(item) {
    const defaultValue = this._getDefaultValue(item);
    if (defaultValue) {
      return defaultValue;
    }

    const defaultChecked = [];
    item.options.forEach((option) => {
      if (this.answerData[`option_${option.key}`]) {
        defaultChecked.push(option.key);
      }
    });
    return defaultChecked;
  }

  _getItemValue(item, ref) {
    let $item = {
      element: item.element,
      value: '',
    };
    if (item.element === 'Rating') {
      $item.value = ref.inputField.current.state.rating;
    } else if (item.element === 'Tags') {
      $item.value = ref.inputField.current.state.value;
    } else if (item.element === 'DatePicker') {
      $item.value = ref.state.value;
    } else if (item.element === 'Camera') {
      $item.value = ref.state.img
        ? ref.state.img.replace('data:image/png;base64,', '')
        : '';
    } else if (item.element === 'Download') {
      $item.value = ref.state.value;
    } else if (ref && ref.inputField) {
      $item = ReactDOM.findDOMNode(ref.inputField.current);
      if (typeof $item.value === 'string') {
        // $item.value = $item.value.trim();
        $item.value = $item.value;
      }
    }
    return $item;
  }

  _isIncorrect(item) {
    let incorrect = false;
    if (item.canHaveAnswer) {
      const ref = this.inputs[item.field_name];
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        item.options.forEach((option) => {
          const $option = ReactDOM.findDOMNode(
            ref.options[`child_ref_${option.key}`],
          );
          if (
            (option.hasOwnProperty('correct') && !$option.checked) ||
            (!option.hasOwnProperty('correct') && $option.checked)
          ) {
            incorrect = true;
          }
        });
      } else {
        const $item = this._getItemValue(item, ref);
        if (item.element === 'Rating') {
          if ($item.value.toString() !== item.correct) {
            incorrect = true;
          }
        } else if (
          $item.value.toLowerCase() !== item.correct.trim()
            .toLowerCase()
        ) {
          incorrect = true;
        }
      }
    }
    return incorrect;
  }

  _isInvalid(item) {
    let invalid = false;
    if (item.required === true) {
      const ref = this.inputs[item.field_name];
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        let checked_options = 0;
        item.options.forEach((option) => {
          const $option = ReactDOM.findDOMNode(
            ref.options[`child_ref_${option.key}`],
          );
          if ($option.checked) {
            checked_options += 1;
          }
        });
        if (checked_options < 1) {
          // errors.push(item.label + ' is required!');
          invalid = true;
        }
      } else {
        const $item = this._getItemValue(item, ref);
        if (item.element === 'Rating') {
          if ($item.value === 0) {
            invalid = true;
          }
        } else if ($item.value === undefined || $item.value.length < 1) {
          invalid = true;
        }
      }
    }
    return invalid;
  }

  _collect(item, check = null) {
    const itemData = { name: item.field_name };
    const ref = this.inputs[item.field_name];
    if (ref === undefined) {
      return null;
    }
    if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
      const checked_options = [];
      item.options.forEach((option) => {
        const $option = ReactDOM.findDOMNode(
          ref.options[`child_ref_${option.key}`],
        );
        if ($option.checked) {
          if (check) {
            checked_options.push(option.value);
          } else {
            checked_options.push(option.key);
          }
        }
      });
      itemData.value = checked_options;
    } else if (item.element === 'Table') {
      itemData.value = item.rows;
    } else if (item.element === 'Download') {
      itemData.value = this._getItemValue(item, ref).value;
    } else {
      if (!ref) return null;
      itemData.value = this._getItemValue(item, ref).value;
    }
    return itemData;
  }

  _collectFormData(data) {
    const formData = [];
    data.forEach((item) => {
      const item_data = this._collect(item);
      if (item_data) {
        formData.push(item_data);
      }
    });
    return formData;
  }

  _getSignatureImg(item) {
    const ref = this.inputs[item.field_name];
    const $canvas_sig = ref.canvas.current;
    if ($canvas_sig) {
      const base64 = $canvas_sig
        .toDataURL()
        .replace('data:image/png;base64,', '');
      const isEmpty = $canvas_sig.isEmpty();
      const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
      if (isEmpty) {
        $input_sig.value = '';
      } else {
        $input_sig.value = base64;
      }
    }
  }

  giveMeData(check = null) {
    let obj = {};
    this.props.data.map((dat) => {
      if (dat !== null) {
        let pair;
        const vala = this._collect(dat, check);
        if (vala != null) {
          dat.field_name = dat.field_name.replaceAll('-', '_');
          const fn = dat.field_name;
          const str = `pair = {${fn}: "${vala.value}"};`;
          eval(str);
          obj = { ...obj, ...pair };
        }
      }
    });
    return obj;
  }

  handleChange(event) {
    const data = this.giveMeData('update');
    for (const property in data) {
      if (event.target.name === property) {
        const xhr = new XMLHttpRequest();
        const errId = `errror-message-${property}`;
        const parent = event.target.parentElement;
        const errorElement = parent.querySelector(`#${errId}`);
        const url = process.env.REACT_APP_VALIDATION_URL || 'http://localhost:8181/api/validate';
        xhr.open('POST', `${url}`, false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`formId=1&fieldId=${property}&value=${data[property]}`);
        if (xhr.status === 200) {
          if (errorElement) {
            parent.removeChild(errorElement);
          }
        } else if (xhr.status === 412) {
          const response = JSON.parse(xhr.responseText);
          const error = response.data.errors[0];
          if (errorElement) {
            errorElement.innerText = error;
          } else {
            let errorMessage = document.createElement('span');
            errorMessage.style = ('color:red');
            errorMessage.className = 'text-danger';
            errorMessage.id = errId;
            errorMessage.innerText = error;
            parent.appendChild(errorMessage);
          }
        } else {
          console.log('failed to validate');
        }
      }
    }
    this.setState({
      somedata: { ...this.state.data, ...data },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = this._collectFormData(this.props.data);
    let errors = [];

    if (!this.props.skip_validations) {
      errors = this.validateForm();
      // Publish errors, if any.
      this.emitter.emit('formValidation', errors);
    }
    /* const data = this._collectFormData(this.props.data);
     return; */
    // Only submit if there are no errors.
    if (errors.length < 1) {
      const { onSubmit } = this.props;
      if (onSubmit) {
        const data = this._collectFormData(this.props.data);

        // return;
        onSubmit(data);
        // } else {
        //   const $form = ReactDOM.findDOMNode(this.form);
        //   $form.submit();
      }
    }
  }


  validateForm() {
    const errors = [];
    let data_items = this.props.data;// } else {

    if (this.props.display_short) {
      data_items = this.props.data.filter((i) => i.alternateForm === true);
    }

    data_items.forEach((item) => {
      if (item.element === 'Signature') {
        this._getSignatureImg(item);
      }

      if (this._isInvalid(item)) {
        errors.push(`${item.label} is required!`);
      }

      if (this.props.validateForCorrectness && this._isIncorrect(item)) {
        errors.push(`${item.label} was answered incorrectly!`);
      }
    });

    return errors;
  }

  getInputElement(item) {
    const Input = FormElements[item.element];
    return (
      <Input
        handleChange={this.handleChange}
        ref={(c) => (this.inputs[item.field_name] = c)}
        mutable={true}
        key={`form_${item.id}`}
        data={item}
        read_only={this.props.read_only}
        defaultValue={this._getDefaultValue(item)}
      />
    );
  }

  getAutoPopulateElement(item) {
    let autoCompleteValue;
    if (item.element === 'AutoPopulate') {
      try {
        const getDataFromServer = () => {
          let xhr = new XMLHttpRequest();
          const url = process.env.REACT_APP_POPULATE_URL || 'http://localhost:8181/api/populate';
          xhr.open('GET', `${url}?field=${item.populateKey}`, false);
          xhr.setRequestHeader('Authorization', 'Bearer ');
          xhr.send(null);
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            return response.data;
          } else {
            alert('failed to populate');
          }
        };

        autoCompleteValue = getDataFromServer();
        console.log(autoCompleteValue);
      } catch (e) {
        console.log('Failed to populate data');
      }
    }

    return (
      <>
        <AutoPopulate
          ref={(c) => (this.inputs[item.field_name] = c)}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          read_only={false}
          defaultValue={autoCompleteValue ? autoCompleteValue : null}
        />
      </>
    );
  }


  getSimpleElement(item) {
    const Element = FormElements[item.element];
    return <Element mutable={true} key={`form_${item.id}`} data={item}/>;
  }

  render() {
    let data_items = this.props.data;

    if (this.props.display_short) {
      data_items = this.props.data.filter((i) => i.alternateForm === true);
    }

    data_items.forEach((item) => {
      if (
        item &&
        item.readOnly &&
        item.variableKey &&
        this.props.variables[item.variableKey]
      ) {
        this.answerData[item.field_name] = this.props.variables[
          item.variableKey
          ];
      }
    });

    const items = data_items.map((item) => {
      if (this.state.somedata === null || this.state.somedata == {}) {
        return null;
      }

      const data = this.state.somedata;

      if (!item) return null;
      if (item.conditonalRule) {
        if (item.conditonalRule != null || item.conditonalRule != undefined) {
          if (!eval(item.conditonalRule)) {
            return null;
          }
        }
      }
      switch (item.element) {
        case 'TextInput':
        case 'AutoPopulate':
          return this.getAutoPopulateElement(item);
        case 'NumberInput':
        case 'TextArea':
        case 'Dropdown':
        case 'DatePicker':
        case 'RadioButtons':
        case 'Rating':
        case 'Tags':
        case 'Range':
          return this.getInputElement(item);
        case 'Signature':
          return (
            <Signature
              ref={(c) => (this.inputs[item.field_name] = c)}
              read_only={this.props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={this._getDefaultValue(item)}
            />
          );
        case 'Checkboxes':
          return (
            <Checkboxes
              ref={(c) => (this.inputs[item.field_name] = c)}
              read_only={this.props.read_only}
              // handleChange={this.handleChange}
              handleChange={this.handleChange}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              showdata={true}
              defaultValue={this._optionsDefaultValue(item)}
            />
          );
        case 'Image':
          return (
            <Image
              ref={(c) => (this.inputs[item.field_name] = c)}
              handleChange={this.handleChange}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={this._getDefaultValue(item)}
            />
          );
        case 'Download':
          return (
            <Download
              download_path={this.props.download_path}
              handleChange={this.handleChange}
              read_only={this.props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              ref={(c) => (this.inputs[item.field_name] = c)}
            />
          );
        case 'Camera':
          return (
            <Camera
              ref={(c) => (this.inputs[item.field_name] = c)}
              read_only={this.props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              defaultValue={this._getDefaultValue(item)}
            />
          );
        case 'Table':
          return (
            <Table
              ref={(c) => (this.inputs[item.field_name] = c)}
              read_only={this.props.read_only || item.readOnly}
              handleChange={this.handleChange}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              showdata={true}
              defaultValue={this._optionsDefaultValue(item)}
            />
          );


        default:
          return this.getSimpleElement(item);
      }
    });

    const formTokenStyle = {
      display: 'none',
    };

    const actionName = this.props.action_name
      ? this.props.action_name
      : 'Submit';
    const backName = this.props.back_name ? this.props.back_name : 'Cancel';

    return (
      <div>
        <FormValidator emitter={this.emitter}/>
        <div className="react-form-builder-form">
          <form
            encType="multipart/form-data"
            ref={(c) => (this.form = c)}
            onChange={this.handleChange.bind(this)}
            action={this.props.form_action}
            onSubmit={this.handleSubmit.bind(this)}
            method={this.props.form_method}>
            {/* <label>this is for test preivew</label> */}
            {this.props.authenticity_token && (
              <div style={formTokenStyle}>
                <input name="utf8" type="hidden" value="&#x2713;"/>
                <input
                  name="authenticity_token"
                  type="hidden"
                  value={this.props.authenticity_token}
                />
                <input
                  name="task_id"
                  type="hidden"
                  value={this.props.task_id}
                />
              </div>
            )}
            {items}
            <div className="btn-toolbar">
              {!this.props.hide_actions && (
                <input
                  type="submit"
                  className="btn btn-school btn-big"
                  value={actionName}
                />
              )}
              {!this.props.hide_actions && this.props.back_action && (
                <a
                  href={this.props.back_action}
                  className="btn btn-default btn-cancel btn-big">
                  {backName}
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

ReactForm.defaultProps = { validateForCorrectness: false };
