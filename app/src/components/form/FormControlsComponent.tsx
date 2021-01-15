import { Button, Grid } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router';

export interface IFormControlsComponentProps {
  id: number;
  isDisabled?: boolean;
}

const FormControlsComponent: React.FC<IFormControlsComponentProps> = (props) => {
  const history = useHistory();

  const navigateToEditProjectPage = (id: string | number) => {
    history.push(`/projects/${id}/edit`);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item spacing={3}>
          <Grid item>
            <Button variant="text" color="primary" startIcon={<ArrowBack />} onClick={() => history.goBack()}>
              Back to Projects
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => navigateToEditProjectPage(props.id)}>
              Edit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default FormControlsComponent;
