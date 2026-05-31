package com.sportshop.mapper;

import com.sportshop.dto.ProductDto;
import com.sportshop.entity.Product;
import com.sportshop.entity.Category;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductMapper {

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
}
