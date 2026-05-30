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

const sortOptions = [
  { value: 'default', label: 'За замовчуванням' },
  { value: 'price-asc', label: 'Ціна: від дешевих до дорогих' },
  { value: 'price-desc', label: 'Ціна: від дорогих до дешевих' },
  { value: 'name-asc', label: 'Назва: А–Я' },
  { value: 'name-desc', label: 'Назва: Я–А' }
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...emptyFilters,
    categoryId: searchParams.get('categoryId') || ''
  }));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const categories = useAsyncData(() => api.getCategories(), []);
  const activeParams = useMemo(() => ({ ...filters }), [filters]);
  const products = useAsyncData(() => api.getProducts(activeParams), [activeParams]);
  const visibleProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredProducts = normalizedQuery
      ? products.data.filter((product) =>
          `${product.name || ''} ${product.brand || ''}`.toLowerCase().includes(normalizedQuery)
        )
      : products.data;

    return [...filteredProducts].sort((first, second) => {
      if (sortBy === 'price-asc') return Number(first.price) - Number(second.price);
      if (sortBy === 'price-desc') return Number(second.price) - Number(first.price);
      if (sortBy === 'name-asc') return String(first.name || '').localeCompare(String(second.name || ''), 'uk');
      if (sortBy === 'name-desc') return String(second.name || '').localeCompare(String(first.name || ''), 'uk');
      return 0;
    });
  }, [products.data, searchQuery, sortBy]);

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
        <div className="catalog-toolbar">
          <label>
            Пошук
            <input
              type="search"
              value={searchQuery}
              placeholder="Назва товару або бренд"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <label>
            Сортування
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {products.loading && <StateBlock title="Завантаження товарів..." />}
        {products.error && <StateBlock title="Не вдалося завантажити каталог" text={products.error} />}
        {!products.loading && !products.error && visibleProducts.length === 0 && (
          <StateBlock
            title={searchQuery.trim() ? 'Товарів за вашим запитом не знайдено' : 'Товарів не знайдено'}
            text="Спробуйте змінити пошук, фільтри або додайте нові позиції в адмін-панелі."
          />
        )}
        {!products.loading && !products.error && visibleProducts.length > 0 && (
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
