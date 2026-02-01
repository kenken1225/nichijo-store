import { searchProducts } from "@/lib/shopify/products";
import { searchArticles } from "@/lib/shopify/blogs";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import { BlogArticleCard } from "@/components/blogs/BlogArticleCard";
import { SearchForm } from "@/components/search/SearchForm";
import { SearchPagination } from "@/components/search/SearchPagination";

const ITEMS_PER_PAGE = 16;

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    productPage?: string;
    articlePage?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, productPage, articlePage } = await searchParams;
  const query = q?.trim() ?? "";

  const currentProductPage = Number(productPage) || 1;
  const currentArticlePage = Number(articlePage) || 1;

  // Only search if query exists
  const products = query ? await searchProducts(query) : [];
  const articles = query ? await searchArticles(query) : [];

  const totalResults = products.length + articles.length;

  // Pagination
  const totalProductPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const totalArticlePages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const paginatedProducts = products.slice(
    (currentProductPage - 1) * ITEMS_PER_PAGE,
    currentProductPage * ITEMS_PER_PAGE
  );
  const paginatedArticles = articles.slice(
    (currentArticlePage - 1) * ITEMS_PER_PAGE,
    currentArticlePage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-background">
      <section className="bg-secondary/30 py-8 sm:py-10">
        <Container className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Search</p>
          {query ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">&quot;{query}&quot;</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {totalResults > 0 ? `${totalResults} results found` : "No results found"}
              </p>
            </>
          ) : (
            <h1 className="text-2xl sm:text-2xl font-bold text-foreground">What are you looking for?</h1>
          )}
          <div className="max-w-md mx-auto mt-6">
            <SearchForm />
          </div>
        </Container>
      </section>

      {query && (
        <section className="py-8 sm:py-12">
          <Container className="space-y-12">
            {paginatedProducts.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Products ({products.length})</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.handle}
                      title={product.title}
                      price={product.priceFormatted}
                      href={`/products/${product.handle}`}
                      imageUrl={product.image?.url}
                      imageAlt={product.image?.altText ?? product.title}
                    />
                  ))}
                </div>
                {totalProductPages > 1 && (
                  <SearchPagination
                    currentPage={currentProductPage}
                    totalPages={totalProductPages}
                    paramName="productPage"
                  />
                )}
              </div>
            )}

            {paginatedArticles.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Blog Articles ({articles.length})</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {paginatedArticles.map((article) => (
                    <BlogArticleCard key={article.handle} blogHandle={article.blogHandle} article={article} />
                  ))}
                </div>
                {totalArticlePages > 1 && (
                  <SearchPagination
                    currentPage={currentArticlePage}
                    totalPages={totalArticlePages}
                    paramName="articlePage"
                  />
                )}
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for &quot;{query}&quot;.</p>
                <p className="text-sm text-muted-foreground mt-2">Try searching with different keywords.</p>
              </div>
            )}
          </Container>
        </section>
      )}
    </div>
  );
}
