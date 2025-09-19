package com.dev.product_web.repository;

import com.dev.product_web.dto.user.UserResponse;
import com.dev.product_web.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsernameAndPassword(String username,String password);

    @Query("SELECT new com.dev.product_web.dto.user.UserResponse(u.id, u.username, u.fullname, u.email, u.phone, r.roleName) " +
            "FROM User u LEFT JOIN u.role r WHERE u.id <> :currentUser_Id")
    List<UserResponse> findAllExceptCurrentUser (@Param("currentUser_Id") Integer currentUser_Id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findByEmail(String email);

}
