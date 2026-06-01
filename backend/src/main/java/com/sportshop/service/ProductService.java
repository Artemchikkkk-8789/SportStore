package com.sportshop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.repository.CategoryRepository;
import com.sportshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TypeReference<Map<String, List<String>>> colorImagesType = new TypeReference<>() {};

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product updatedProduct) {
        Product existingProduct = findById(id);
        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setSize(updatedProduct.getSize());
        existingProduct.setSizes(copyList(updatedProduct.getSizes()));
        existingProduct.setColors(copyList(updatedProduct.getColors()));
        existingProduct.setBrand(updatedProduct.getBrand());
        existingProduct.setCategory(updatedProduct.getCategory());
        if (updatedProduct.getColorImages() != null && !"{}".equals(updatedProduct.getColorImages())) {
            existingProduct.setColorImages(updatedProduct.getColorImages());
        }

        return productRepository.save(existingProduct);
    }

    @Transactional
    public Product updateImages(Long id, String mainImage, List<String> galleryImages) {
        Product existingProduct = findById(id);
        if (existingProduct == null) {
            return null;
        }

        if (mainImage != null) {
            existingProduct.setMainImage(mainImage);
        }
        if (galleryImages != null) {
            if (existingProduct.getGalleryImages() == null) {
                existingProduct.setGalleryImages(new ArrayList<>());
            }
            existingProduct.getGalleryImages().clear();
            existingProduct.getGalleryImages().addAll(galleryImages);
        }

        return productRepository.saveAndFlush(existingProduct);
    }

    @Transactional
    public Product updateColorImages(Long id, String color, List<String> imageUrls) {
        Product existingProduct = findById(id);
        if (existingProduct == null) {
            return null;
        }
        if (color == null || color.isBlank()) {
            throw new IllegalArgumentException("Color is required");
        }

        Map<String, List<String>> colorImages = readColorImages(existingProduct.getColorImages());
        colorImages.put(color.trim(), copyList(imageUrls));
        existingProduct.setColorImages(writeColorImages(colorImages));

        return productRepository.saveAndFlush(existingProduct);
    }

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

    public Category findCategory(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    // 🔥 Новий метод для Params (фільтрація)
    public List<Product> filterProducts(Long categoryId, String brand, Double minPrice, Double maxPrice) {

        List<Product> products = productRepository.findAll();

        if (categoryId != null) {
            products = products.stream()
                    .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(categoryId))
                    .toList();
        }

        if (brand != null) {
            products = products.stream()
                    .filter(p -> p.getBrand().equalsIgnoreCase(brand))
                    .toList();
        }

        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() >= minPrice)
                    .toList();
        }

        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() <= maxPrice)
                    .toList();
        }

        return products;
    }

    private List<String> copyList(List<String> values) {
        return values == null ? new ArrayList<>() : new ArrayList<>(values);
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
