import { CART_FRAGMENT } from "./mutations";

export const PRODUCTS_LIST_QUERY = `
  query ProductsList {
    products(first: 12) {
      edges {
        node {
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 8) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
          quantityAvailable
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_RECOMMENDATIONS_QUERY = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      featuredImage {
        url
        altText
      }
      images(first: 2) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 4) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export const PRODUCTS_BY_HANDLES_QUERY = `
  query ProductsByHandles($query: String!) {
    products(first: 10, query: $query) {
      edges {
        node {
          handle
          title
          featuredImage {
            url
            altText
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query CollectionsList {
    collections(first: 20) {
      edges {
        node {
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `
  query CartById($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: 12) {
        edges {
          node {
            handle
            title
            productType
            createdAt
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const BLOGS_LIST_QUERY = `
  query BlogsList {
    blogs(first: 20) {
      edges {
        node {
          handle
          title
        }
      }
    }
  }
`;

export const BLOG_BY_HANDLE_QUERY = `
  query BlogByHandle($handle: String!) {
    blog(handle: $handle) {
      handle
      title
      articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            handle
            title
            excerpt
            publishedAt
            tags
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const ARTICLE_BY_HANDLE_QUERY = `
  query ArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      handle
      title
      articleByHandle(handle: $articleHandle) {
        handle
        title
        excerpt
        contentHtml
        publishedAt
        tags
        image {
          url
          altText
          width
          height
        }
        authorV2 {
          name
        }
      }
    }
  }
`;

export const SEARCH_ARTICLES_QUERY = `
  query SearchArticles($query: String!) {
    articles(first: 20, query: $query) {
      edges {
        node {
          handle
          title
          excerpt
          publishedAt
          tags
          image {
            url
            altText
            width
            height
          }
          blog {
            handle
            title
          }
        }
      }
    }
  }
`;

export const LATEST_ARTICLES_QUERY = `
  query LatestArticles($first: Int!) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          handle
          title
          excerpt
          publishedAt
          tags
          image {
            url
            altText
            width
            height
          }
          blog {
            handle
            title
          }
        }
      }
    }
  }
`;

export const PAGES_LIST_QUERY = `
 query PageList {
	pages(first: 20) {
		edges{
      node{
        handle
        title
      }
    }
	}
}
`;

export const PAGE_BY_HANDLE_QUERY = `
query PageShow($handle: String!) {
  page(handle: $handle) {
    handle
    title
    body
    updatedAt
  }
}
`;

export const POLICIES_QUERY = `
  query Policies {
    shop {
      privacyPolicy {
        title
        handle
        body
      }
      termsOfService {
        title
        handle
        body
      }
      shippingPolicy {
        title
        handle
        body
      }
      refundPolicy {
        title
        handle
        body
      }
    }
  }
`;

export const MENU_QUERY = `
  query Menu($handle: String!) {
    menu(handle: $handle) {
      id
      handle
      title
      items {
        id
        title
        url
        items {
          id
          title
          url
          items {
            id
            title
            url
          }
        }
      }
    }
  }
`;
