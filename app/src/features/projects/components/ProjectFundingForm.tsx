import { Box, Button, Grid, Paper, IconButton, Typography } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import MultiAutocompleteFieldVariableSize, {
  IMultiAutocompleteFieldOption
} from 'components/fields/MultiAutocompleteFieldVariableSize';
import { DATE_FORMAT } from 'constants/dateFormats';
import { FieldArray, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { getFormattedDateRangeString } from 'utils/Utils';
import * as yup from 'yup';
import ProjectFundingItemForm, {
  IProjectFundingFormArrayItem,
  ProjectFundingFormArrayItemInitialValues
} from './ProjectFundingItemForm';

export interface IProjectFundingForm {
  funding_agencies: IProjectFundingFormArrayItem[];
  indigenous_partnerships: number[];
  stakeholder_partnerships: string[];
}

export const ProjectFundingFormInitialValues: IProjectFundingForm = {
  funding_agencies: [],
  indigenous_partnerships: [],
  stakeholder_partnerships: []
};

export const ProjectFundingFormYupSchema = yup.object().shape({});

export interface IInvestmentActionCategoryOption extends IMultiAutocompleteFieldOption {
  fs_id: number;
}

export interface IProjectFundingFormProps {
  funding_sources: IMultiAutocompleteFieldOption[];
  investment_action_category: IInvestmentActionCategoryOption[];
  first_nations: IMultiAutocompleteFieldOption[];
  stakeholder_partnerships: IMultiAutocompleteFieldOption[];
}

/**
 * Create project - Funding section
 *
 * @return {*}
 */
const ProjectFundingForm: React.FC<IProjectFundingFormProps> = (props) => {
  const formikProps = useFormikContext<IProjectFundingForm>();
  const { values } = formikProps;

  // Tracks information about the current funding source item that is being added/edited
  const [currentProjectFundingFormArrayItem, setCurrentProjectFundingFormArrayItem] = useState({
    index: 0,
    values: ProjectFundingFormArrayItemInitialValues
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <form onSubmit={formikProps.handleSubmit}>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h3">Funding Sources</Typography>
        <Button
          color="primary"
          variant="outlined"
          startIcon={<Icon path={mdiPlus} size={1} />}
          onClick={() => {
            setCurrentProjectFundingFormArrayItem({
              index: values.funding_agencies.length,
              values: ProjectFundingFormArrayItemInitialValues
            });
            setIsModalOpen(true);
          }}>
          Add Funding Source
        </Button>
      </Box>
      <Box mt={3} mb={5}>
        <Paper variant="outlined">
          <Grid container spacing={3} direction="column">
            <Grid container item direction="column">
              <FieldArray
                name="funding_agencies"
                render={(arrayHelpers) => (
                  <Box>
                    <ProjectFundingItemForm
                      open={isModalOpen}
                      onSubmit={(projectFundingItemValues, helper) => {
                        if (currentProjectFundingFormArrayItem.index < values.funding_agencies.length) {
                          // Update an existing item
                          arrayHelpers.replace(currentProjectFundingFormArrayItem.index, projectFundingItemValues);
                        } else {
                          // Add a new item
                          arrayHelpers.push(projectFundingItemValues);
                        }
                        // Reset the modal form
                        helper.resetForm();
                        // Close the modal
                        setIsModalOpen(false);
                      }}
                      onClose={() => setIsModalOpen(false)}
                      onCancel={() => setIsModalOpen(false)}
                      initialValues={currentProjectFundingFormArrayItem.values}
                      funding_sources={props.funding_sources}
                      investment_action_category={props.investment_action_category}
                    />
                    {!values.funding_agencies.length && (
                      <Box display="flex" justifyContent="center" alignContent="middle" p={3}>
                        <Typography>No Funding Sources</Typography>
                      </Box>
                    )}
                    {values.funding_agencies.map((fundingAgency, index) => {
                      return (
                        <Box mb={3} key={index}>
                          <Box m={3}>
                              <Grid container item spacing={3}>
                                <Grid container item spacing={3} justify="space-between" alignItems="center">
                                  <Grid item>
                                    <Typography variant="h3">
                                      {getCodeValueNameByID(props.funding_sources, fundingAgency.agency_id)}
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <IconButton
                                      title="Edit Funding Source"
                                      aria-label="Edit Funding Source"
                                      onClick={() => {
                                        setCurrentProjectFundingFormArrayItem({
                                          index: index,
                                          values: values.funding_agencies[index]
                                        });
                                        setIsModalOpen(true);
                                      }}>
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      title="Delete Funding Source"
                                      aria-label="Delete Funding Source"
                                      onClick={() => arrayHelpers.remove(index)}>
                                      <Delete />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                                <Grid container item spacing={3} xs={12}>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2">Funding Amount</Typography>
                                    <Typography variant="body1">{fundingAgency.funding_amount}</Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2">Start Date / End Date</Typography>
                                    <Typography variant="body1">
                                      {getFormattedDateRangeString(
                                        DATE_FORMAT.MediumDateFormat,
                                        fundingAgency.start_date,
                                        fundingAgency.end_date
                                      )}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2">Agency Project ID</Typography>
                                    <Typography variant="body1">{fundingAgency.agency_project_id}</Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6} md={4}>
                                    <Typography variant="body2">Investment Action/Category</Typography>
                                    <Typography variant="body1">{fundingAgency.investment_action_category}</Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Box>
        <Box mb={3}>
          <Typography variant="h3">Partnerships (Optional)</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MultiAutocompleteFieldVariableSize
              id={'indigenous_partnerships'}
              label={'Indigenous Partnerships'}
              options={props.first_nations}
              required={false}
            />
          </Grid>
          <Grid item xs={12}>
            <MultiAutocompleteFieldVariableSize
              id={'stakeholder_partnerships'}
              label={'Stakeholder Partnerships'}
              options={props.stakeholder_partnerships}
              required={false}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default ProjectFundingForm;

export const getCodeValueNameByID = (codeSet: IMultiAutocompleteFieldOption[], codeValueId: number): string => {
  if (!codeSet?.length || !codeValueId) {
    return '';
  }

  return codeSet.find((item) => item.value === codeValueId)?.label || '';
};
