package com.sportshop.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path productUploadDir = Paths.get("uploads", "products").toAbsolutePath().normalize();

    public String saveProductImage(Long productId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            Files.createDirectories(productUploadDir);
            String filename = "product-%d-%s%s".formatted(productId, UUID.randomUUID(), getExtension(file));
            Path target = productUploadDir.resolve(filename).normalize();
            file.transferTo(target);
            return "/uploads/products/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not save product image", ex);
        }
    }

    private String getExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return "";
        }

        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            return "";
        }

        return originalFilename.substring(dotIndex).toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9.]", "");
    }
}
