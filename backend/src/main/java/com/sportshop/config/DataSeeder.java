package com.sportshop.config;

import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.repository.CategoryRepository;
import com.sportshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        Category tShirts = createCategory("Футболки");
        Category shorts = createCategory("Шорти");
        Category shoes = createCategory("Кросівки");
        Category jackets = createCategory("Куртки");

        createProduct("Футболка Nike Dri-FIT Academy", "Nike", 799, "M", tShirts);
        createProduct("Футболка Adidas Training Essentials", "Adidas", 749, "L", tShirts);
        createProduct("Футболка Puma Active Tee", "Puma", 620, "S", tShirts);

        createProduct("Шорти Nike Park III", "Nike", 699, "M", shorts);
        createProduct("Шорти Adidas Entrada 22", "Adidas", 650, "L", shorts);
        createProduct("Шорти Under Armour Tech", "Under Armour", 820, "XL", shorts);

        createProduct("Кросівки Nike Revolution 7", "Nike", 2499, "42", shoes);
        createProduct("Кросівки Adidas Runfalcon 3", "Adidas", 2299, "43", shoes);
        createProduct("Кросівки Puma Flyer Runner", "Puma", 1999, "41", shoes);

        createProduct("Куртка Nike Windrunner", "Nike", 3299, "L", jackets);
        createProduct("Куртка Adidas Tiro 24", "Adidas", 2899, "M", jackets);
        createProduct("Куртка Puma TeamLiga", "Puma", 2599, "XL", jackets);
    }

    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    private void createProduct(String name, String brand, double price, String size, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setPrice(price);
        product.setSize(size);
        product.setCategory(category);
        productRepository.save(product);
    }
}
