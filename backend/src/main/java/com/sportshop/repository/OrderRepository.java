package com.sportshop.repository;

import com.sportshop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsernameOrderByCreatedAtDesc(String username);
}
