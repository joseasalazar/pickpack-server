// Construct a schema, using GraphQL schema language
const { gql } = require("apollo-server");

const typeDefs = gql`
  type TourProvider {
    tourProviderId: ID!
    name: String!
    email: String!
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

  # type User {
  #   userId: ID
  #   type: Int
  #   firstName: String
  #   lastName: String
  #   email: String
  #   password: String
  #   type: UserType
  # }

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

  type Query {
    info: String!
    feed: [Link!]!
    users: [User!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    registerTour(
      name: String!
      price: Int!
      startDate: String!
      endDate: String!
      type: String!
    ): Boolean!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User
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
    links: [Link]
  }

  enum UserType {
    ADMIN
    CUSTOMER
    PROVIDER
  }
`;

module.exports = typeDefs;
