/**
 * <Form />
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { EventEmitter } from 'fbemitter';
import FormValidator from './form-validator';
import FormElements from './form-elements';
import { TwoColumnRow, ThreeColumnRow, FourColumnRow } from './multi-column';
import CustomElement from './form-elements/custom-element';
import Registry from './stores/registry';
import DynamicDropDown from './form-elements/dynamic-drop-down';

const {
  Image,
  Checkboxes,
  Signature,
  FileUpload,
  Camera,
  Table,
  Label,
  AutoPopulate,
  PrefixedTextInput,
  NumberInput
} = FormElements;

export default class ReactForm extends React.Component {
  form;

  inputs = {};

  answerData;

  constructor(props) {
    super(props);
    this.answerData = this._convert(props.answer_data);
    this.emitter = new EventEmitter();
    this.getDataById = this.getDataById.bind(this);

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
    return answers || {};
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
      $item.value = ref.state.img ? ref.state.img.replace('data:image/png;base64,', '') : '';
    } else if (ref && ref.inputField && ref.inputField.current) {
      $item = ReactDOM.findDOMNode(ref.inputField.current);
      if ($item && typeof $item.value === 'string') {
        $item.value = $item.value.trim();
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
    const itemData = { name: item.field_name, label: item.label ? item.label : item.field_name };
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
    const btnId = e.target.id;

    if (!this.props.skip_validations && btnId && btnId === 'formbuilder__submit') {
      errors = this.validateForm();
      // Publish errors, if any.
      this.emitter.emit('formValidation', errors);
    }

    // Only submit if there are no errors.
    if (errors.length < 1) {
      const { onSubmit, onSaveDraft } = this.props;
      const submissionHandler = btnId === 'formbuilder__draft' ? onSaveDraft : onSubmit;
      if (submissionHandler) {
        const data = this._collectFormData(this.props.data);
        submissionHandler(data);
      } else {
        const $form = ReactDOM.findDOMNode(this.form);
        $form.submit();
      }
    }
  }


  validateForm() {
    const errors = [];
    let data_items = this.props.data;

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

  getDataById(id) {
    const { data } = this.props;
    return data.find(x => x.id === id);
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

  getPrefixedTextInputElement(item) {
    return (
      <>
        <PrefixedTextInput
          ref={(c) => (this.inputs[item.field_name] = c)}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={this._getDefaultValue(item)}
        />
      </>
    );
  }


  getNumberInputElement(item) {
    return (
      <>
        <NumberInput
          ref={(c) => (this.inputs[item.field_name] = c)}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={this._getDefaultValue(item)}
        />
      </>
    );
  }

  getDynamicDropdownElement(item) {
    return (
      <>
        <DynamicDropDown
          ref={(c) => (this.inputs[item.field_name] = c)}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
          defaultValue={this._getDefaultValue(item)}
        />
      </>
    );
  }

  getAutoPopulateElement(item) {
    return (
      <>
        <AutoPopulate
          ref={(c) => (this.inputs[item.field_name] = c)}
          mutable={true}
          key={`form_${item.id}`}
          data={item}
        />
      </>
    );
  }


  getContainerElement(item, Element) {
    const controls = item.childItems.map(x => (x ? this.getInputElement(this.getDataById(x)) : <div>&nbsp;</div>));
    return (<Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} />);
  }

  getSimpleElement(item) {
    const Element = FormElements[item.element];
    return <Element mutable={true} key={`form_${item.id}`} data={item}/>;
  }

  getCustomElement(item) {
    if (!item.component || typeof item.component !== 'function') {
      item.component = Registry.get(item.key);
      if (!item.component) {
        console.error(`${item.element} was not registered`);
      }
    }

    const inputProps = item.forwardRef && {
      handleChange: this.handleChange,
      defaultValue: this._getDefaultValue(item),
      ref: c => this.inputs[item.field_name] = c,
    };
    return (
      <CustomElement
        mutable={true}
        read_only={this.props.read_only}
        key={`form_${item.id}`}
        data={item}
        {...inputProps}
      />
    );
  }

  render() {
    let data_items = this.props.data;
    const accessToken = this.props.accessToken ? this.props.accessToken : null;
    const autoPopulateUrl = this.props.autoPopulateUrl ? this.props.autoPopulateUrl : null;
    if (this.props.display_short) {
      data_items = this.props.data.filter((i) => i.alternateForm === true);
    }

    data_items.forEach((item) => {
      item.accessToken = accessToken ? accessToken : null;
      item.autoPopulateUrl = autoPopulateUrl ? autoPopulateUrl : null;

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

    const items = data_items.filter(x => !x.parentId).map((item) => {
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
        case 'NumberInput':
          return this.getNumberInputElement(item);
        case 'TextInput':
        case 'PrefixedTextInput':
          return this.getPrefixedTextInputElement(item);
        case 'AutoPopulate':
          return this.getAutoPopulateElement(item);
        case 'TextArea':
        case 'DynamicDropdown':
          return this.getDynamicDropdownElement(item);
        case 'Dropdown':
        case 'DatePicker':
        case 'RadioButtons':
        case 'Rating':
        case 'Tags':
        case 'Range':
          return this.getInputElement(item);
        case 'CustomElement':
          return this.getCustomElement(item);
        case 'FourColumnRow':
          return this.getContainerElement(item, FourColumnRow);
        case 'ThreeColumnRow':
          return this.getContainerElement(item, ThreeColumnRow);
        case 'TwoColumnRow':
          return this.getContainerElement(item, TwoColumnRow);
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
        case 'FileUpload':
          return (
            <FileUpload
              download_path={this.props.download_path}
              handleChange={this.handleChange}
              read_only={this.props.read_only || item.readOnly}
              mutable={true}
              key={`form_${item.id}`}
              data={item}
              onFileSelect={this.props.onFileSelect ? this.props.onFileSelect : null}
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
    const draftActionName = this.props.draft_action_name
      ? this.props.draft_action_name
      : 'Save as draft';
    const backName = this.props.back_name ? this.props.back_name : 'Cancel';

    return (
      <div>
        <FormValidator emitter={this.emitter} />
        <div className='react-form-builder-form'>
          <form encType='multipart/form-data' ref={c => this.form = c} action={this.props.form_action} method={this.props.form_method}>
            {this.props.authenticity_token &&
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
            }
            {items}
            <div className="btn-toolbar">
              {!this.props.hide_actions && (
                <>
                  <input
                    id="formbuilder__submit"
                    type="submit"
                    onClick={this.handleSubmit.bind(this)}
                    className="btn btn-school btn-big"
                    value={actionName}
                  />
                  {this.props.draft_action_name && (
                    <input
                      id="formbuilder__draft"
                      type="submit"
                      onClick={this.handleSubmit.bind(this)}
                      className="btn btn-school btn-big"
                      value={draftActionName}
                    />
                  )}
                  </>
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
