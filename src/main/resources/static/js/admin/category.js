let allCategories = []; // lưu toàn bộ danh mục lấy từ server
const PAGE_SIZE = 5;
let currentPage = 1;
let currentSearchKeyword = '';

// Hàm tạo HTML danh sách danh mục
function renderCategoryList(categories, searchKeyword = '') {
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 class="mb-0">Quản lý danh mục</h2>
            <div class="d-flex gap-2">
                <div class="input-group shadow-sm rounded">
                    <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" 
                           id="categorySearchInput" 
                           class="form-control border-start-0" 
                           placeholder="Tìm kiếm theo tên danh mục" 
                           value="${searchKeyword}">
                </div>
                <button class="btn btn-success" id="openAddCategoryModalBtn">
                    <i class="bi bi-plus"></i> Thêm danh mục
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped align-middle">
                        <thead class="table-light">
                            <tr>
                                <th style="width: 60px;">STT</th>
                                <th style="width: 25%;">Tên danh mục</th>
                                <th>Mô tả</th>
                                <th style="width: 150px;">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    categories.forEach((category, index) => {
        html += `
            <tr data-id="${category.id}">
                <td>${index + 1}</td>
                <td>${category.name}</td>
                <td>${category.description || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1 btn-edit-category" 
                            aria-label="Sửa danh mục ${category.name}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-category" 
                            aria-label="Xóa danh mục ${category.name}">
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
                        // Tính tổng phần tử sau khi xóa (giả sử server đã xóa thành công)
                        const totalItems = allCategories.length - 1;
                        const totalPages = Math.ceil(totalItems / PAGE_SIZE);
                        // Nếu trang hiện tại vượt quá tổng trang mới, giảm trang hiện tại
                        let newPage = currentPage;
                        if (currentPage > totalPages) {
                            newPage = totalPages > 0 ? totalPages : 1;
                        }
                        refreshCategoryList(newPage, true);
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        });
    });
}

export function refreshCategoryList(page = 1, forceReload = false,searchKeyword = '') {
    currentPage = page;

    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    if (forceReload || allCategories.length === 0) {
        fetch('/admin/categories/list')
            .then(response => {
                if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
                return response.json();
            })
            .then(categories => {
                allCategories = categories;
                // renderPage();
                renderPage(searchKeyword);
            })
            .catch(error => {
                console.error('Lỗi khi tải danh mục:', error);
                alert('Không tải được danh mục!');
            });
    } else {
        renderPage(searchKeyword);
        // renderPage();
    }

    function renderPage() {
        const totalPages = Math.ceil(allCategories.length / PAGE_SIZE);
        // Nếu page vượt quá tổng trang, set lại page = totalPages
        if (currentPage > totalPages) currentPage = totalPages > 0 ? totalPages : 1;

        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const pageItems = allCategories.slice(startIndex, endIndex);

        const contentDiv = document.getElementById('category-content');
        contentDiv.innerHTML = renderCategoryList(pageItems) + renderPagination(totalPages, currentPage);
        contentDiv.style.display = 'block';

        attachCategoryEventListeners();
        attachPaginationEventListeners();

        // Cập nhật active nav-link cho menu danh mục
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        const categoryNavLink = document.querySelector('.sidebar .nav-link[onclick*="loadCategoryContent"]');
        if (categoryNavLink) categoryNavLink.classList.add('active');
    }
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
                    // Tính trang cuối cùng sau khi thêm
                    const totalItems = allCategories.length + 1; // +1 vì đã thêm mới
                    const lastPage = Math.ceil(totalItems / PAGE_SIZE);
                    // Load lại danh sách và chuyển sang trang cuối cùng
                    refreshCategoryList(lastPage, true);

                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }
});

export function loadCategoryContent(event,searchKeyword = '') {
    if (event) event.preventDefault();
    currentSearchKeyword = searchKeyword;
    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');
    if (allCategories.length === 0) {
        // Lần đầu tải dữ liệu
        fetch('/admin/categories/list')
            .then(response => {
                if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
                return response.json();
            })
            .then(categories => {
                allCategories = categories;
                currentPage = 1;
                // renderCategoryPage(currentPage);
                renderCategoryPage(currentPage, currentSearchKeyword);
            })
            .catch(error => {
                console.error(error);
                alert('Không tải được danh mục!');
            });
    } else {
        // Đã có dữ liệu, chỉ render lại trang hiện tại
        // renderCategoryPage(currentPage);
        renderCategoryPage(currentPage, currentSearchKeyword);
    }
    // Cập nhật active nav-link
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// function renderCategoryPage(page) {
//     currentPage = page;
//     const startIndex = (page - 1) * PAGE_SIZE;
//     const endIndex = startIndex + PAGE_SIZE;
//     const pageItems = allCategories.slice(startIndex, endIndex);
//     const totalPages = Math.ceil(allCategories.length / PAGE_SIZE);
//     const contentDiv = document.getElementById('category-content');
//     contentDiv.innerHTML = renderCategoryList(pageItems) + renderPagination(totalPages, page);
//     contentDiv.style.display = 'block';
//     attachCategoryEventListeners();
//     attachPaginationEventListeners();
// }

function renderCategoryPage(page, searchKeyword = '') {
    currentPage = page;

    // Lọc danh mục theo từ khóa tìm kiếm
    let filteredCategories = allCategories;
    if (searchKeyword.trim() !== '') {
        const keywordLower = searchKeyword.trim().toLowerCase();
        filteredCategories = allCategories.filter(cat => cat.name.toLowerCase().includes(keywordLower));
    }

    const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = totalPages > 0 ? totalPages : 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageItems = filteredCategories.slice(startIndex, endIndex);

    const contentDiv = document.getElementById('category-content');
    contentDiv.innerHTML = renderCategoryList(pageItems, searchKeyword) + renderPagination(totalPages, currentPage);
    contentDiv.style.display = 'block';

    attachCategoryEventListeners();
    attachPaginationEventListeners();

    // Gán sự kiện input cho ô tìm kiếm
    const searchInput = document.getElementById('categorySearchInput');
    if (searchInput) {
        searchInput.oninput = null;
        searchInput.addEventListener('input', (e) => {
            currentPage = 1;
            loadCategoryContent(null, e.target.value);
        });
    }
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

function renderPagination(totalPages, currentPage) {
    if (totalPages <= 1) return '';

    let html = `<nav aria-label="Page navigation"><ul class="pagination justify-content-center mt-3">`;

    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;

    html += `</ul></nav>`;

    return html;
}

function attachPaginationEventListeners() {
    const paginationLinks = document.querySelectorAll('#category-content .pagination a.page-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(link.getAttribute('data-page'));
            if (!isNaN(page) && page >= 1) {
                renderCategoryPage(page);
            }
        });
    });
}

// tìm kiếm
// function renderPage(searchKeyword = '') {
//     const totalPages = Math.ceil(allCategories.length / PAGE_SIZE);
//     if (currentPage > totalPages) currentPage = totalPages > 0 ? totalPages : 1;
//
//     // Nếu có từ khóa tìm kiếm, lọc danh sách
//     let filteredCategories = allCategories;
//     if (searchKeyword.trim() !== '') {
//         const keywordLower = searchKeyword.trim().toLowerCase();
//         filteredCategories = allCategories.filter(cat => cat.name.toLowerCase().includes(keywordLower));
//     }
//
//     const totalFilteredPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
//     if (currentPage > totalFilteredPages) currentPage = totalFilteredPages > 0 ? totalFilteredPages : 1;
//
//     const startIndex = (currentPage - 1) * PAGE_SIZE;
//     const endIndex = startIndex + PAGE_SIZE;
//     const pageItems = filteredCategories.slice(startIndex, endIndex);
//
//     const contentDiv = document.getElementById('category-content');
//     contentDiv.innerHTML = renderCategoryList(pageItems, searchKeyword) + renderPagination(totalFilteredPages, currentPage);
//     contentDiv.style.display = 'block';
//
//     attachCategoryEventListeners();
//     attachPaginationEventListeners();
//
//     // Gắn sự kiện cho ô tìm kiếm
//     const searchInput = document.getElementById('categorySearchInput');
//     if (searchInput) {
//         searchInput.addEventListener('input', (e) => {
//             currentPage = 1; // reset về trang 1 khi tìm kiếm
//             renderPage(e.target.value);
//         });
//     }
//
//     // Cập nhật active nav-link cho menu danh mục
//     const navLinks = document.querySelectorAll('.sidebar .nav-link');
//     navLinks.forEach(link => link.classList.remove('active'));
//     const categoryNavLink = document.querySelector('.sidebar .nav-link[onclick*="loadCategoryContent"]');
//     if (categoryNavLink) categoryNavLink.classList.add('active');
// }


function renderPage(searchKeyword = '') {
    // Lọc danh sách theo từ khóa tìm kiếm
    let filteredCategories = allCategories;
    if (searchKeyword.trim() !== '') {
        const keywordLower = searchKeyword.trim().toLowerCase();
        filteredCategories = allCategories.filter(cat => cat.name.toLowerCase().includes(keywordLower));
    }

    const totalFilteredPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
    if (currentPage > totalFilteredPages) currentPage = totalFilteredPages > 0 ? totalFilteredPages : 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageItems = filteredCategories.slice(startIndex, endIndex);

    const contentDiv = document.getElementById('category-content');
    contentDiv.innerHTML = renderCategoryList(pageItems, searchKeyword) + renderPagination(totalFilteredPages, currentPage);
    contentDiv.style.display = 'block';

    attachCategoryEventListeners();
    attachPaginationEventListeners();

    // Gán sự kiện input cho ô tìm kiếm **sau khi render xong**
    const searchInput = document.getElementById('categorySearchInput');
    if (searchInput) {
        // Xóa sự kiện cũ (nếu có) để tránh gán nhiều lần
        searchInput.oninput = null;

        searchInput.addEventListener('input', (e) => {
            console.log('Input search:', e.target.value);
            currentPage = 1; // reset về trang 1 khi tìm kiếm
            renderPage(e.target.value);
        });
    }

    // Cập nhật active nav-link cho menu danh mục
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const categoryNavLink = document.querySelector('.sidebar .nav-link[onclick*="loadCategoryContent"]');
    if (categoryNavLink) categoryNavLink.classList.add('active');
}







