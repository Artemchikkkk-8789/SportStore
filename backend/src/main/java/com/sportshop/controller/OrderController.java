package com.sportshop.controller;

import com.sportshop.dto.OrderDto;
import com.sportshop.mapper.OrderMapper;
import com.sportshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public OrderDto getById(@PathVariable Long id) {
        return OrderMapper.toDTO(orderService.findById(id));
    }

    @PostMapping
    public OrderDto create(@RequestBody OrderDto dto) {
        return OrderMapper.toDTO(orderService.createOrder(dto));
    }
}

