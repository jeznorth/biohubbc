'use strict';

import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { WRITE_ROLES } from '../../../../../constants/roles';
import { getFileFromS3 } from '../../../../../utils/file-utils';
import { IMediaItem } from '../../../../../models/media';

export const GET: Operation = [getSingleMedia()];

GET.apiDoc = {
  description: 'Retrieves the content of an artifact in a project by its file name.',
  tags: ['artifacts'],
  security: [
    {
      Bearer: WRITE_ROLES
    }
  ],
  parameters: [
    {
      in: 'path',
      name: 'projectId',
      schema: {
        type: 'number'
      },
      required: true
    },
    {
      in: 'path',
      name: 'fileName',
      schema: {
        type: 'string'
      },
      required: true
    }
  ],
  responses: {
    200: {
      description: 'GET response containing the content of an artifact.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fileName: {
                  description: 'The file name of the artifact',
                  type: 'string'
                },
                lastModified: {
                  description: 'The date the object was last modified',
                  type: 'string'
                }
              },
              required: ['mediaKey']
            }
          }
        }
      }
    },
    401: {
      $ref: '#/components/responses/401'
    },
    503: {
      $ref: '#/components/responses/503'
    },
    default: {
      $ref: '#/components/responses/default'
    }
  }
};

function getSingleMedia(): RequestHandler {
  return async (req, res) => {
    if (!req.params.projectId) {
      throw {
        status: 400,
        message: 'Missing required path param `projectId`'
      };
    }

    if (!req.params.fileName) {
      throw {
        status: 400,
        message: 'Missing required path param `fileName`'
      };
    }

    const s3Object = await getFileFromS3(req.params.projectId + '/' + req.params.fileName);

    if (!s3Object) {
      return null;
    }

    let artifact: IMediaItem = {
      file_name: '',
      encoded_file: ''
    };

    artifact = {
      file_name: req.params.fileName,
      encoded_file: 'data:' + s3Object.ContentType + ';base64,' + s3Object.Body?.toString('base64')
    };

    return res.status(200).json({ artifact: artifact });
  };
}
