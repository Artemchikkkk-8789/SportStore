package com.sportshop.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportshop.dto.ProductDto;
import com.sportshop.entity.Product;
import com.sportshop.entity.Category;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class ProductMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TypeReference<Map<String, List<String>>> colorImagesType = new TypeReference<>() {};

    public ProductDto toDTO(Product product) {
        if (product == null) return null;

        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setBrand(product.getBrand());
        dto.setSize(product.getSize());
        dto.setSizes(normalizeList(product.getSizes(), product.getSize()));
        dto.setColors(normalizeList(product.getColors(), null));
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setMainImage(product.getMainImage());
        dto.setGalleryImages(product.getGalleryImages() != null ? new ArrayList<>(product.getGalleryImages()) : new ArrayList<>());
        dto.setColorImages(readColorImages(product.getColorImages()));

        return dto;
    }

    public Product toEntity(ProductDto dto, Category category) {
        if (dto == null) return null;

        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setBrand(dto.getBrand());
        List<String> sizes = normalizeList(dto.getSizes(), dto.getSize());
        product.setSizes(sizes);
        product.setSize(sizes.isEmpty() ? dto.getSize() : sizes.get(0));
        product.setColors(normalizeList(dto.getColors(), null));
        product.setCategory(category);
    product.setMainImage(dto.getMainImage());
    product.setColorImages(writeColorImages(dto.getColorImages()));
    if (dto.getGalleryImages() != null) {
        product.setGalleryImages(new ArrayList<>(dto.getGalleryImages()));
    }

        return product;
    }

    private List<String> normalizeList(List<String> values, String fallback) {
        List<String> result = new ArrayList<>();
        if (values != null) {
            values.stream()
                    .filter(value -> value != null && !value.isBlank())
                    .map(String::trim)
                    .distinct()
                    .forEach(result::add);
        }
        if (result.isEmpty() && fallback != null && !fallback.isBlank()) {
            result.add(fallback.trim());
        }
        return result;
    }

    private Map<String, List<String>> readColorImages(String value) {
        if (value == null || value.isBlank()) {
            return new LinkedHashMap<>();
        }

        try {
            return objectMapper.readValue(value, colorImagesType);
        } catch (Exception ex) {
            return new LinkedHashMap<>();
        }
    }

    private String writeColorImages(Map<String, List<String>> value) {
        if (value == null || value.isEmpty()) {
            return "{}";
        }

        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            throw new RuntimeException("Could not serialize product color images", ex);
        }
    }
}
