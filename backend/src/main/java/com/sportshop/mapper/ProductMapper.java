package com.sportshop.mapper;

import com.sportshop.dto.ProductDto;
import com.sportshop.entity.Product;
import com.sportshop.entity.Category;
import org.springframework.stereotype.Component;

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
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);

        return dto;
    }

    public Product toEntity(ProductDto dto, Category category) {
    if (dto == null) return null;

    Product product = new Product();
    product.setName(dto.getName());
    product.setPrice(dto.getPrice());
    product.setBrand(dto.getBrand());
    product.setSize(dto.getSize());
    product.setCategory(category);

    return product;
}
}
