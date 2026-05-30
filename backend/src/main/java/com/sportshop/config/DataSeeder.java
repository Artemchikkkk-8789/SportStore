package com.sportshop.config;

import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.entity.Role;
import com.sportshop.entity.User;
import com.sportshop.repository.CategoryRepository;
import com.sportshop.repository.ProductRepository;
import com.sportshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createAdminUser();

        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category tShirts = createCategory("Футболки");
        Category shorts = createCategory("Шорти");
        Category shoes = createCategory("Кросівки");
        Category jackets = createCategory("Куртки");

        seedTShirts(tShirts);
        seedShorts(shorts);
        seedShoes(shoes);
        seedJackets(jackets);
    }

    private void createAdminUser() {
        if (userRepository.findByUsername("admin").isPresent()) {
            return;
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ROLE_ADMIN);
        userRepository.save(admin);
    }

    private void seedTShirts(Category category) {
        createProduct("Футболка Nike Dri-FIT Academy", "Nike", 799, "M", category);
        createProduct("Футболка Adidas Training Essentials", "Adidas", 749, "L", category);
        createProduct("Футболка Puma Active Tee", "Puma", 620, "S", category);
    }

    private void seedShorts(Category category) {
        createProduct("Шорти Nike Park III", "Nike", 699, "M", category);
        createProduct("Шорти Adidas Entrada 22", "Adidas", 650, "L", category);
        createProduct("Шорти Under Armour Tech", "Under Armour", 820, "XL", category);
    }

    private void seedShoes(Category category) {
        createProduct("Кросівки Nike Revolution 7", "Nike", 2499, "42", category);
        createProduct("Кросівки Adidas Runfalcon 3", "Adidas", 2299, "43", category);
        createProduct("Кросівки Puma Flyer Runner", "Puma", 1999, "41", category);
    }

    private void seedJackets(Category category) {
        createProduct("Куртка Nike Windrunner", "Nike", 3299, "L", category);
        createProduct("Куртка Adidas Tiro 24", "Adidas", 2899, "M", category);
        createProduct("Куртка Puma TeamLiga", "Puma", 2599, "XL", category);
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
