package com.sportshop.service;

import com.sportshop.dto.OrderDto;
import com.sportshop.entity.Order;
import com.sportshop.entity.OrderStatus;
import com.sportshop.entity.Product;
import com.sportshop.repository.OrderRepository;
import com.sportshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public List<Order> findAll() {
        return orderRepository.findAll().stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .toList();
    }

    public List<Order> findByUsername(String username) {
        return orderRepository.findByUsernameOrderByCreatedAtDesc(username);
    }

    public Order createOrder(String username, OrderDto dto) {
        Order order = new Order();
        order.setUsername(username);
        order.setFullName(dto.getFullName());
        order.setPhone(dto.getPhone());
        order.setCity(dto.getCity());
        order.setAddress(dto.getAddress());
        order.setDeliveryService(dto.getDeliveryService());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setDispatchCity(dto.getDispatchCity());
        order.setEstimatedDeliveryTime(dto.getEstimatedDeliveryTime());
        order.setStatus(OrderStatus.NEW);
        order.setCreatedAt(LocalDateTime.now());

        List<Product> products = productRepository.findAllById(dto.getProductIds());
        order.setProducts(products);

        double productsTotal = products.stream()
                .mapToDouble(Product::getPrice)
                .sum();
        order.setTotalPrice(dto.getTotalPrice() > 0 ? dto.getTotalPrice() : productsTotal);

        return orderRepository.save(order);
    }

    public Order findById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order save(OrderDto dto) {
        String username = dto.getUsername() != null ? dto.getUsername() : "unknown";
        return createOrder(username, dto);
    }

    public Order updateStatus(Long id, OrderStatus status) {
        Order order = findById(id);
        if (order == null) {
            return null;
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}
