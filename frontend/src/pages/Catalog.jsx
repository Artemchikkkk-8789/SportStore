import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel.jsx';
import ProductCard from '../components/ProductCard.jsx';
import StateBlock from '../components/StateBlock.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';

const emptyFilters = {
  categoryId: '',
  brand: '',
  minPrice: '',
  maxPrice: ''
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    categoryId: searchParams.get('categoryId') || ''
  }));

  const categories = useAsyncData(() => api.getCategories(), []);
  const activeParams = useMemo(() => ({ ...filters }), [filters]);
  const products = useAsyncData(() => api.getProducts(activeParams), [activeParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="container page-grid">
      <div className="page-heading wide">
        <p className="eyebrow">Каталог</p>
        <h1>Спортивний одяг SportStore</h1>
        <p>Підбір товарів через REST API backend з фільтрами за категорією, брендом і ціною.</p>
      </div>

      <FilterPanel
        categories={categories.data}
        filters={filters}
        onChange={updateFilter}
        onReset={() => setFilters(emptyFilters)}
      />

      <div className="catalog-results">
        {products.loading && <StateBlock title="Завантаження товарів..." />}
        {products.error && <StateBlock title="Не вдалося завантажити каталог" text={products.error} />}
        {!products.loading && !products.error && products.data.length === 0 && (
          <StateBlock title="Товарів не знайдено" text="Спробуйте змінити фільтри або додайте нові позиції в адмін-панелі." />
        )}
        {!products.loading && !products.error && products.data.length > 0 && (
          <div className="products-grid">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
