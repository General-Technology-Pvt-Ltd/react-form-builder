import React from 'react';
import ReactDOM from 'react-dom';
import DemoBar from './demobar';
// eslint-disable-next-line no-unused-vars
import FormBuilder from './src/index';
import * as variables from './variables';

// Add our stylesheets for the demo.
require('./scss/application.scss');

const url = '/api/formdata';
const saveUrl = '/api/formdata';

const populateItems = [
  {
    "label": "Account Number",
    "key": "accountNumber",
  },
  {
    "label": "Mobile Number",
    "key": "mobileNumber",
  },
  {
    "label": "Account Name",
    "key": "accountName",
  },
];

const availableValidationRules = [
  {
    key: 'required',
  },
  {
    key: 'email',
    onlyOn: 'TextInput',
  },
  {
    key: 'account_number',
    title: 'Account Number',
    onlyOn: ['TextInput', 'NumberInput'],
  },
  {
    key: 'min',
    hasConstraint: true,
    constraint: 'number',
    description: 'Minimum range a number can be.',
    onlyOn: 'NumberInput',
  },
  {
    key: 'max',
    hasConstraint: true,
    constraint: 'number',
    description: 'Maximum range a number can be.',
    onlyOn: 'NumberInput',
  },
  {
    key: 'in',
    hasConstraint: true,
    description: 'A list of allowed values in comma separated list.',
    onlyOn: ['TextInput', 'NumberInput'],
  },
  {
    key: 'file',
    hasConstraint: true,
    description: 'A list of allowed extensions in comma separated list.',
    onlyOn: 'FileUpload',
  },
];

ReactDOM.render(
  <FormBuilder.ReactFormBuilder
    variables={variables}
    url={url}
    saveUrl={saveUrl}
    autoPopulateItems={populateItems}
    availableValidationRules={availableValidationRules}
  />,
  document.getElementById('form-builder'),
);

ReactDOM.render(
  <DemoBar variables={variables} />,
  document.getElementById('demo-bar'),
);
