import { ArrowRight, BadgePercent, ShieldCheck, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import StateBlock from '../components/StateBlock.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';
import { getCategoryImage, storeImages } from '../services/assets.js';

export default function Home() {
  const products = useAsyncData(() => api.getProducts(), []);
  const categories = useAsyncData(() => api.getCategories(), []);
  const featured = products.data.slice(0, 4);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12,18,28,.78), rgba(12,18,28,.28)), url(${storeImages.banner})` }}>
        <div className="container hero-content">
          <p className="eyebrow light">Нова колекція SportStore</p>
          <h1>Спортивний одяг для тренувань, міста і щоденного руху</h1>
          <p>
            Каталог футболок, шортів, кросівок і курток з швидким оформленням замовлення через REST API.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/catalog">
              До каталогу
              <ArrowRight size={18} />
            </Link>
            <Link className="ghost-button inverted" to="/register">
              Створити акаунт
            </Link>
          </div>
        </div>
      </section>

      <section className="container benefits">
        <div>
          <Timer size={24} />
          <span>Швидкий вибір розміру</span>
        </div>
        <div>
          <ShieldCheck size={24} />
          <span>JWT-авторизація</span>
        </div>
        <div>
          <BadgePercent size={24} />
          <span>Фільтри за брендом і ціною</span>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Категорії</p>
            <h2>Популярні напрямки</h2>
          </div>
          <Link className="text-button" to="/catalog">
            Усі товари
          </Link>
        </div>

        {categories.loading && <StateBlock title="Завантаження категорій..." />}
        {categories.error && <StateBlock title="Категорії недоступні" text={categories.error} />}
        {!categories.loading && !categories.error && (
          <div className="category-grid">
            {categories.data.map((category) => (
              <Link
                key={category.id}
                to={`/catalog?categoryId=${category.id}`}
                className="category-tile"
                style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.62), rgba(0,0,0,.12)), url(${getCategoryImage(category)})` }}
              >
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Вітрина</p>
            <h2>Рекомендовані товари</h2>
          </div>
          <Link className="text-button" to="/catalog">
            Переглянути каталог
          </Link>
        </div>

        {products.loading && <StateBlock title="Завантаження товарів..." />}
        {products.error && <StateBlock title="Товари недоступні" text={products.error} />}
        {!products.loading && !products.error && featured.length === 0 && (
          <StateBlock title="Каталог поки порожній" text="Додайте товари через адмін-панель backend." />
        )}
        {!products.loading && !products.error && featured.length > 0 && (
          <div className="products-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
