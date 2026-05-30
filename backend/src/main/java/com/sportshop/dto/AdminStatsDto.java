package com.sportshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsDto {
    private long totalProducts;
    private long totalCategories;
    private long totalUsers;
    private long totalOrders;
    private double totalRevenue;
    private long newOrders;
    private long shippedOrders;
    private long deliveredOrders;
}
