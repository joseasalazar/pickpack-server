// Construct a schema, using GraphQL schema language
const { gql } = require("apollo-server");

const typeDefs = gql`
  type TourProvider {
    tourProviderId: ID!
    name: String!
    email: String!
    rfc: String!
    city: String!
    country: String!
    tour: [Tour]
  }

  type TourPhoto {
    tourPhotoId: ID!
    url: String!
  }

  type Order {
    orderId: ID!
    items: [OrderItem!]!
    customer: User!
    date: String!
  }

  type OrderItem {
    orderItemId: ID!
    tour: Tour!
    quantity: Int!
    price: Int!
  }

  type UserPayment {
    userPaymentId: ID!
    user: User!
    date: String!
    order: Order!
  }

  type Tour {
    tourId: ID!
    name: String!
    price: Int!
    daysAvailable: Int
    clasification: TourClassification
    cancellationPolicy: TourPolicy
    discount: Int
    startDate: String!
    endDate: String!
    type: String!
    quantity: Int
    status: Int
    photo: [TourPhoto!]
    createdAt: String!
    createdBy: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    userId: ID!
    name: String!
    email: String!
    password: String!
    type: String!
    birthDate: String!
    gender: String!
    city: String!
    country: String!
    createdAt: String!
  }

  type S3Payload {
    signedRequest: String!
    url: String!
  }

  type Query {
    info: String!
    users: [User!]!
    tourProviders: [TourProvider!]!
    tours: [Tour!]!
    orders: [Order!]!
  }

  type Mutation {
    signup(
      email: String!
      password: String!
      name: String!
      birthDate: String!
      gender: String!
      city: String!
      country: String!
      type: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    registerTour(
      name: String!
      price: Int!
      startDate: String!
      endDate: String!
      type: String!
    ): Tour!
    registerImage(url: String!): TourPhoto!
    uploadToS3(filename: String!, filetype: String!): S3Payload!
  }

  enum TourClassification {
    POPULAR
    FAVORITE
    BEST_SELLER
  }

  enum TourPolicy {
    SOFT
    MEDIUM
    HARD
  }
`;

module.exports = typeDefs;
