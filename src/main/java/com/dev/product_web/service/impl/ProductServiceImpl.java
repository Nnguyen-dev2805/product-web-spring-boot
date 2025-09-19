package com.dev.product_web.service.impl;

import com.dev.product_web.dto.product.ProductRequest;
import com.dev.product_web.dto.product.ProductResponse;
import com.dev.product_web.entity.Category;
import com.dev.product_web.entity.Product;
import com.dev.product_web.entity.User;
import com.dev.product_web.repository.CategoryRepository;
import com.dev.product_web.repository.ProductRepository;
import com.dev.product_web.repository.UserRepository;
import com.dev.product_web.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> modelMapper.map(p, ProductResponse.class))
                .toList();
    }

    @Override
    public ProductResponse addProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Danh mục không hợp lệ"));
        product.setCategory(category);
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Người quản lý không hợp lệ"));
        product.setUser(user);
        Product result = productRepository.save(product);
        return ProductResponse.builder()
                .id(result .getId())
                .name(result .getName())
                .price(result .getPrice() != null ? product.getPrice() : null)
                .quantity(result .getQuantity())
                .userFullName(result.getUser () != null ? product.getUser ().getFullname() : null)
                .categoryName(result.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }

    @Override
    public ProductResponse updateProduct(Integer id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại"));
        product.setName(request.getName());
        product.setPrice(request.getPrice() != null ? request.getPrice() : null);
        product.setQuantity(request.getQuantity());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Người quản lý không hợp lệ"));
        product.setUser (user);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Danh mục không hợp lệ"));
        product.setCategory(category);
        Product updatedProduct = productRepository.save(product);

        return ProductResponse.builder()
                .id(updatedProduct.getId())
                .name(updatedProduct.getName())
                .price(updatedProduct.getPrice() != null ? updatedProduct.getPrice() : null)
                .quantity(updatedProduct.getQuantity())
                .userId(updatedProduct.getUser () != null ? updatedProduct.getUser ().getId() : null)
                .userFullName(updatedProduct.getUser () != null ? updatedProduct.getUser ().getFullname() : null)
                .categoryId(updatedProduct.getCategory() != null ? updatedProduct.getCategory().getId() : null)
                .categoryName(updatedProduct.getCategory() != null ? updatedProduct.getCategory().getName() : null)
                .build();

    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new NoSuchElementException("Sản phẩm không tồn tại");
        }
        productRepository.deleteById(id);
    }
}
