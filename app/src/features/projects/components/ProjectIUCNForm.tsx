import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Box,
  IconButton,
  Button
} from '@material-ui/core';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import { FieldArray, useFormikContext } from 'formik';
import { IMultiAutocompleteFieldOption } from 'components/fields/MultiAutocompleteFieldVariableSize';
import React from 'react';
import * as yup from 'yup';

export interface IProjectIUCNFormArrayItem {
  classification: string;
  subClassification1: string;
  subClassification2: string;
}

export interface IProjectIUCNForm {
  classificationDetails: IProjectIUCNFormArrayItem[];
}

export const ProjectIUCNFormArrayItemInitialValues: IProjectIUCNFormArrayItem = {
  classification: '',
  subClassification1: '',
  subClassification2: ''
};

export const ProjectIUCNFormInitialValues: IProjectIUCNForm = {
  classificationDetails: [ProjectIUCNFormArrayItemInitialValues]
};

export const ProjectIUCNFormYupSchema = yup.object().shape({
  classificationDetails: yup.array().of(
    yup.object().shape({
      classification: yup.string().required('You must specify a classification'),
      subClassification1: yup.string().required('You must specify a sub-classification'),
      subClassification2: yup.string().required('You must specify a sub-classification')
    })
  )
});

export interface IProjectIUCNFormProps {
  classifications: IMultiAutocompleteFieldOption[];
  subClassifications: IMultiAutocompleteFieldOption[];
}

const useStyles = makeStyles((theme) => ({
  iucnInputContainer: {
    flex: '1 1 auto',
    overflowX: 'hidden',
  },
  iucnInput: {
    flex: '0 0 auto',
    width: '33.333%',
  },
  ["@media (max-width:800px)"]: {
    // Insert Media Queries Here
  }
}));

/**
 * Create project - IUCN classification section
 *
 * @return {*}
 */
const ProjectIUCNForm: React.FC<IProjectIUCNFormProps> = (props: any) => {
  const classes = useStyles();
  const { values, handleChange, handleSubmit, getFieldMeta } = useFormikContext<IProjectIUCNForm>();

  return (
    <form onSubmit={handleSubmit}>
      <FieldArray
        name="classificationDetails"
        render={(arrayHelpers: any) => (
          <Box>
            <Grid container direction="row">
              {values.classificationDetails.map((classificationDetail, index) => {
                const classificationMeta = getFieldMeta(`classificationDetails.[${index}].classification`);
                const subClassification1Meta = getFieldMeta(`classificationDetails.[${index}].subClassification1`);
                const subClassification2Meta = getFieldMeta(`classificationDetails.[${index}].subClassification2`);

                return (
                  <Grid item xs={12} key={index}>
                    <Box display="flex" alignItems="center" mt={-2}>
                      <Box display="flex" className={classes.iucnInputContainer}>
                        <Box className={classes.iucnInput} my={2} pr={2}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="classification">Classification</InputLabel>
                            <Select
                              id={`classificationDetails.[${index}].classification`}
                              name={`classificationDetails.[${index}].classification`}
                              labelId="classification"
                              label="Classification"
                              value={classificationDetail.classification}
                              onChange={handleChange}
                              error={classificationMeta.touched && Boolean(classificationMeta.error)}
                              inputProps={{ 'aria-label': 'Classification' }}>
                              {props.classifications.map((item: any) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{classificationMeta.error}</FormHelperText>
                          </FormControl>
                        </Box>
                        <Box className={classes.iucnInput} my={2} pr={2}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="subClassification1">Sub-classification</InputLabel>
                            <Select
                              id={`classificationDetails.[${index}].subClassification1`}
                              name={`classificationDetails.[${index}].subClassification1`}
                              labelId="subClassification1"
                              label="Sub-classification"
                              value={classificationDetail.subClassification1}
                              onChange={handleChange}
                              disabled={!classificationDetail.classification}
                              error={subClassification1Meta.touched && Boolean(subClassification1Meta.error)}
                              inputProps={{ 'aria-label': 'subClassification1' }}>
                              {props.subClassifications.map((item: any) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{subClassification1Meta.error}</FormHelperText>
                          </FormControl>
                        </Box>
                        <Box className={classes.iucnInput} my={2}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="subClassification2">Sub-classification</InputLabel>
                            <Select
                              id={`classificationDetails.[${index}].subClassification2`}
                              name={`classificationDetails.[${index}].subClassification2`}
                              labelId="subClassification2"
                              label="Sub-classification"
                              value={classificationDetail.subClassification2}
                              onChange={handleChange}
                              disabled={!classificationDetail.subClassification1}
                              error={subClassification2Meta.touched && Boolean(subClassification2Meta.error)}
                              inputProps={{ 'aria-label': 'subClassification2' }}>
                              {props.subClassifications.map((item: any) => (
                                <MenuItem key={item.value} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{subClassification2Meta.error}</FormHelperText>
                          </FormControl>
                        </Box>
                      </Box>
                      <Box pl={1}>
                        <IconButton color="primary" aria-label="delete" onClick={() => arrayHelpers.remove(index)}>
                          <Icon path={mdiTrashCanOutline} size={1} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            <Box>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                aria-label="Add Another"
                onClick={() => arrayHelpers.push(ProjectIUCNFormArrayItemInitialValues)}>
                Add Classification
              </Button>
            </Box>
          </Box>
        )}
      />
    </form>
  );
};

export default ProjectIUCNForm;
