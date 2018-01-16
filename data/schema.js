import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';
import mocks from './mocks'

import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';

const schemaString = `
scalar DateTime

type Query {
  user(id: ID, fbId: String): User
  location(googlePlaceId: String): Location
}

enum MessageType {
  TEXT
  PICTURE
}

type User {
  id: ID
  fbId: String
  name: String
  description: String
  age: Int
  pictures: [Picture]
  location: Location
  locationTime: DateTime
  chats: [Chat]
  gender: String
}

type Chat {
  id: ID
  user: User
  location: Location
  messages: [Message]
}

type Message {
  id: ID
  content: String
  type: MessageType
  sender: User
  timestamp: DateTime
}

type Location {
  id: ID
  googlePlaceId: String
  name: String
  description: String
  pictures: [Picture]
  lat: Float
  lng: Float
  visitors: [User]
  feed: Chat
}

type Picture {
  id: ID
  url: String
  timestamp: DateTime
  expires: Boolean
}
`;

const resolveFunctions = {
  DateTime: GraphQLDateTime
};

const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions });

addMockFunctionsToSchema({ schema, mocks });

export default schema;
