package com.sportshop.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders") // щоб не конфліктувати зі словом ORDER в SQL
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column
    private String customerEmail;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, length = 600)
    private String address;

    @Column(nullable = false)
    private String deliveryService;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    private String dispatchCity;

    @Column(nullable = false)
    private String estimatedDeliveryTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.NEW;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany
    private List<Product> products;

    private double totalPrice;
}
