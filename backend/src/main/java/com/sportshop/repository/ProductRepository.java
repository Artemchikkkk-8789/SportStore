package com.sportshop.repository;

import com.sportshop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByNameAndSize(String name, String size);
}
