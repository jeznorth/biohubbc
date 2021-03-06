import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { WRITE_ROLES } from '../constants/roles';
import { getDBConnection, IDBConnection } from '../database/db';
import { PostFundingSource, PostProjectObject } from '../models/project';
import { projectPostBody, projectResponseBody } from '../openapi/schemas/project';
import {
  postAncillarySpeciesSQL,
  postFocalSpeciesSQL,
  postProjectFundingSourceSQL,
  postProjectIndigenousNationSQL,
  postProjectRegionSQL,
  postProjectSQL,
  postProjectStakeholderPartnershipSQL
} from '../queries/project-queries';
import { getLogger } from '../utils/logger';
import { logRequest } from '../utils/path-utils';

const defaultLog = getLogger('paths/project');

export const POST: Operation = [logRequest('paths/project', 'POST'), createProject()];

POST.apiDoc = {
  description: 'Create a new Project.',
  tags: ['project'],
  security: [
    {
      Bearer: WRITE_ROLES
    }
  ],
  requestBody: {
    description: 'Project post request object.',
    content: {
      'application/json': {
        schema: {
          ...(projectPostBody as object)
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Project response object.',
      content: {
        'application/json': {
          schema: {
            ...(projectResponseBody as object)
          }
        }
      }
    },
    400: {
      $ref: '#/components/responses/400'
    },
    401: {
      $ref: '#/components/responses/401'
    },
    403: {
      $ref: '#/components/responses/401'
    },
    500: {
      $ref: '#/components/responses/500'
    },
    503: {
      $ref: '#/components/responses/503'
    },
    default: {
      $ref: '#/components/responses/default'
    }
  }
};

/**
 * Creates a new project record.
 *
 * @returns {RequestHandler}
 */
function createProject(): RequestHandler {
  return async (req, res) => {
    const connection = getDBConnection(req['keycloak_token']);

    const sanitizedProjectPostData = new PostProjectObject(req.body);

    try {
      const postProjectSQLStatement = postProjectSQL({
        ...sanitizedProjectPostData.project,
        ...sanitizedProjectPostData.location,
        ...sanitizedProjectPostData.objectives,
        ...sanitizedProjectPostData.coordinator
      });

      if (!postProjectSQLStatement) {
        throw {
          status: 400,
          message: 'Failed to build SQL statement'
        };
      }

      let projectId: number;

      try {
        await connection.open();

        // Insert into project table
        const createProjectResponse = await connection.query(
          postProjectSQLStatement.text,
          postProjectSQLStatement.values
        );

        const projectResult =
          (createProjectResponse && createProjectResponse.rows && createProjectResponse.rows[0]) || null;

        if (!projectResult || !projectResult.id) {
          throw {
            status: 400,
            message: 'Failed to insert into project table'
          };
        }

        projectId = projectResult.id;

        // Handle focal species
        await Promise.all(
          sanitizedProjectPostData.species.focal_species.map((focalSpecies: string) =>
            insertFocalSpecies(focalSpecies, projectId, connection)
          )
        );

        // Handle ancillary species
        await Promise.all(
          sanitizedProjectPostData.species.ancillary_species.map((ancillarySpecies: string) =>
            insertAncillarySpecies(ancillarySpecies, projectId, connection)
          )
        );

        // Handle regions
        await Promise.all(
          sanitizedProjectPostData.location.regions.map((region: string) => insertRegion(region, projectId, connection))
        );

        // Handle funding agencies
        await Promise.all(
          sanitizedProjectPostData.funding.funding_agencies.map((fundingSource: PostFundingSource) =>
            insertFundingSource(fundingSource, projectId, connection)
          )
        );

        // Handle funding indigenous partners
        await Promise.all(
          sanitizedProjectPostData.funding.indigenous_partnerships.map((indigenousNationId: number) =>
            insertIndigenousNation(indigenousNationId, projectId, connection)
          )
        );

        // Handle funding stakeholder partners
        await Promise.all(
          sanitizedProjectPostData.funding.stakeholder_partnerships.map((stakeholderPartner: string) =>
            insertStakeholderPartnership(stakeholderPartner, projectId, connection)
          )
        );

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }

      return res.status(200).json({ id: projectId });
    } catch (error) {
      defaultLog.debug({ label: 'createProject', message: 'error', error });
      throw error;
    } finally {
      connection.release();
    }
  };
}

export const insertFocalSpecies = async (
  focal_species: string,
  project_id: number,
  connection: IDBConnection
): Promise<number> => {
  const sqlStatement = postFocalSpeciesSQL(focal_species, project_id);

  if (!sqlStatement) {
    throw {
      status: 400,
      message: 'Failed to build SQL statement'
    };
  }

  const response = await connection.query(sqlStatement.text, sqlStatement.values);

  const result = (response && response.rows && response.rows[0]) || null;

  if (!result || !result.id) {
    throw {
      status: 400,
      message: 'Failed to insert into focal_species table'
    };
  }

  return result.id;
};

export const insertAncillarySpecies = async (
  ancillary_species: string,
  project_id: number,
  connection: IDBConnection
): Promise<number> => {
  const sqlStatement = postAncillarySpeciesSQL(ancillary_species, project_id);

  if (!sqlStatement) {
    throw {
      status: 400,
      message: 'Failed to build SQL statement'
    };
  }

  const response = await connection.query(sqlStatement.text, sqlStatement.values);

  const result = (response && response.rows && response.rows[0]) || null;

  if (!result || !result.id) {
    throw {
      status: 400,
      message: 'Failed to insert into ancillary_species table'
    };
  }

  return result.id;
};

export const insertRegion = async (region: string, project_id: number, connection: IDBConnection): Promise<number> => {
  const sqlStatement = postProjectRegionSQL(region, project_id);

  if (!sqlStatement) {
    throw {
      status: 400,
      message: 'Failed to build SQL statement'
    };
  }

  const response = await connection.query(sqlStatement.text, sqlStatement.values);

  const result = (response && response.rows && response.rows[0]) || null;

  if (!result || !result.id) {
    throw {
      status: 400,
      message: 'Failed to insert into project_region table'
    };
  }

  return result.id;
};

export const insertFundingSource = async (
  fundingSource: PostFundingSource,
  project_id: number,
  connection: IDBConnection
): Promise<number> => {
  const sqlStatement = postProjectFundingSourceSQL(fundingSource, project_id);

  if (!sqlStatement) {
    throw {
      status: 400,
      message: 'Failed to build SQL statement'
    };
  }

  const response = await connection.query(sqlStatement.text, sqlStatement.values);

  const result = (response && response.rows && response.rows[0]) || null;

  if (!result || !result.id) {
    throw {
      status: 400,
      message: 'Failed to insert into project_region table'
    };
  }

  return result.id;
};

export const insertIndigenousNation = async (
  indigenousNationId: number,
  project_id: number,
  connection: IDBConnection
): Promise<number> => {
  const sqlStatement = postProjectIndigenousNationSQL(indigenousNationId, project_id);

  if (!sqlStatement) {
    throw {
      status: 400,
      message: 'Failed to build SQL statement'
    };
  }

  const response = await connection.query(sqlStatement.text, sqlStatement.values);

  const result = (response && response.rows && response.rows[0]) || null;

  if (!result || !result.id) {
    throw {
      status: 400,
      message: 'Failed to insert into project_first_nation table'
    };
  }

  return result.id;
};

export const insertStakeholderPartnership = async (
  stakeholderPartner: string,
  project_id: number,
  connection: IDBConnection
): Promise<number> => {
  const sqlStatement = postProjectStakeholderPartnershipSQL(stakeholderPartner, project_id);

  if (!sqlStatement) {
    throw {
      status: 400,
      message: 'Failed to build SQL statement'
    };
  }

  const response = await connection.query(sqlStatement.text, sqlStatement.values);

  const result = (response && response.rows && response.rows[0]) || null;

  if (!result || !result.id) {
    throw {
      status: 400,
      message: 'Failed to insert into stakeholder_partnership table'
    };
  }

  return result.id;
};
