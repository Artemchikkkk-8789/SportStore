package com.sportshop.service;

import com.sportshop.dto.OrderDto;
import com.sportshop.entity.Order;
import com.sportshop.entity.Product;
import com.sportshop.repository.OrderRepository;
import com.sportshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }
public Order createOrder(OrderDto dto) {

    Order order = new Order();
    order.setCreatedAt(LocalDateTime.now());

    List<Product> products = productRepository.findAllById(dto.getProductIds());
    order.setProducts(products);

    double totalPrice = products.stream()
            .mapToDouble(Product::getPrice)
            .sum();
    order.setTotalPrice(totalPrice);

    return orderRepository.save(order);
}

    public Order findById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order save(OrderDto dto) {
        Order order = new Order();

        List<Product> products = productRepository.findAllById(dto.getProductIds());
        order.setProducts(products);

        double total = products.stream().mapToDouble(Product::getPrice).sum();
        order.setTotalPrice(total);

        return orderRepository.save(order);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}
