import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { IProject, IProjectPostObject } from 'interfaces/project-interfaces';
import { IActivity, ICreateActivity, ICreateProjectResponse, ITemplate } from 'interfaces/useBioHubApi-interfaces';
import { useMemo } from 'react';

const API_HOST = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const API_URL = (API_PORT && `${API_HOST}:${API_PORT}`) || API_HOST || null;

/**
 * Checks if a url string starts with an `http(s)://` protocol, and adds `https://` if it does not.
 *
 * @param {string} url
 * @return {*}  {string} the url which is guaranteed to have an `http(s)://` protocol.
 */
const ensureProtocol = (url: string): string => {
  return ((url.startsWith('http://') || url.startsWith('https://')) && url) || `https://${url}`;
};

/**
 * Fetch the config object.
 *
 * Note: Only works if the app is being served via `app/server/index.js` (as in OpenShift).
 *
 * @throws an error if called when the app isn't being served via `app/server/index.js`
 * @return {*}  {Promise<any>}
 */
const getConfig = async (): Promise<any> => {
  const { data } = await axios.get('/config/app');

  return data;
};

/**
 * Returns an instance of axios with baseURL and authorization headers set.
 *
 * @return {*}
 */
const useApi = () => {
  const { keycloak } = useKeycloak();
  const instance = useMemo(async () => {
    let baseURL;

    if (API_URL) {
      baseURL = API_URL;
    } else {
      const data = await getConfig();
      baseURL = data?.REACT_APP_API_HOST;
    }

    const baseUrlWithProtocol = ensureProtocol(baseURL);

    return axios.create({
      headers: {
        Authorization: `Bearer ${keycloak?.token}`
      },
      baseURL: baseUrlWithProtocol
    });
  }, [keycloak]);

  return instance;
};

/**
 * Returns a set of supported api methods.
 *
 * @return {object} object whose properties are supported api methods.
 */
export const useBiohubApi = () => {
  const apiPromise = useApi();

  /**
   * Get all projects.
   *
   * @return {*}  {Promise<IProject[]>}
   */
  const getProjects = async (): Promise<IProject[]> => {
    const api = await apiPromise;

    const { data } = await api.get(`/api/projects`);

    return data;
  };

  /**
   * Get a project based on its ID.
   *
   * @param {projectId} projectId
   * @return {*}  {Promise<IProject>}
   */
  const getProject = async (projectId: number): Promise<IProject> => {
    const api = await apiPromise;

    const { data } = await api.get(`/api/project/${projectId}`);

    return data;
  };

  /**
   * Create a new project.
   *
   * @param {IProjectPostObject} project
   * @return {*}  {Promise<ICreateProjectResponse>}
   */
  const createProject = async (project: IProjectPostObject): Promise<ICreateProjectResponse> => {
    const api = await apiPromise;

    const { data } = await api.post('/api/project', project);

    return data;
  };

  /**
   * Get a template based on its ID.
   *
   * @param {templateId} templateId
   * @return {*}  {Promise<ITemplate>}
   */
  const getTemplate = async (templateId: number): Promise<ITemplate> => {
    const api = await apiPromise;

    const { data } = await api.get(`/api/template/${templateId}`);

    return data;
  };

  /**
   * Create a new activity record.
   *
   * @param {ICreateActivity} activity
   * @return {*}  {Promise<IActivity>}
   */
  const createActivity = async (activity: ICreateActivity): Promise<IActivity> => {
    const api = await apiPromise;

    const { data } = await api.post('/api/activity', activity);

    return data;
  };

  /**
   * Fetch all code sets.
   *
   * @return {*}  {Promise<any>}
   */
  const getAllCodes = async (): Promise<any> => {
    const api = await apiPromise;

    const { data } = await api.get('/api/codes/');

    return data;
  };

  /**
   * Fetch the api json-schema spec.
   *
   * @return {*}  {Promise<any>}
   */
  const getApiSpec = async (): Promise<any> => {
    const api = await apiPromise;

    const { data } = await api.get('/api/api-docs/');

    return data;
  };

  return {
    getProjects,
    getProject,
    getTemplate,
    createProject,
    createActivity,
    getAllCodes,
    getApiSpec
  };
};
