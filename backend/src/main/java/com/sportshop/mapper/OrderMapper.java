package com.sportshop.mapper;

import com.sportshop.dto.OrderDto;
import com.sportshop.entity.Order;

public class OrderMapper {

    public static OrderDto toDTO(Order order) {
        if (order == null) return null;

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setCreatedAt(order.getCreatedAt());

        return dto;
    }

    public static Order toEntity(OrderDto dto) {
        if (dto == null) return null;

        Order order = new Order();
        order.setId(dto.getId());
        order.setTotalPrice(dto.getTotalPrice());
        order.setCreatedAt(dto.getCreatedAt());

        return order;
    }
}
