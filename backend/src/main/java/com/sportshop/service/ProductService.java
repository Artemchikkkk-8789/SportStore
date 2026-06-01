package com.sportshop.service;

import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.repository.CategoryRepository;
import com.sportshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

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
}
