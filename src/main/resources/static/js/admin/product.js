function renderProductList(products) {
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Quản lý sản phẩm</h2>
            <button class="btn btn-success" id="openAddProductModalBtn">
                <i class="bi bi-plus"></i> Thêm sản phẩm
            </button>
        </div>
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Người quản lý</th>
                                <th>Danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    products.forEach((product, index) => {
        html += `
            <tr data-id="${product.id}" data-user-id="${product.userId}" data-category-id="${product.categoryId}">
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td>${product.quantity}</td>
                <td>${product.userFullName || ''}</td>
                <td>${product.categoryName || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1 btn-edit-product" aria-label="Sửa sản phẩm ${product.name}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-product" aria-label="Xóa sản phẩm ${product.name}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    return html;
}


function attachProductEventListeners() {
    // Mở modal thêm sản phẩm
    const openAddProductBtn = document.getElementById('openAddProductModalBtn');
    if (openAddProductBtn) {
        openAddProductBtn.addEventListener('click', () => {
            loadCategoryOptions('productCategory');
            loadUserOptions('productManager');
            const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
            addProductModal.show();
        });
    }

    // Nút sửa sản phẩm
    document.querySelectorAll('.btn-edit-product').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            if (!tr) return;

            const id = tr.getAttribute('data-id');
            const name = tr.children[1].textContent;
            const priceText = tr.children[2].textContent;
            const price = parseFloat(priceText.replace(/[^\d.-]/g, '')) || 0;
            const quantity = tr.children[3].textContent;

            // Lấy id người quản lý và danh mục từ data attribute
            const userId = parseInt(tr.getAttribute('data-user-id'));
            const categoryId = parseInt(tr.getAttribute('data-category-id'));

            document.getElementById('editProductId').value = id;
            document.getElementById('editProductName').value = name;
            document.getElementById('editProductPrice').value = price;
            document.getElementById('editProductQuantity').value = quantity;

            // Load danh mục và chọn đúng categoryId
            loadCategoryOptions('editProductCategory', categoryId);

            // Load người quản lý và chọn đúng userId
            loadUserOptions('editProductManager', userId);

            const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editProductModal.show();
        });
    });

    // Nút xóa sản phẩm
    document.querySelectorAll('.btn-delete-product').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            if (!tr) return;

            const id = tr.getAttribute('data-id');
            const name = tr.children[1].textContent;

            if (confirm(`Bạn có chắc muốn xóa sản phẩm "${name}" không?`)) {
                fetch(`/admin/products/delete/${id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => { throw new Error(err.message || 'Lỗi khi xóa sản phẩm'); });
                        }
                        return response.json();
                    })
                    .then(() => {
                        alert('Xóa sản phẩm thành công!');
                        refreshProductList();
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        });
    });
}


export function refreshProductList() {
    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    fetch('/admin/products/list')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu sản phẩm');
            return response.json();
        })
        .then(products => {
            const contentDiv = document.getElementById('product-content');
            contentDiv.innerHTML = renderProductList(products);
            contentDiv.style.display = 'block';

            attachProductEventListeners();

            // Cập nhật active nav-link cho menu sản phẩm
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            const productNavLink = document.querySelector('.sidebar .nav-link[onclick*="loadProductContent"]');
            if (productNavLink) productNavLink.classList.add('active');
        })
        .catch(error => {
            console.error('Lỗi khi tải sản phẩm:', error);
            alert('Không tải được sản phẩm!');
        });
}

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const name = form.name.value.trim();
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const categoryId = form.categoryId.value;
    const userId = form.userId.value; // Lấy người quản lý

    fetch('/admin/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, quantity, categoryId, userId })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Lỗi khi thêm sản phẩm'); });
            }
            return response.json();
        })
        .then(() => {
            alert('Thêm sản phẩm thành công!');

            const addProductModalEl = document.getElementById('addProductModal');
            const modal = bootstrap.Modal.getInstance(addProductModalEl);
            if (modal) modal.hide();

            form.reset();
            form.classList.remove('was-validated');

            refreshProductList();
        })
        .catch(error => {
            alert(error.message);
        });
});


// document.addEventListener('DOMContentLoaded', () => {
//     const editProductForm = document.getElementById('editProductForm');
//     if (editProductForm) {
//         editProductForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//
//             const form = e.target;
//
//             if (!form.checkValidity()) {
//                 e.stopPropagation();
//                 form.classList.add('was-validated');
//                 return;
//             }
//
//             const id = form.querySelector('input[name="id"]').value;
//             const name = form.name.value.trim();
//             const price = parseFloat(form.price.value);
//             const quantity = parseInt(form.quantity.value);
//             const categoryId = form.categoryId.value;
//
//             fetch(`/admin/products/update/${id}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ name, price, quantity, categoryId })
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         return response.json().then(err => { throw new Error(err.message || 'Lỗi khi cập nhật sản phẩm'); });
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     alert('Cập nhật sản phẩm thành công!');
//
//                     const editProductModalEl = document.getElementById('editProductModal');
//                     const modal = bootstrap.Modal.getInstance(editProductModalEl);
//                     if (modal) modal.hide();
//
//                     form.reset();
//                     form.classList.remove('was-validated');
//
//                     refreshProductList();
//                 })
//                 .catch(error => {
//                     alert(error.message);
//                 });
//         });
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const form = e.target;

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const id = form.querySelector('input[name="id"]').value;
            const name = form.name.value.trim();
            const price = parseFloat(form.price.value);
            const quantity = parseInt(form.quantity.value);
            const categoryId = form.categoryId.value;
            const userId = form.userId.value; // Lấy người quản lý

            fetch(`/admin/products/update/${id}`, {
                method: 'POST', // hoặc PUT nếu backend hỗ trợ
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, quantity, categoryId, userId })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.message || 'Lỗi khi cập nhật sản phẩm'); });
                    }
                    return response.json();
                })
                .then(() => {
                    alert('Cập nhật sản phẩm thành công!');

                    const editProductModalEl = document.getElementById('editProductModal');
                    const modal = bootstrap.Modal.getInstance(editProductModalEl);
                    if (modal) modal.hide();

                    form.reset();
                    form.classList.remove('was-validated');

                    refreshProductList();
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }
});


export function loadProductContent(event) {
    if (event) event.preventDefault();

    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    // Gọi API lấy danh sách sản phẩm
    fetch('/admin/products/list')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu sản phẩm');
            return response.json();
        })
        .then(products => {
            const contentDiv = document.getElementById('product-content');
            contentDiv.innerHTML = renderProductList(products);
            contentDiv.style.display = 'block';

            // Gắn sự kiện cho các nút trong danh sách sản phẩm
            attachProductEventListeners();

            // Cập nhật active nav-link cho menu sidebar
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            if (event && event.target) {
                event.target.classList.add('active');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Không tải được sản phẩm!');
        });
}


function loadCategoryOptions(selectId, selectedCategoryId = null) {
    fetch('/admin/categories')
        .then(res => res.json())
        .then(categories => {
            const select = document.getElementById(selectId);
            if (!select) return;
            select.innerHTML = '';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                if (selectedCategoryId !== null && category.id === selectedCategoryId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Lỗi khi tải danh sách danh mục:', err);
        });
}

function loadUserOptions(selectId, selectedUserId = null) {
    fetch('/admin/users')
        .then(res => res.json())
        .then(users => {
            const select = document.getElementById(selectId);
            if (!select) return;
            select.innerHTML = '';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.fullname;
                if (selectedUserId !== null && user.id === selectedUserId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Lỗi khi tải danh sách người quản lý:', err);
        });
}










