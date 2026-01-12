// ProductsPage Query
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
          images(first: 1) {
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
            images(first: 1) {
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
