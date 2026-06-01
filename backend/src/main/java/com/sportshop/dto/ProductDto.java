package com.sportshop.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private double price;
    private String size;
    private List<String> sizes;
    private List<String> colors;
    private String brand;
    private Long categoryId;
    private String mainImage;
    private List<String> galleryImages;
    private Map<String, List<String>> colorImages;
}
