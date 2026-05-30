export const storeImages = {
  banner: new URL('../../images/banner.jpg', import.meta.url).href,
  logo: new URL('../../images/logo.png', import.meta.url).href,
  categories: {
    tshirts: new URL('../../images/t-shirts/t-shirt1.jpg', import.meta.url).href,
    shorts: new URL('../../images/shorts/shorts1.jpg', import.meta.url).href,
    shoes: new URL('../../images/shoes/shoes1.jpg', import.meta.url).href,
    jackets: new URL('../../images/jackets/jacket1.jpg', import.meta.url).href
  },
  products: {
    1: [
      new URL('../../images/t-shirts/t-shirt1.jpg', import.meta.url).href,
      new URL('../../images/t-shirts/t-shirt2.jpg', import.meta.url).href,
      new URL('../../images/t-shirts/t-shirt3.jpg', import.meta.url).href,
      new URL('../../images/t-shirts/t-shirt4.jpg', import.meta.url).href
    ],
    2: [
      new URL('../../images/shorts/shorts1.jpg', import.meta.url).href,
      new URL('../../images/shorts/shorts2.jpg', import.meta.url).href,
      new URL('../../images/shorts/shorts3.jpg', import.meta.url).href,
      new URL('../../images/shorts/shorts4.jpg', import.meta.url).href
    ],
    3: [
      new URL('../../images/shoes/shoes1.jpg', import.meta.url).href,
      new URL('../../images/shoes/shoes2.jpg', import.meta.url).href,
      new URL('../../images/shoes/shoes3.jpg', import.meta.url).href,
      new URL('../../images/shoes/shoes4.jpg', import.meta.url).href
    ],
    4: [
      new URL('../../images/jackets/jacket1.jpg', import.meta.url).href,
      new URL('../../images/jackets/jacket2.jpg', import.meta.url).href,
      new URL('../../images/jackets/jacket3.jpg', import.meta.url).href,
      new URL('../../images/jackets/jacket4.jpg', import.meta.url).href
    ]
  }
};

export function getProductImage(product) {
  const categoryImages = storeImages.products[Number(product?.categoryId)] || storeImages.products[1];
  const productId = Number(product?.id) || 1;

  return categoryImages[(productId - 1) % categoryImages.length];
}

export function getProductGallery(product) {
  const categoryImages = storeImages.products[Number(product?.categoryId)] || storeImages.products[1];
  return categoryImages;
}

export function getCategoryImage(category) {
  const name = category?.name?.toLowerCase() || '';
  if (name.includes('фут') || name.includes('shirt')) return storeImages.categories.tshirts;
  if (name.includes('шорт') || name.includes('short')) return storeImages.categories.shorts;
  if (name.includes('крос') || name.includes('shoe')) return storeImages.categories.shoes;
  if (name.includes('курт') || name.includes('jacket')) return storeImages.categories.jackets;
  return storeImages.categories.tshirts;
}
