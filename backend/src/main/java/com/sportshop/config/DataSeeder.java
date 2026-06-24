package com.sportshop.config;

import com.sportshop.entity.Category;
import com.sportshop.entity.Product;
import com.sportshop.entity.Role;
import com.sportshop.entity.User;
import com.sportshop.entity.UserProvider;
import com.sportshop.service.BrandService;
import com.sportshop.repository.CategoryRepository;
import com.sportshop.repository.ProductRepository;
import com.sportshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BrandService brandService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createAdminUser();

        Category tShirts = getOrCreateCategory("Футболки");
        Category shorts = getOrCreateCategory("Шорти");
        Category shoes = getOrCreateCategory("Кросівки");
        Category jackets = getOrCreateCategory("Куртки");

        seedTShirts(tShirts);
        seedShorts(shorts);
        seedShoes(shoes);
        seedJackets(jackets);
    }

    private void createAdminUser() {
        var existingAdmin = userRepository.findByUsername("admin");
        if (existingAdmin.isPresent()) {
            User admin = existingAdmin.get();
            boolean changed = false;
            if (admin.getEmail() == null || admin.getEmail().isBlank()) {
                admin.setEmail("admin@sportstore.local");
                changed = true;
            }
            if (admin.getProvider() == null) {
                admin.setProvider(UserProvider.LOCAL);
                changed = true;
            }
            if (changed) {
                userRepository.save(admin);
            }
            return;
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@sportstore.local");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ROLE_ADMIN);
        admin.setProvider(UserProvider.LOCAL);
        userRepository.save(admin);
    }

    private void seedTShirts(Category category) {
        createProduct("Футболка Nike Dri-FIT Academy", "Nike", 799, List.of("S", "M", "L", "XL"), List.of("Чорний", "Білий"), category);
        createProduct("Футболка Adidas Training Essentials", "Adidas", 749, List.of("XS", "S", "M", "L"), List.of("Синій", "Білий"), category);
        createProduct("Футболка Puma Active Tee", "Puma", 620, List.of("S", "M", "L"), List.of("Чорний", "Сірий"), category);
    }

    private void seedShorts(Category category) {
        createProduct("Шорти Nike Park III", "Nike", 699, List.of("S", "M", "L", "XL"), List.of("Чорний", "Синій"), category);
        createProduct("Шорти Adidas Entrada 22", "Adidas", 650, List.of("S", "M", "L"), List.of("Чорний", "Білий"), category);
        createProduct("Шорти Under Armour Tech", "Under Armour", 820, List.of("M", "L", "XL", "XXL"), List.of("Сірий", "Чорний"), category);
    }

    private void seedShoes(Category category) {
        createProduct("Кросівки Nike Revolution 7", "Nike", 2499, List.of("40", "41", "42", "43", "44"), List.of("Чорний", "Білий"), category);
        createProduct("Кросівки Adidas Runfalcon 3", "Adidas", 2299, List.of("39", "40", "41", "42", "43"), List.of("Синій", "Білий"), category);
        createProduct("Кросівки Puma Flyer Runner", "Puma", 1999, List.of("40", "41", "42", "43", "44"), List.of("Чорний", "Зелений"), category);
    }

    private void seedJackets(Category category) {
        createProduct("Куртка Nike Windrunner", "Nike", 3299, List.of("M", "L", "XL"), List.of("Чорний", "Синій"), category);
        createProduct("Куртка Adidas Tiro 24", "Adidas", 2899, List.of("S", "M", "L", "XL"), List.of("Чорний", "Сірий"), category);
        createProduct("Куртка Puma TeamLiga", "Puma", 2599, List.of("M", "L", "XL", "XXL"), List.of("Чорний", "Червоний"), category);
    }

    private Category getOrCreateCategory(String name) {
        return categoryRepository.findByName(name).orElseGet(() -> createCategory(name));
    }

    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    private void createProduct(String name, String brand, double price, List<String> sizes, List<String> colors, Category category) {
        brandService.getOrCreate(brand);

        if (productRepository.existsByNameAndBrandAndCategory(name, brand, category)) {
            return;
        }

        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setPrice(price);
        product.setSizes(sizes);
        product.setColors(colors);
        product.setSize(sizes.get(0));
        product.setCategory(category);
        productRepository.save(product);
    }
}
