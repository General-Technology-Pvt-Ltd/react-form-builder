import React from "react";
import ReactDOM from "react-dom";
import DemoBar from "./demobar";
// eslint-disable-next-line no-unused-vars
import FormBuilder from "./src/index";
import * as variables from "./variables";

// Add our stylesheets for the demo.
require("./scss/application.scss");

const url = "/api/formdata";
const saveUrl = "/api/formdata";

const populateItems = [
  {
    label: "Account Number",
    key: "accountNumber",
  },
  {
    label: "Mobile Number",
    key: "mobileNumber",
  },
  {
    label: "Account Name",
    key: "accountName",
  },
];

const availableValidationRules = [
  {
    key: "required",
  },
  {
    key: "email",
    onlyOn: "TextInput",
  },
  {
    key: "account_number",
    title: "Account Number",
    onlyOn: ["TextInput", "NumberInput"],
  },
  {
    key: "min",
    hasConstraint: true,
    constraint: "number",
    description: "Minimum range a number can be.",
    onlyOn: "NumberInput",
  },
  {
    key: "max",
    hasConstraint: true,
    constraint: "number",
    description: "Maximum range a number can be.",
    onlyOn: "NumberInput",
  },
  {
    key: "in",
    hasConstraint: true,
    description: "A list of allowed values in comma separated list.",
    onlyOn: ["TextInput", "NumberInput"],
  },
  {
    key: "file",
    hasConstraint: true,
    description: "A list of allowed extensions in comma separated list.",
    onlyOn: "FileUpload",
  },
];

const BootstrapStylingRules = [
  {
    key: [
      "bg-primary",
      "bg-secondary",
      "bg-success",
      "bg-info",
      "bg-warning",
      "bg-danger",
      "bg-light",
      "bg-dark",
    ],
    title: "Background",
    hasConstraint: true,
  },
  {
    key: "border",
    title: "Border",
    hasConstraint: true,
  },
  {
    key: "text",
    title: "Colors",
    hasConstraint: true,
  },
  {
    key: "d-inline",
    title: "Display",
    hasConstraint: true,
  },
  {
    key: "d-flex",
    title: "Flex",
    hasConstraint: true,
  },
  {
    key: "float-start",
    title: "Float",
    hasConstraint: true,
  },
  {
    key: "user-select-all",
    title: "Interactions",
    hasConstraint: true,
  },
  {
    key: "opacity",
    title: "Opacity",
    hasConstraint: true,
  },
  {
    key: "overflow-auto",
    title: "Overflow",
    hasConstraint: true,
  },
  {
    key: "position",
    title: "Background",
    hasConstraint: true,
  },
  {
    key: "shadow",
    title: "Background",
    hasConstraint: true,
  },
  {
    key: "sizing",
    title: "Background",
    hasConstraint: true,
  },
  {
    key: "Spacing",
    title: "Background",
    hasConstraint: true,
  },
  {
    key: "text",
    title: "Background",
    hasConstraint: true,
  },
  {
    key: "align",
    title: "Background",
    hasConstraint: true,
  },
  {
    key: ["visible", "invisible"],
    title: "visible",
    hasConstraint: true,
  },
];

ReactDOM.render(
  <FormBuilder.ReactFormBuilder
    variables={variables}
    url={url}
    saveUrl={saveUrl}
    autoPopulateItems={populateItems}
    availableValidationRules={availableValidationRules}
    bootstrapStylingRules={BootstrapStylingRules}
  />,
  document.getElementById("form-builder")
);

ReactDOM.render(
  <DemoBar variables={variables} />,
  document.getElementById("demo-bar")
);
