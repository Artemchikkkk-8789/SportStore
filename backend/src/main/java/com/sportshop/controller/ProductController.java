package com.sportshop.controller;

import com.sportshop.dto.ProductDto;
import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.mapper.ProductMapper;
import com.sportshop.service.CategoryService;
import com.sportshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductMapper productMapper;

    @PostMapping
    public ProductDto createProduct(@RequestBody ProductDto dto) {

        Category category = categoryService.findById(dto.getCategoryId());
        if (category == null) {
            throw new RuntimeException("Category not found: " + dto.getCategoryId());
        }

        Product product = productMapper.toEntity(dto, category);
        Product saved = productService.save(product);

        return productMapper.toDTO(saved);
    }
@GetMapping
public List<ProductDto> getAll(
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice
) {

    List<Product> products = productService.filterProducts(categoryId, brand, minPrice, maxPrice);

    return products.stream()
            .map(productMapper::toDTO)
            .toList();
}

    @GetMapping("/{id}")
    public ProductDto getById(@PathVariable Long id) {
        Product product = productService.findById(id);
        return productMapper.toDTO(product);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductDto dto) {
        Category category = categoryService.findById(dto.getCategoryId());
        if (category == null) {
            throw new RuntimeException("Category not found: " + dto.getCategoryId());
        }

        Product product = productMapper.toEntity(dto, category);
        Product updated = productService.update(id, product);
        if (updated == null) {
            throw new RuntimeException("Product not found: " + id);
        }
        return productMapper.toDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteById(id);
    }
}
