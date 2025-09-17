package com.dev.product_web.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) // tên sản phẩm bắt buộc
    private String name;

    @Column(columnDefinition = "TEXT") // mô tả dài
    private String description;

    @Column(nullable = false)
    private Double price;

    // Quan hệ nhiều sản phẩm thuộc về 1 category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // khóa ngoại
    private Category category;
}
