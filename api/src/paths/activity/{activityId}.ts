import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { READ_ROLES } from '../../constants/roles';
import { getDBConnection } from '../../database/db';
import { activityResponseBody } from '../../openapi/schemas/activity';
import { getActivitySQL } from '../../queries/activity-queries';
import { getLogger } from '../../utils/logger';
import { logRequest } from '../../utils/path-utils';

const defaultLog = getLogger('paths/activity/{activityId}');

export const GET: Operation = [logRequest('paths/activity/{activityId}', 'POST'), getActivity()];

GET.apiDoc = {
  description: 'Fetch a activity by its ID.',
  tags: ['activity'],
  security: [
    {
      Bearer: READ_ROLES
    }
  ],
  parameters: [
    {
      in: 'path',
      name: 'activityId',
      schema: {
        type: 'number'
      },
      required: true
    }
  ],
  responses: {
    200: {
      description: 'Activity with matching activityId.',
      content: {
        'application/json': {
          schema: {
            ...(activityResponseBody as object)
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
 * Get a activity by its id.
 *
 * @returns {RequestHandler}
 */
function getActivity(): RequestHandler {
  return async (req, res) => {
    const connection = getDBConnection(req['keycloak_token']);

    try {
      const getActivitySQLStatement = getActivitySQL(Number(req.params.activityId));

      if (!getActivitySQLStatement) {
        throw {
          status: 400,
          message: 'Failed to build SQL statement'
        };
      }

      await connection.open();

      const createResponse = await connection.query(getActivitySQLStatement.text, getActivitySQLStatement.values);

      await connection.commit();

      const result = (createResponse && createResponse.rows && createResponse.rows[0]) || null;

      return res.status(200).json(result);
    } catch (error) {
      defaultLog.debug({ label: 'getActivity', message: 'error', error });
      throw error;
    } finally {
      connection.release();
    }
  };
}
