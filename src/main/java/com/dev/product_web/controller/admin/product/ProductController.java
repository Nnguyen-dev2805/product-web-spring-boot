package com.dev.product_web.controller.admin.product;


import com.dev.product_web.dto.product.ProductRequest;
import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.entity.Category;
import com.dev.product_web.entity.Product;
import com.dev.product_web.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/list")
    public List<ProductResponse> getProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody @Valid ProductRequest request) {
        try {
            ProductResponse product = productService.addProduct(request);
            return ResponseEntity.ok(product);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody @Valid ProductRequest request) {
        try {
            ProductResponse response = productService.updateProduct(id, request);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct (@PathVariable Integer id) {
        try {
                productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Xóa sản phẩm thành công"));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
