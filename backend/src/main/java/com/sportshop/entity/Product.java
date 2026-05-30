package com.sportshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Назва товару обов'язкова")
    private String name; // "Nike Air Max 270"

    @Positive(message = "Ціна повинна бути більшою за 0")
    private double price;

    @NotBlank(message = "Розмір обов'язковий")
    private String size; // "S", "M", "L", "XL" або "42", "43"

    @NotBlank(message = "Бренд обов'язковий")
    private String brand; // "Nike", "Adidas", "Puma"

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
