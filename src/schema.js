// Construct a schema, using GraphQL schema language
const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Date

  type Tour {
    tourId: ID
    tourName: String
    tourPrice: Int
    tourDiscount: Int
    tourStartDate: Date
    tourEndDate: Date
    tourType: String
    tourQuantity: Int
    tourStatus: Int
    tourPhoto: [TourPhoto]
  }

  type TourProvider {
    tourProviderId: ID
    tourProviderName: String
    tourProviderEmail: String
    tourId: [Tour]
  }

  type TourPhoto {
    tourPhotoId: ID
    tourPhotoURL: String
  }

  type Order {
    orderId: ID
    orderItems: [OrderItem]!
    customerIds: [Customer]!
    orderDate: Date!
  }

  type OrderItem {
    itemId: ID
    tourId: Tour!
    itemQuantity: Int!
    itemPrice: Int!
  }

  type Customer {
    customerId: ID
    firstName: String
    lastName: String
    email: String
  }

  type CustomerPayment {
    customerPaymentId: ID
    customerId: Customer!
    paymentDate: Date!
    oderId: Order!
  }

  type Query {
    tours: [Tour]
    tourProviders: [TourProvider]
    customers: [Customer]
    orders: [Order]
  }
`;

module.exports = typeDefs;
