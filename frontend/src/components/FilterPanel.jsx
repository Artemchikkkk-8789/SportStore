export default function FilterPanel({ categories, brands = [], filters, onChange, onReset }) {
  return (
    <aside className="filter-panel">
      <div className="panel-heading">
        <h2>Фільтри</h2>
        <button type="button" className="text-button" onClick={onReset}>
          Скинути
        </button>
      </div>

      <label>
        Категорія
        <select value={filters.categoryId} onChange={(event) => onChange('categoryId', event.target.value)}>
          <option value="">Усі категорії</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Бренд
        <select
          value={filters.brand}
          onChange={(event) => onChange('brand', event.target.value)}
        >
          <option value="">Усі бренди</option>
          {brands.map((brand) => (
            <option key={brand.id || brand.name} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>

      <div className="price-grid">
        <label>
          Від
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) => onChange('minPrice', event.target.value)}
          />
        </label>
        <label>
          До
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) => onChange('maxPrice', event.target.value)}
          />
        </label>
      </div>
    </aside>
  );
}
