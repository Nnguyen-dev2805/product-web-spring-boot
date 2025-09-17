// hàm tạo HTML danh sách sản phẩm
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
                                <th>STT</th> <!-- Số thứ tự -->
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
            <tr data-id="${product.id}">
                <td>${index + 1}</td> <!-- Hiển thị số thứ tự -->
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
    document.getElementById('openAddProductModalBtn').addEventListener('click', () => {
        // Nếu cần load danh mục vào select, gọi hàm loadCategoryOptions() ở đây
        const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
        addProductModal.show();
    });

    // Nút sửa sản phẩm
    document.querySelectorAll('.btn-edit-product').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            const id = tr.getAttribute('data-id');
            const name = tr.children[1].textContent;
            const priceText = tr.children[2].textContent;
            const price = parseFloat(priceText.replace(/[^\d.-]/g, '')) || 0;
            const quantity = tr.children[3].textContent;
            const userFullName = tr.children[4].textContent;
            const categoryName = tr.children[5].textContent;

            // Gán giá trị vào form edit (bạn cần có các input tương ứng)
            document.getElementById('editProductId').value = id;
            document.getElementById('editProductName').value = name;
            document.getElementById('editProductPrice').value = price;
            document.getElementById('editProductQuantity').value = quantity;

            // Nếu có select danh mục, load danh mục và chọn đúng categoryName
            loadCategoryOptions('editProductCategory', categoryName);

            const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editProductModal.show();
        });
    });

    // Nút xóa sản phẩm
    document.querySelectorAll('.btn-delete-product').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
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
                    .then(data => {
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

document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
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
            const categoryId = form.categoryId.value; // giả sử select có name="categoryId"

            fetch('/admin/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, quantity, categoryId })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.message || 'Lỗi khi thêm sản phẩm'); });
                    }
                    return response.json();
                })
                .then(data => {
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
    }
});

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

            fetch(`/admin/products/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, quantity, categoryId })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.message || 'Lỗi khi cập nhật sản phẩm'); });
                    }
                    return response.json();
                })
                .then(data => {
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







