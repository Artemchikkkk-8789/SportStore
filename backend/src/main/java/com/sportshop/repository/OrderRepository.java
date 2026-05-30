package com.sportshop.repository;

import com.sportshop.entity.Order;
import com.sportshop.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsernameOrderByCreatedAtDesc(String username);

    long countByStatus(OrderStatus status);

    @Query("select coalesce(sum(o.totalPrice), 0) from Order o")
    double sumTotalRevenue();
}
