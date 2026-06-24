package com.sportshop.controller;

import com.sportshop.dto.OrderDto;
import com.sportshop.entity.OrderStatus;
import com.sportshop.mapper.OrderMapper;
import com.sportshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> getAll() {
        return orderService.findAll().stream()
                .map(OrderMapper::toDTO)  // static
                .toList();
    }

    @GetMapping("/my")
    public List<OrderDto> getMyOrders(Principal principal) {
        return orderService.findByUsername(principal.getName()).stream()
                .map(OrderMapper::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public OrderDto getById(@PathVariable Long id) {
        return OrderMapper.toDTO(orderService.findById(id));
    }

    @PostMapping
    public OrderDto create(@RequestBody OrderDto dto, Principal principal) {
        String username = principal != null ? principal.getName() : null;
        if (username == null && (dto.getCustomerEmail() == null || dto.getCustomerEmail().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Guest order customerEmail is required");
        }
        return OrderMapper.toDTO(orderService.createOrder(username, dto));
    }

    @PutMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            OrderStatus status = OrderStatus.valueOf(payload.get("status"));
            OrderDto order = OrderMapper.toDTO(orderService.updateStatus(id, status));
            if (order == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
            }
            return order;
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }
    }
}

