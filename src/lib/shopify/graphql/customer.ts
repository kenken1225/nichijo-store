export const CUSTOMER_FRAGMENT = `
  fragment CustomerFields on Customer {
    id
    firstName
    lastName
    email
    phone
    acceptsMarketing
    defaultAddress {
      id
      firstName
      lastName
      address1
      address2
      city
      province
      provinceCode
      country
      countryCodeV2
      zip
      phone
    }
  }
`;

export const ADDRESS_FRAGMENT = `
  fragment AddressFields on MailingAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    province
    provinceCode
    country
    countryCodeV2
    zip
    phone
  }
`;

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    name
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    successfulFulfillments{
     fulfillmentLineItems(first: 50){
      nodes{
       lineItem {
        title
      }
      quantity
      }
     }
    }
    totalPrice {
      amount
      currencyCode
    }
    subtotalPrice {
      amount
      currencyCode
    }
    totalShippingPrice {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    lineItems(first: 50) {
      edges {
        node {
          title
          quantity
          variant {
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              handle
            }
          }
        }
      }
    }
    shippingAddress {
      firstName
      lastName
      address1
      address2
      city
      province
      country
      zip
      phone
    }
  }
`;

// Register a new customer
export const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ...CustomerFields
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Login (get access token)
export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Logout (delete access token)
export const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

// Update access token
export const CUSTOMER_ACCESS_TOKEN_RENEW_MUTATION = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Send password reset email
export const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Reset password
export const CUSTOMER_RESET_MUTATION = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        ...CustomerFields
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Reset password by URL
export const CUSTOMER_RESET_BY_URL_MUTATION = `
  mutation customerResetByUrl($resetUrl: URL!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      customer {
        ...CustomerFields
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Update customer information
export const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ...CustomerFields
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Add address
export const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        ...AddressFields
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

// Update address
export const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        ...AddressFields
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

// Delete address
export const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Set default address
export const CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        ...CustomerFields
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Get customer information (token required)
export const CUSTOMER_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFields
      addresses(first: 10) {
        edges {
          node {
            ...AddressFields
          }
        }
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            ...OrderFields
          }
        }
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
  ${ADDRESS_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

// Get customer information (no addresses or orders)
export const CUSTOMER_INFO_QUERY = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFields
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

// Get order history
export const CUSTOMER_ORDERS_QUERY = `
  query customerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            ...OrderFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

// Get addresses
export const CUSTOMER_ADDRESSES_QUERY = `
  query customerAddresses($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      defaultAddress {
        id
      }
      addresses(first: $first) {
        edges {
          node {
            ...AddressFields
          }
        }
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;
