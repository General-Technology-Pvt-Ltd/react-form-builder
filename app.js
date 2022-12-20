import React from "react";
import ReactDOM from "react-dom";
import DemoBar from "./demobar";
// eslint-disable-next-line no-unused-vars
import FormBuilder from "./src/index";
import * as variables from "./variables";
// import { createRoot } from 'react-dom/client';

// const container = document.getElementById('form-builder');
// const demobarContainer = document.getElementById('demo-bar');
// const root = createRoot(container);
// const demobar = createRoot(demobarContainer);

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
      { label: "primary", value: "bg-primary" },
      { label: "success", value: "bg-success" },
      { label: "secondary", value: "bg-secondary" },
      { label: "info", value: "bg-info" },
      { label: "danger", value: "bg-danger" },
      { label: "light", value: "bg-light" },
      { label: "dark", value: "bg-dark" },
    ],
    title: "Background",
    hasConstraint: true,
  },
  {
    key: [{ label: "Border", value: "border" }],
    title: "Border",
    hasConstraint: true,
  },
  {
    key: [{ label: "Text", value: "text" }],
    title: "Colors",
    hasConstraint: true,
  },
  {
    key: [{ label: "Inline", value: "d-inline" }],
    title: "Display",
    hasConstraint: true,
  },
  {
    key: [{ label: "Flex", value: "d-flex" }],
    title: "Flex",
    hasConstraint: true,
  },
  {
    key: [{ label: "Float", value: "float-start" }],
    title: "Float",
    hasConstraint: true,
  },
  {
    key: [{ label: "User-Select-All", value: "user-select-all" }],
    title: "Interactions",
    hasConstraint: true,
  },
  {
    key: [{ label: "opacity", value: "opacity" }],
    title: "Opacity",
    hasConstraint: true,
  },
  {
    key: [{ label: "Auto", value: "overflow-auto" }],
    title: "Overflow",
    hasConstraint: true,
  },
  {
    key: [{ label: "position", value: "position" }],
    title: "Background",
    hasConstraint: true,
  },
  {
    key: [{ label: "shadow", value: "shadow" }],
    title: "Background",
    hasConstraint: true,
  },
  {
    key: [{ label: "Sizing", value: "sizing" }],
    title: "Background",
    hasConstraint: true,
  },
  {
    key: [{ label: "Spacing", value: "spacing" }],
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
    key: [
      { label: "visible", value: "visible" },
      { label: "invisible", value: "invisible" },
    ],
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
