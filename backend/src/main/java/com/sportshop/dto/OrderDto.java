package com.sportshop.dto;

import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;


@Data
public class OrderDto {
    private Long id;
    private String username;
    private String customerEmail;
    private String fullName;
    private String phone;
    private String city;
    private String address;
    private String deliveryService;
    private String paymentMethod;
    private String dispatchCity;
    private String estimatedDeliveryTime;
    private LocalDateTime createdAt;
    private double totalPrice;
    private String status;
    private List<Long> productIds;
}
