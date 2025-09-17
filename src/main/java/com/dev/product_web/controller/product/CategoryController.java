package com.dev.product_web.controller.product;

import com.dev.product_web.entity.Category;
import com.dev.product_web.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public List<Category> getCategories() {
        return categoryService.getAllCategories();
    }
}
