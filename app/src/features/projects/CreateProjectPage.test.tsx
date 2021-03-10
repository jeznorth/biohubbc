import { cleanup, findByText as rawFindByText, fireEvent, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useBiohubApi } from 'hooks/useBioHubApi';
import React from 'react';
import { Router } from 'react-router';
import CreateProjectPage from './CreateProjectPage';

const history = createMemoryHistory();

jest.mock('../../hooks/useBioHubApi');
const mockUseBiohubApi = {
  getAllCodes: jest.fn<Promise<object>, []>()
};

const mockBiohubApi = ((useBiohubApi as unknown) as jest.Mock<typeof mockUseBiohubApi>).mockReturnValue(
  mockUseBiohubApi
);

const renderContainer = () => {
  return render(
    <Router history={history}>
      <CreateProjectPage />,
    </Router>
  );
};

describe('CreateProjectPage', () => {
  beforeEach(() => {
    // clear mocks before each test
    mockBiohubApi().getAllCodes.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the initial default page correctly', async () => {
    mockBiohubApi().getAllCodes.mockResolvedValue({
      code_set: []
    });
    const { getByText, asFragment } = renderContainer();

    await waitFor(() => {
      expect(getByText('Project Coordinator')).toBeVisible();

      expect(getByText('Permits')).toBeVisible();

      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('adds the extra create project steps if at least 1 permit is marked as having conducted sampling', async () => {
    mockBiohubApi().getAllCodes.mockResolvedValue({
      coordinator_agency: [{ id: 1, name: 'code 1' }]
    });
    const { findByText, asFragment, getByText, getByTestId, getByLabelText } = renderContainer();

    // wait for project coordinator form to load
    expect(await findByText('First Name')).toBeVisible();

    fireEvent.change(getByLabelText('First Name *'), { target: { value: 'first name' } });
    fireEvent.change(getByLabelText('Last Name *'), { target: { value: 'last name' } });
    fireEvent.change(getByLabelText('Business Email Address *'), { target: { value: 'email@email.com' } });
    fireEvent.change(getByLabelText('Coordinator Agency *'), { target: { value: 'agency name' } });

    fireEvent.click(getByText('Next'));

    // wait for permit form to load
    expect(await findByText('Add Another')).toBeVisible();

    fireEvent.change(getByLabelText('Permit Number *'), { target: { value: 12345 } });
    fireEvent.change(getByTestId('sampling_conducted'), { target: { value: 'true' } });

    // wait for forms to load
    await waitFor(() => {
      expect(getByText('General Information')).toBeVisible();

      expect(getByText('Project Coordinator')).toBeVisible();

      expect(getByText('Permits')).toBeVisible();

      expect(getByText('General Information')).toBeVisible();

      expect(getByText('Objectives')).toBeVisible();

      expect(getByText('Location')).toBeVisible();

      expect(getByText('Species')).toBeVisible();

      expect(getByText('Funding and Partnerships')).toBeVisible();

      expect(asFragment()).toMatchSnapshot();
    });
  });

  it('shows the page title', async () => {
    mockBiohubApi().getAllCodes.mockResolvedValue({
      code_set: []
    });
    const { findByText } = renderContainer();
    const PageTitle = await findByText('Create Project');

    expect(PageTitle).toBeVisible();
  });

  describe('Are you sure? Dialog', () => {
    it('shows warning dialog if the user clicks the `Cancel and Exit` button', async () => {
      mockBiohubApi().getAllCodes.mockResolvedValue({
        code_set: []
      });
      history.push('/home');
      history.push('/projects/create');
      const { findByText, getByRole } = renderContainer();
      const BackToProjectsButton = await findByText('Cancel and Exit', { exact: false });

      fireEvent.click(BackToProjectsButton);
      const AreYouSureTitle = await findByText('Cancel Create Project');
      const AreYouSureText = await findByText('Are you sure you want to cancel?');
      const AreYouSureYesButton = await rawFindByText(getByRole('dialog'), 'Yes', { exact: false });

      expect(AreYouSureTitle).toBeVisible();
      expect(AreYouSureText).toBeVisible();
      expect(AreYouSureYesButton).toBeVisible();
    });

    it('it calls history.push() if the user clicks `Yes`', async () => {
      mockBiohubApi().getAllCodes.mockResolvedValue({
        code_set: []
      });
      history.push('/home');
      history.push('/projects/create');
      const { findByText, getByRole } = renderContainer();
      const BackToProjectsButton = await findByText('Cancel and Exit', { exact: false });

      fireEvent.click(BackToProjectsButton);
      const AreYouSureYesButton = await rawFindByText(getByRole('dialog'), 'Yes', { exact: false });

      expect(history.location.pathname).toEqual('/projects/create');
      fireEvent.click(AreYouSureYesButton);
      expect(history.location.pathname).toEqual('/projects');
    });

    it('it does nothing if the user clicks `No`', async () => {
      mockBiohubApi().getAllCodes.mockResolvedValue({
        code_set: []
      });
      history.push('/home');
      history.push('/projects/create');
      const { findByText, getByRole } = renderContainer();
      const BackToProjectsButton = await findByText('Cancel and Exit', { exact: false });

      fireEvent.click(BackToProjectsButton);
      const AreYouSureNoButton = await rawFindByText(getByRole('dialog'), 'No', { exact: false });

      expect(history.location.pathname).toEqual('/projects/create');
      fireEvent.click(AreYouSureNoButton);
      expect(history.location.pathname).toEqual('/projects/create');
    });
  });
});
