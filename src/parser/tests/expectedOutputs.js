const outputs = module.exports;
outputs.p1_AsyncApi = {
  _json: {
    asyncapi: '2.0.0',
    info: {
      title: 'Processor',
      version: '0.0.1',
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0'
      }
    },
    servers: {
      local: {
        url: '0.0.0.0:1883',
        description: 'Development server',
        protocol: 'mqtt'
      }
    },
    defaultContentType: 'application/json',
    channels: {
      'game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup': {
        'x-plot': 1,
        description: 'Channel used when a player picks up an item in-game',
        parameters: {
          serverId: {
            description: 'The id of the server',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-1>'
            },
            'x-parser-schema-id': 'serverId'
          },
          playerId: {
            description: 'The id of the player who performed the action',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-2>'
            },
            'x-parser-schema-id': 'playerId'
          },
          itemId: {
            description: 'The id of item',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-3>'
            },
            'x-parser-schema-id': 'itemId'
          }
        },
        publish: {
          message: {
            payload: {
              type: 'object',
              $id: 'PlayerItemPickupPayload',
              additionalProperties: false,
              properties: {
                pickupTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the item was picked up',
                  'x-parser-schema-id': '<anonymous-schema-4>'
                }
              }
            },
            'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-original-payload': {
              type: 'object',
              $id: 'PlayerItemPickupPayload',
              additionalProperties: false,
              properties: {
                pickupTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the item was picked up'
                }
              }
            },
            schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-message-parsed': true,
            'x-parser-message-name': '<anonymous-message-1>'
          }
        }
      },
      'game/server/{serverId}/events/player/{playerId}/connect': {
        description: 'Channel used when a player joins (connect to) the game server',
        parameters: {
          serverId: {
            description: 'The id of the server',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-1>'
            },
            'x-parser-schema-id': 'serverId'
          },
          playerId: {
            description: 'The id of the player who performed the action',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-2>'
            },
            'x-parser-schema-id': 'playerId'
          }
        },
        publish: {
          message: {
            payload: {
              type: 'object',
              $id: 'PlayerConnectedPayload',
              additionalProperties: false,
              properties: {
                connectTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the player connected to the game server',
                  'x-parser-schema-id': '<anonymous-schema-5>'
                }
              }
            },
            'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-original-payload': {
              type: 'object',
              $id: 'PlayerConnectedPayload',
              additionalProperties: false,
              properties: {
                connectTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the player connected to the game server'
                }
              }
            },
            schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-message-parsed': true,
            'x-parser-message-name': '<anonymous-message-2>'
          }
        }
      },
      'game/server/{serverId}/events/player/{playerId}/disconnect': {
        description: 'Channel used when a player leaves (disconnects from) the game server',
        parameters: {
          serverId: {
            description: 'The id of the server',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-1>'
            },
            'x-parser-schema-id': 'serverId'
          },
          playerId: {
            description: 'The id of the player who performed the action',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-2>'
            },
            'x-parser-schema-id': 'playerId'
          }
        },
        publish: {
          message: {
            payload: {
              type: 'object',
              $id: 'PlayerDisconnectedPayload',
              additionalProperties: false,
              properties: {
                disconnectTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the player disconnected from the game server',
                  'x-parser-schema-id': '<anonymous-schema-6>'
                }
              }
            },
            'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-original-payload': {
              type: 'object',
              $id: 'PlayerDisconnectedPayload',
              additionalProperties: false,
              properties: {
                disconnectTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the player disconnected from the game server'
                }
              }
            },
            schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-message-parsed': true,
            'x-parser-message-name': '<anonymous-message-3>'
          }
        }
      },
      'game/server/{serverId}/events/player/{playerId}/chat': {
        description: 'Channel used when a player writes something in chat',
        parameters: {
          serverId: {
            description: 'The id of the server',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-1>'
            },
            'x-parser-schema-id': 'serverId'
          },
          playerId: {
            description: 'The id of the player who performed the action',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-2>'
            },
            'x-parser-schema-id': 'playerId'
          }
        },
        publish: {
          message: {
            payload: {
              type: 'object',
              $id: 'PlayerUsedChatPayload',
              additionalProperties: false,
              properties: {
                chatTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the player send the message in-game',
                  'x-parser-schema-id': '<anonymous-schema-7>'
                },
                message: {
                  type: 'string',
                  description: 'The message the player send',
                  'x-parser-schema-id': '<anonymous-schema-8>'
                }
              }
            },
            'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-original-payload': {
              type: 'object',
              $id: 'PlayerUsedChatPayload',
              additionalProperties: false,
              properties: {
                chatTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp the player send the message in-game'
                },
                message: {
                  type: 'string',
                  description: 'The message the player send'
                }
              }
            },
            schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-message-parsed': true,
            'x-parser-message-name': '<anonymous-message-4>'
          }
        }
      },
      'game/server/{serverId}/events/player/{playerId}/hit': {
        description: 'Channel used when a player hit another player in-game',
        parameters: {
          serverId: {
            description: 'The id of the server',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-1>'
            },
            'x-parser-schema-id': 'serverId'
          },
          playerId: {
            description: 'The id of the player who performed the action',
            schema: {
              type: 'string',
              'x-parser-schema-id': '<anonymous-schema-2>'
            },
            'x-parser-schema-id': 'playerId'
          }
        },
        publish: {
          message: {
            payload: {
              type: 'object',
              additionalProperties: false,
              properties: {
                hitTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of the hit',
                  'x-parser-schema-id': '<anonymous-schema-10>'
                },
                target: {
                  type: 'string',
                  description: 'The id of the player who got hit',
                  'x-parser-schema-id': '<anonymous-schema-11>'
                },
                damage: {
                  type: 'number',
                  description: 'The damage given to the target',
                  'x-parser-schema-id': '<anonymous-schema-12>'
                }
              },
              'x-parser-schema-id': '<anonymous-schema-9>'
            },
            'x-parser-original-schema-format': 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-original-payload': {
              type: 'object',
              additionalProperties: false,
              properties: {
                hitTimestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: 'The timestamp of the hit'
                },
                target: {
                  type: 'string',
                  description: 'The id of the player who got hit'
                },
                damage: {
                  type: 'number',
                  description: 'The damage given to the target'
                }
              }
            },
            schemaFormat: 'application/vnd.aai.asyncapi;version=2.0.0',
            'x-parser-message-parsed': true,
            'x-parser-message-name': '<anonymous-message-5>'
          }
        }
      }
    },
    'x-parser-spec-parsed': true
  }
};
