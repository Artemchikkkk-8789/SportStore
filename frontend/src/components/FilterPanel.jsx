export default function FilterPanel({ categories, filters, onChange, onReset }) {
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
        <input
          type="search"
          value={filters.brand}
          placeholder="Nike, Adidas..."
          onChange={(event) => onChange('brand', event.target.value)}
        />
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
