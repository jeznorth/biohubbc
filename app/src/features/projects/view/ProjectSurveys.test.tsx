import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import ProjectSurveys from './ProjectSurveys';

const history = createMemoryHistory();

describe('ProjectSurveys', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Router history={history}>
        <ProjectSurveys projectData={{}} />
      </Router>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
