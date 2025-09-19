package com.dev.product_web.controller.admin.product;


import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.entity.Category;
import com.dev.product_web.entity.Product;
import com.dev.product_web.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/list")
    public List<ProductResponse> getProducts() {
        return productService.getAllProducts();
    }
}
