import { tags } from '../components/tags';

/**
 * Template schema interface.
 *
 * @export
 * @interface ITemplateSchema
 */
export interface ITemplateSchema {
  id: number;
  name: string;
  description: string;
  tags: string[];
  data_template: any;
  ui_template: any;
}

/**
 * Template endpoint post body openapi schema.
 */
export const templatePostBody = {
  title: 'Template Post Object',
  type: 'object',
  // required: [],
  properties: {
    tags: {
      ...tags
    },
    name: {
      description: 'Template name',
      type: 'string',
      maxLength: 100,
      example: '2020 General Ungulete Observation Form'
    },
    description: {
      description: 'Template description',
      type: 'string',
      maxLength: 300
    },
    data_template: {
      description: 'Specification of the form fields and their data types/constraints.',
      type: 'object'
    },
    ui_template: {
      description: 'Specification of the UI characteristics of the form fields',
      type: 'object'
    }
  }
};

/**
 * Template endpoint response body openapi schema.
 */
export const templateResponseBody = {
  title: 'Template Response Object',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'number'
    }
  }
};
