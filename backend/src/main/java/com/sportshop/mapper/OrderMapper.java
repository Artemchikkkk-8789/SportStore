package com.sportshop.mapper;

import com.sportshop.dto.OrderDto;
import com.sportshop.entity.Order;
import com.sportshop.entity.OrderStatus;

import java.util.List;

public class OrderMapper {

    public static OrderDto toDTO(Order order) {
        if (order == null) return null;

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUsername(order.getUsername());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setFullName(order.getFullName());
        dto.setPhone(order.getPhone());
        dto.setCity(order.getCity());
        dto.setAddress(order.getAddress());
        dto.setDeliveryService(order.getDeliveryService());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setDispatchCity(order.getDispatchCity());
        dto.setEstimatedDeliveryTime(order.getEstimatedDeliveryTime());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setStatus(order.getStatus().name());
        if (order.getProducts() != null) {
            List<Long> productIds = order.getProducts().stream()
                    .map(product -> product.getId())
                    .toList();
            dto.setProductIds(productIds);
        }

        return dto;
    }

    public static Order toEntity(OrderDto dto) {
        if (dto == null) return null;

        Order order = new Order();
        order.setId(dto.getId());
        order.setUsername(dto.getUsername());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setFullName(dto.getFullName());
        order.setPhone(dto.getPhone());
        order.setCity(dto.getCity());
        order.setAddress(dto.getAddress());
        order.setDeliveryService(dto.getDeliveryService());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setDispatchCity(dto.getDispatchCity());
        order.setEstimatedDeliveryTime(dto.getEstimatedDeliveryTime());
        order.setTotalPrice(dto.getTotalPrice());
        order.setCreatedAt(dto.getCreatedAt());
        if (dto.getStatus() != null) {
            order.setStatus(OrderStatus.valueOf(dto.getStatus()));
        }

        return order;
    }
}
