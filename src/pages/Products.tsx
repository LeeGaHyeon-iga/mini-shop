import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { productApi } from "../utils/api";
import {
  CATEGORIES,
  SORT_OPTIONS,
  PRODUCTS_PER_PAGE,
} from "../utils/constants";
import ProductCard from "../components/product/ProductCard";
import { Spinner, Button } from "../components/common";
import styles from "./Products.module.css";

export default function Products() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products", page, category, search, sort],
    queryFn: () =>
      productApi.getAll({
        page,
        pageSize: PRODUCTS_PER_PAGE,
        category: category || undefined,
        search: search || undefined,
        sort,
      }),
  });

  const products = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  if (isError) {
    return (
      <div className={styles.error}>
        <p>
          {error instanceof Error
            ? error.message
            : "상품을 불러오는데 실패했습니다"}
        </p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>상품 목록</h1>

      <div className={styles.filters}>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.categoryButton} ${
                category === cat.value ? styles.active : ""
              }`}
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="상품 검색..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>

          <select
            value={sort}
            onChange={handleSortChange}
            className={styles.sortSelect}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="large" />
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <p>상품이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.pageButton}
              >
                이전
              </button>

              <span className={styles.pageInfo}>
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={styles.pageButton}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
