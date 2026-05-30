package com.sportshop.dto;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private double price;
    private String size;
    private String brand;
    private Long categoryId;
}
