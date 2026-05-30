package com.sportshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Назва категорії не може бути порожньою")
    private String name; // приклад: "Футболки", "Кросівки"

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
