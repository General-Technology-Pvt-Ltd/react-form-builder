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
]

ReactDOM.render(
  <FormBuilder.ReactFormBuilder
    variables={variables}
    url={url}
    saveUrl={saveUrl}
    autoPopulateItems={populateItems}
  />,
  document.getElementById('form-builder'),
);

ReactDOM.render(
  <DemoBar variables={variables} />,
  document.getElementById('demo-bar'),
);
