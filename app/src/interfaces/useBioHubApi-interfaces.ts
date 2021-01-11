/**
 * The parent type that an object must conform to, at a minimum, to be rendered via the FormContainer.tsx
 *
 * @export
 * @interface IFormRecord
 */
export interface IFormRecord {
  id?: any;
  form_data?: any;
}

/**
 * Create new activity endpoint object.
 *
 * @export
 * @interface IActivity
 */
export interface ICreateActivity {
  tags: string[];
  id: string;
  form_data: any;
}

/**
 * Activity object.
 *
 * @export
 * @interface IActivity
 * @extends {IFormRecord}
 */
export interface IActivity extends IFormRecord {
  id: number;
  tags: string[];
  form_data: any;
}

/**
 * Create new tempalte endpoint object.
 *
 * @export
 * @interface ITemplate
 */
export interface ICreateTemplate {
  name: string;
  description: string;
  tags: string[];
  data_template: any;
  ui_template: any;
}

/**
 * Tempalte object.
 *
 * @export
 * @interface ITemplate
 */
export interface ITemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  data_template: any;
  ui_template: any;
}
