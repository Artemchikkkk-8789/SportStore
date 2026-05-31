package com.sportshop.repository;

import com.sportshop.entity.Product;
import com.sportshop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByNameAndBrandAndCategory(String name, String brand, Category category);
}
