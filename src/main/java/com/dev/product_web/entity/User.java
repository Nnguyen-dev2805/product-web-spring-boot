package com.dev.product_web.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "fullname")
    private String fullname;

    @Column(name = "phone")
    private String phone;

    @Lob
    @Column(name = "image")
    private byte[] imageData;

    // 1 user có thể có nhiều products
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    // 🔑 Quan hệ với Role
    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "role_id", referencedColumnName = "id")
    @JoinColumn(name = "role_id")
    @JsonIgnoreProperties("users") // bỏ qua trường users trong Role khi serialize User
    private Role role;

//    @Column(name = "image")
//    private String image;

    // --- Helper method ---
    public String getImageDataUri() {
        if (imageData != null && imageData.length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(imageData);
            return "data:image/png;base64," + base64Image;
        }
        return null;
    }
}

