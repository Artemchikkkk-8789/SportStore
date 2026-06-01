package com.sportshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "size")
    private List<String> sizes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "color")
    private List<String> colors = new ArrayList<>();

    @NotBlank(message = "Бренд обов'язковий")
    private String brand; // "Nike", "Adidas", "Puma"

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String mainImage;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_gallery_images", joinColumns = @JoinColumn(name = "product_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "image_url")
    private List<String> galleryImages = new ArrayList<>();

    @Column(name = "color_images", length = 10000)
    private String colorImages = "{}";
}
