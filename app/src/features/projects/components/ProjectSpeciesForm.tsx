import { Grid } from '@material-ui/core';
import MultiAutocompleteFieldVariableSize, {
  IMultiAutocompleteFieldOption
} from 'components/fields/MultiAutocompleteFieldVariableSize';
import { useFormikContext } from 'formik';
import React from 'react';
import * as yup from 'yup';

export interface IProjectSpeciesForm {
  focal_species: string[];
  ancillary_species: string[];
}

export const ProjectSpeciesFormInitialValues: IProjectSpeciesForm = {
  focal_species: [],
  ancillary_species: []
};

export const ProjectSpeciesFormYupSchema = yup.object().shape({});

export interface IProjectSpeciesFormProps {
  species: IMultiAutocompleteFieldOption[];
}

/**
 * Create project - Species section
 *
 * @return {*}
 */
const ProjectSpeciesForm: React.FC<IProjectSpeciesFormProps> = (props) => {
  const formikProps = useFormikContext<IProjectSpeciesForm>();
  const { handleSubmit } = formikProps;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MultiAutocompleteFieldVariableSize
            id={'focal_species'}
            label={'Focal Species'}
            options={props.species}
            required={false}
          />
        </Grid>
        <Grid item xs={12}>
          <MultiAutocompleteFieldVariableSize
            id={'ancillary_species'}
            label={'Ancillary Species'}
            options={props.species}
            required={false}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default ProjectSpeciesForm;
