// Hàm tạo HTML danh sách danh mục
function renderCategoryList(categories) {
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Quản lý danh mục</h2>
            <button class="btn btn-success" id="openAddCategoryModalBtn">
                <i class="bi bi-plus"></i> Thêm danh mục
            </button>
        </div>
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>STT</th> <!-- Số thứ tự -->
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    categories.forEach((category, index) => {
        html += `
            <tr data-id="${category.id}">
                <td>${index + 1}</td> <!-- Hiển thị số thứ tự -->
                <td>${category.name}</td>
                <td>${category.description || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1 btn-edit-category" aria-label="Sửa danh mục ${category.name}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-category" aria-label="Xóa danh mục ${category.name}">
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


// Hàm gắn sự kiện cho các nút trong danh sách
function attachCategoryEventListeners() {
    document.getElementById('openAddCategoryModalBtn').addEventListener('click', () => {
        const addCategoryModal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
        addCategoryModal.show();
    });

    document.querySelectorAll('.btn-edit-category').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            const id = tr.getAttribute('data-id');
            const name = tr.children[1].textContent;
            const description = tr.children[2].textContent;
            document.getElementById('editCategoryId').value = id;
            document.getElementById('editCategoryName').value = name;
            document.getElementById('editCategoryDescription').value = description;
            const editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
            editCategoryModal.show();
        });
    });

    document.querySelectorAll('.btn-delete-category').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            const id = tr.getAttribute('data-id');
            const name = tr.children[1].textContent;

            if (confirm(`Bạn có chắc muốn xóa danh mục "${name}" không?`)) {
                fetch(`/admin/categories/delete/${id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => { throw new Error(err.message || 'Lỗi khi xóa danh mục'); });
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert('Xóa danh mục thành công!');
                        refreshCategoryList();
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        });
    });
}

// Hàm tải và hiển thị danh sách danh mục
export function refreshCategoryList() {
    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    fetch('/admin/categories/list')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
            return response.json();
        })
        .then(categories => {
            const contentDiv = document.getElementById('category-content');
            contentDiv.innerHTML = renderCategoryList(categories);
            contentDiv.style.display = 'block';

            attachCategoryEventListeners();

            // Cập nhật active nav-link cho menu danh mục
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            const categoryNavLink = document.querySelector('.sidebar .nav-link[onclick*="loadCategoryContent"]');
            if (categoryNavLink) categoryNavLink.classList.add('active');
        })
        .catch(error => {
            console.error('Lỗi khi tải danh mục:', error);
            alert('Không tải được danh mục!');
        });
}

// Xử lý submit form thêm danh mục
document.addEventListener('DOMContentLoaded', () => {
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const form = e.target;

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const name = form.name.value.trim();
            const description = form.description.value.trim();

            fetch('/admin/categories/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.message || 'Lỗi khi thêm danh mục'); });
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Thêm danh mục thành công!');

                    const addCategoryModalEl = document.getElementById('addCategoryModal');
                    const modal = bootstrap.Modal.getInstance(addCategoryModalEl);
                    if (modal) modal.hide();

                    form.reset();
                    form.classList.remove('was-validated');

                    // Load lại danh sách
                    refreshCategoryList();
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }
});

// Hàm load nội dung danh mục, có thể dùng làm hàm gọi khi click menu
export function loadCategoryContent(event) {
    if (event) event.preventDefault();
    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');
    fetch('/admin/categories/list')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
            return response.json();
        })
        .then(categories => {
            const contentDiv = document.getElementById('category-content');
            contentDiv.innerHTML = renderCategoryList(categories);
            contentDiv.style.display = 'block';
            attachCategoryEventListeners();
            // Cập nhật active nav-link
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            if (event && event.target) {
                event.target.classList.add('active');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Không tải được danh mục!');
        });
}

// xử lý sự kiện nhấn nút edit
document.addEventListener('DOMContentLoaded', () => {
    const editCategoryForm = document.getElementById('editCategoryForm');
    if (editCategoryForm) {
        editCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const form = e.target;

            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const id = form.querySelector('input[name="id"]').value;
            const name = form.name.value.trim();
            const description = form.description.value.trim();
            console.log('Gửi cập nhật:', { id, name, description });
            fetch(`/admin/categories/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            })
                .then(response => {
                    console.log('Response status:', response.status);
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.message || 'Lỗi khi cập nhật danh mục'); });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Cập nhật thành công:', data);
                    alert('Cập nhật danh mục thành công!');

                    const editCategoryModalEl = document.getElementById('editCategoryModal');
                    const modal = bootstrap.Modal.getInstance(editCategoryModalEl);
                    if (modal) modal.hide();

                    form.reset();
                    form.classList.remove('was-validated');

                    refreshCategoryList();
                })
                .catch(error => {
                    console.error('Lỗi cập nhật:', error);
                    alert(error.message);
                });
        });
    }
});



