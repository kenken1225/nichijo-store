import { shopifyFetch } from "../client";
import {
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
  CUSTOMER_QUERY,
  CUSTOMER_INFO_QUERY,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_RESET_MUTATION,
  CUSTOMER_RESET_BY_URL_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ORDERS_QUERY,
  CUSTOMER_ADDRESSES_QUERY,
} from "../graphql/customer";

// Customer Address type
export type CustomerAddress = {
  id: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  provinceCode?: string;
  country?: string;
  countryCodeV2?: string;
  zip?: string;
  phone?: string;
};

// Customer type
export type Customer = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
  defaultAddress?: CustomerAddress;
  addresses?: {
    edges: { node: CustomerAddress }[];
  };
  orders?: {
    edges: { node: CustomerOrder }[];
  };
};

// Fulfillment Line Item type
export type FulfillmentLineItem = {
  lineItem: {
    title: string;
  };
  quantity: number;
};

// Fulfillment type
export type Fulfillment = {
  fulfillmentLineItems: {
    nodes: FulfillmentLineItem[];
  };
};

// Customer Order type
export type CustomerOrder = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  successfulFulfillments?: Fulfillment[];
  totalPrice: { amount: string; currencyCode: string };
  subtotalPrice: { amount: string; currencyCode: string };
  totalShippingPrice: { amount: string; currencyCode: string };
  totalTax: { amount: string; currencyCode: string };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant?: {
          title: string;
          price: { amount: string; currencyCode: string };
          image?: { url: string; altText?: string };
          product?: { handle: string };
        };
      };
    }[];
  };
  shippingAddress?: CustomerAddress;
};

// Customer Access Token type
export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

// Customer User Error type
export type CustomerUserError = {
  field?: string[];
  message: string;
  code?: string;
};

// Register a new customer
export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}) {
  const data = await shopifyFetch<{
    customerCreate: {
      customer: Customer | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_CREATE_MUTATION, { input });

  return data.customerCreate;
}

// Login
export async function loginCustomer(email: string, password: string) {
  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password },
  });

  return data.customerAccessTokenCreate;
}

// Logout
export async function logoutCustomer(customerAccessToken: string) {
  const data = await shopifyFetch<{
    customerAccessTokenDelete: {
      deletedAccessToken: string | null;
      deletedCustomerAccessTokenId: string | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, { customerAccessToken });

  return data.customerAccessTokenDelete;
}

// Get customer information
export async function getCustomer(customerAccessToken: string) {
  const data = await shopifyFetch<{
    customer: Customer | null;
  }>(CUSTOMER_QUERY, { customerAccessToken });

  return data.customer;
}

// Get customer information (no addresses or orders)
export async function getCustomerInfo(customerAccessToken: string) {
  const data = await shopifyFetch<{
    customer: Customer | null;
  }>(CUSTOMER_INFO_QUERY, { customerAccessToken });

  return data.customer;
}

// Send password reset email
export async function recoverCustomerPassword(email: string) {
  const data = await shopifyFetch<{
    customerRecover: {
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RECOVER_MUTATION, { email });

  return data.customerRecover;
}

// Reset password
export async function resetCustomerPassword(id: string, resetToken: string, password: string) {
  const data = await shopifyFetch<{
    customerReset: {
      customer: Customer | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RESET_MUTATION, {
    id: `gid://shopify/Customer/${id}`,
    input: { resetToken, password },
  });

  return data.customerReset;
}

// Reset password by URL
export async function resetCustomerPasswordByUrl(resetUrl: string, password: string) {
  const data = await shopifyFetch<{
    customerResetByUrl: {
      customer: Customer | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RESET_BY_URL_MUTATION, { resetUrl, password });

  return data.customerResetByUrl;
}

// Update customer information
export async function updateCustomer(
  customerAccessToken: string,
  customer: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    acceptsMarketing?: boolean;
  }
) {
  const data = await shopifyFetch<{
    customerUpdate: {
      customer: Customer | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_UPDATE_MUTATION, { customerAccessToken, customer });

  return data.customerUpdate;
}

// Add address
export async function createCustomerAddress(customerAccessToken: string, address: Omit<CustomerAddress, "id">) {
  const data = await shopifyFetch<{
    customerAddressCreate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ADDRESS_CREATE_MUTATION, { customerAccessToken, address });

  return data.customerAddressCreate;
}

// Update address
export async function updateCustomerAddress(
  customerAccessToken: string,
  id: string,
  address: Omit<CustomerAddress, "id">
) {
  const data = await shopifyFetch<{
    customerAddressUpdate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ADDRESS_UPDATE_MUTATION, { customerAccessToken, id, address });

  return data.customerAddressUpdate;
}

// Delete address
export async function deleteCustomerAddress(customerAccessToken: string, id: string) {
  const data = await shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ADDRESS_DELETE_MUTATION, { customerAccessToken, id });

  return data.customerAddressDelete;
}

// Set default address
export async function setDefaultCustomerAddress(customerAccessToken: string, addressId: string) {
  const data = await shopifyFetch<{
    customerDefaultAddressUpdate: {
      customer: Customer | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION, { customerAccessToken, addressId });

  return data.customerDefaultAddressUpdate;
}

// Get order history
export async function getCustomerOrders(customerAccessToken: string, first: number = 20) {
  const data = await shopifyFetch<{
    customer: {
      orders: {
        edges: { node: CustomerOrder }[];
        pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean };
      };
    } | null;
  }>(CUSTOMER_ORDERS_QUERY, { customerAccessToken, first });

  return data.customer?.orders;
}

// Get addresses
export async function getCustomerAddresses(customerAccessToken: string, first: number = 10) {
  const data = await shopifyFetch<{
    customer: {
      defaultAddress: { id: string } | null;
      addresses: {
        edges: { node: CustomerAddress }[];
      };
    } | null;
  }>(CUSTOMER_ADDRESSES_QUERY, { customerAccessToken, first });

  return {
    defaultAddressId: data.customer?.defaultAddress?.id,
    addresses: data.customer?.addresses?.edges.map((e) => e.node) ?? [],
  };
}
