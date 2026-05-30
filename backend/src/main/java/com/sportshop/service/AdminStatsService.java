package com.sportshop.service;

import com.sportshop.dto.AdminStatsDto;
import com.sportshop.entity.OrderStatus;
import com.sportshop.repository.CategoryRepository;
import com.sportshop.repository.OrderRepository;
import com.sportshop.repository.ProductRepository;
import com.sportshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminStatsDto getStats() {
        return new AdminStatsDto(
                productRepository.count(),
                categoryRepository.count(),
                userRepository.count(),
                orderRepository.count(),
                orderRepository.sumTotalRevenue(),
                orderRepository.countByStatus(OrderStatus.NEW),
                orderRepository.countByStatus(OrderStatus.SHIPPED),
                orderRepository.countByStatus(OrderStatus.DELIVERED)
        );
    }
}
