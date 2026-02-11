// Cart GraphQL Fragment for mutations
export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price { amount currencyCode }
              selectedOptions { name value }
              product {
                id
                title
                handle
                featuredImage { url altText width height }
              }
              image { url altText }
            }
          }
          attributes { key value }
        }
      }
    }
    buyerIdentity {
      email
      countryCode
    }
    attributes { key value }
  }
`;

// Create a new cart (with optional buyerIdentity for country/currency)
export const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!], $buyerIdentity: CartBuyerIdentityInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

// Update buyer identity on an existing cart (for country/currency switching)
export const CART_BUYER_IDENTITY_UPDATE_MUTATION = `
  mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

// Add items to a cart
export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode) @inContext(country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

// Update the quantity of items in a cart
export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode) @inContext(country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

// Remove items from a cart
export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode) @inContext(country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;
