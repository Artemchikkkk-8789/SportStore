package com.sportshop.controller;

import com.sportshop.dto.ProductImagesDto;
import com.sportshop.dto.ProductDto;
import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.mapper.ProductMapper;
import com.sportshop.service.CategoryService;
import com.sportshop.service.FileStorageService;
import com.sportshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductMapper productMapper;
    private final FileStorageService fileStorageService;

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

    @PostMapping("/{id}/images")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ProductImagesDto uploadImages(
            @PathVariable Long id,
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "galleryImages", required = false) List<MultipartFile> galleryImages
    ) {
        Product product = productService.findById(id);
        if (product == null) {
            throw new RuntimeException("Product not found: " + id);
        }

        String mainImageUrl = fileStorageService.saveProductImage(id, mainImage);
        List<String> galleryImageUrls = new ArrayList<>();
        if (galleryImages != null) {
            galleryImageUrls = galleryImages.stream()
                    .map(file -> fileStorageService.saveProductImage(id, file))
                    .filter(url -> url != null)
                    .toList();
        }

        Product updated = productService.updateImages(id, mainImageUrl, galleryImageUrls);
        return new ProductImagesDto(updated.getMainImage(), updated.getGalleryImages());
    }
}
