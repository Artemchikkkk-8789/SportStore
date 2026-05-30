package com.sportshop.controller;

import com.sportshop.dto.AdminStatsDto;
import com.sportshop.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/stats")
    public AdminStatsDto getStats() {
        return adminStatsService.getStats();
    }
}
