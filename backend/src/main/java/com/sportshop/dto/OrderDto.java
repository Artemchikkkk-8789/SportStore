package com.sportshop.dto;

import lombok.Data;
import java.util.List;
import java.time.LocalDateTime;


@Data
public class OrderDto {
    private Long id;
    private LocalDateTime createdAt;
    private double totalPrice;
    private List<Long> productIds;
}
