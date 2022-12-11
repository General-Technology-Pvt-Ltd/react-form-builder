import SortableElement from "./sortable-element";
import PlaceHolder from "./form-place-holder";
import BaseFormElements from "./form-elements";
import {
  ColumnRow,
  OneColumnRow,
  TwoColumnRow,
  ThreeColumnRow,
  FourColumnRow,
} from "./multi-column";
import CustomElement from "./form-elements/custom-element";

const {
  Header,
  Paragraph,
  Label,
  LineBreak,
  TextInput,
  PrefixedTextInput,
  AutoPopulate,
  PopulateTextInput,
  NumberInput,
  TextArea,
  Dropdown,
  DynamicDropdown,
  Checkboxes,
  DatePicker,
  RadioButtons,
  Image,
  Rating,
  Tags,
  Signature,
  HyperLink,
  FileUpload,
  Camera,
  Range,
  Table,
} = BaseFormElements;

const FormElements = {};

FormElements.Header = SortableElement(Header);
FormElements.Paragraph = SortableElement(Paragraph);
FormElements.Label = SortableElement(Label);
FormElements.LineBreak = SortableElement(LineBreak);
FormElements.TextInput = SortableElement(TextInput);
FormElements.PrefixedTextInput = SortableElement(PrefixedTextInput);
FormElements.AutoPopulate = SortableElement(AutoPopulate);
FormElements.PopulateTextInput = SortableElement(PopulateTextInput);
FormElements.NumberInput = SortableElement(NumberInput);
FormElements.TextArea = SortableElement(TextArea);
FormElements.Dropdown = SortableElement(Dropdown);
FormElements.DynamicDropdown = SortableElement(DynamicDropdown);
FormElements.Signature = SortableElement(Signature);
FormElements.Checkboxes = SortableElement(Checkboxes);
FormElements.DatePicker = SortableElement(DatePicker);
FormElements.RadioButtons = SortableElement(RadioButtons);
FormElements.Image = SortableElement(Image);
FormElements.Rating = SortableElement(Rating);
FormElements.Tags = SortableElement(Tags);
FormElements.HyperLink = SortableElement(HyperLink);
FormElements.FileUpload = SortableElement(FileUpload);
FormElements.Camera = SortableElement(Camera);
FormElements.Range = SortableElement(Range);
FormElements.PlaceHolder = SortableElement(PlaceHolder);
FormElements.Table = SortableElement(Table);
FormElements.ColumnRow = SortableElement(ColumnRow);
FormElements.OneColumnRow = SortableElement(OneColumnRow);
FormElements.TwoColumnRow = SortableElement(TwoColumnRow);
FormElements.ThreeColumnRow = SortableElement(ThreeColumnRow);
FormElements.FourColumnRow = SortableElement(FourColumnRow);
FormElements.CustomElement = SortableElement(CustomElement);

export default FormElements;
