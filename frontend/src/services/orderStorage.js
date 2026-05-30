export const ORDER_STATUSES = ['NEW', 'SHIPPED', 'DELIVERED'];

export function getOrderStatusClass(status) {
  if (status === 'SHIPPED') return 'sent';
  if (status === 'DELIVERED') return 'delivered';
  return 'new';
}
