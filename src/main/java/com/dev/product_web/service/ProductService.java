package com.dev.product_web.service;

import com.dev.product_web.dto.product.ProductRequest;
import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.entity.Product;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse addProduct(ProductRequest request);
    ProductResponse updateProduct(Integer id, ProductRequest request);
    void deleteProduct(Integer id);
}
