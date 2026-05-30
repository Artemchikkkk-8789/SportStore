export const ORDER_STATUSES = ['НОВЕ', 'ВІДПРАВЛЕНО', 'ДОСТАВЛЕНО'];

const ORDERS_KEY = 'sportstore_orders';
const LAST_CHECKOUT_KEY = 'sportstore_last_checkout';

export function getOrderStatusClass(status) {
  if (status === 'ВІДПРАВЛЕНО') return 'sent';
  if (status === 'ДОСТАВЛЕНО') return 'delivered';
  return 'new';
}

function makeLocalOrderId(order, index = 0) {
  return order.id || order.orderId || `local-${order.createdAt || Date.now()}-${index}`;
}

export function normalizeOrder(order, index = 0) {
  return {
    ...order,
    id: makeLocalOrderId(order, index),
    username: order.username || order.user || 'Користувач',
    status: ORDER_STATUSES.includes(order.status) ? order.status : 'НОВЕ'
  };
}

export function readStoredOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (Array.isArray(orders) && orders.length > 0) {
      return orders.map(normalizeOrder);
    }

    const lastCheckout = JSON.parse(localStorage.getItem(LAST_CHECKOUT_KEY) || 'null');
    return lastCheckout ? [normalizeOrder(lastCheckout)] : [];
  } catch {
    return [];
  }
}

export function saveStoredOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.map(normalizeOrder)));
}

export function addStoredOrder(order) {
  const normalizedOrder = normalizeOrder(order);
  const orders = readStoredOrders().filter((storedOrder) => String(storedOrder.id) !== String(normalizedOrder.id));
  const nextOrders = [normalizedOrder, ...orders];

  localStorage.setItem(LAST_CHECKOUT_KEY, JSON.stringify(normalizedOrder));
  saveStoredOrders(nextOrders);

  return normalizedOrder;
}

export function updateStoredOrderStatus(orderId, status) {
  const orders = readStoredOrders();
  const nextOrders = orders.map((order) =>
    String(order.id) === String(orderId) ? { ...order, status } : order
  );
  const updatedOrder = nextOrders.find((order) => String(order.id) === String(orderId));

  saveStoredOrders(nextOrders);
  if (updatedOrder) {
    localStorage.setItem(LAST_CHECKOUT_KEY, JSON.stringify(updatedOrder));
  }

  return nextOrders;
}
