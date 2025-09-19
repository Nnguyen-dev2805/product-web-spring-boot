// const currentUser_Id = document.getElementById('currentUser_Id').value;
function renderUserList(users) {
    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Quản lý người dùng</h2>
            <button class="btn btn-success" id="openAddUserModalBtn">
                <i class="bi bi-plus"></i> Thêm người dùng
            </button>
        </div>
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    users.forEach((user, index) => {
        html += `
            <tr data-id="${user.id}">
                <td>${index + 1}</td>
                <td>${user.fullname || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.phone || ''}</td>
                <td>${user.roleName || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1 btn-edit-user" aria-label="Sửa người dùng ${user.fullname}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete-user" aria-label="Xóa người dùng ${user.fullname}">
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

function attachUserEventListeners() {
    // Mở modal thêm người dùng
    const openAddUserBtn = document.getElementById('openAddUserModalBtn');
    if (openAddUserBtn) {
        openAddUserBtn.addEventListener('click', () => {
            const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
            loadRoleOptions('addUserRole');
            addUserModal.show();
        });
    }

    // Nút sửa người dùng
    document.querySelectorAll('.btn-edit-user').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            const id = tr.getAttribute('data-id');
            const fullname = tr.children[1].textContent;
            const email = tr.children[2].textContent;
            const phone = tr.children[3].textContent;
            const roleName = tr.children[4].textContent;

            document.getElementById('editUserId').value = id;
            document.getElementById('editUserFullname').value = fullname;
            document.getElementById('editUserEmail').value = email;
            document.getElementById('editUserPhone').value = phone;

            // Load roles vào select và chọn đúng role
            loadRoleOptions('editUserRole', roleName);

            const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editUserModal.show();
        });
    });

    // Nút xóa người dùng
    document.querySelectorAll('.btn-delete-user').forEach(button => {
        button.addEventListener('click', () => {
            const tr = button.closest('tr');
            const id = tr.getAttribute('data-id');
            const fullname = tr.children[1].textContent;

            if (confirm(`Bạn có chắc muốn xóa người dùng "${fullname}" không?`)) {
                fetch(`/admin/users/delete/${id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => { throw new Error(err.message || 'Lỗi khi xóa người dùng'); });
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert('Xóa người dùng thành công!');
                        refreshUserList();
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        });
    });
}

export function refreshUserList() {
    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');
    fetch('/admin/users/list')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu người dùng');
            return response.json();
        })
        .then(users => {
            const contentDiv = document.getElementById('user-content');
            contentDiv.innerHTML = renderUserList(users);
            contentDiv.style.display = 'block';
            attachUserEventListeners();
            // Cập nhật active nav-link cho menu người dùng
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            const userNavLink = document.querySelector('.sidebar .nav-link[onclick*="loadUserContent"]');
            if (userNavLink) userNavLink.classList.add('active');
        })
        .catch(error => {
            console.error('Lỗi khi tải người dùng:', error);
            alert('Không tải được người dùng!');
        });
}

export function loadUserContent(event) {
    if (event) event.preventDefault();

    // Ẩn tất cả content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.style.display = 'none');

    // Gọi API lấy danh sách người dùng
    fetch('/admin/users/list')
        .then(response => {
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu người dùng');
            return response.json();
        })
        .then(users => {
            const contentDiv = document.getElementById('user-content');
            contentDiv.innerHTML = renderUserList(users);
            contentDiv.style.display = 'block';

            attachUserEventListeners();

            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            navLinks.forEach(link => link.classList.remove('active'));
            if (event && event.target) {
                event.target.classList.add('active');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Không tải được người dùng!');
        });
}


function loadRoleOptions(selectId, selectedRoleId = null) {
    fetch('/api/roles')
        .then(res => res.json())
        .then(roles => {
            const select = document.getElementById(selectId);
            select.innerHTML = '';
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.roleName;
                if (selectedRoleId && role.id === selectedRoleId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Lỗi khi tải danh sách vai trò:', err);
        });
}

document.getElementById('addUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Lấy dữ liệu form
    const data = {
        username: this.username.value.trim(),
        fullname: this.fullname.value.trim(),
        email: this.email.value.trim(),
        phone: this.phone.value.trim(),
        password: this.password.value,
        roleId: parseInt(this.roleId.value)
    };
    // Kiểm tra mật khẩu xác nhận
    if (this.password.value !== this.confirmPassword.value) {
        alert('Mật khẩu xác nhận không khớp');
        return;
    }
    fetch('/admin/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) return res.json().then(err => Promise.reject(err));
            return res.json();
        })
        .then(user => {
            alert('Thêm người dùng thành công');
            const addUserModalEl = document.getElementById('addUserModal');
            const modal = bootstrap.Modal.getInstance(addUserModalEl);
            if (modal) modal.hide();

            // Load lại danh sách
            refreshUserList();
        })
        .catch(err => {
            alert(err.error || 'Lỗi khi thêm người dùng');
        });
});

document.getElementById('editUserForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const data = {
        id: parseInt(this.editUserId.value),
        fullname: this.editUserFullname.value.trim(),
        email: this.editUserEmail.value.trim(),
        phone: this.editUserPhone.value.trim(),
        roleId: parseInt(this.editUserRole.value)
};
    fetch('/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) return res.json().then(err => Promise.reject(err));
            return res.json();
        })
        .then(user => {
            alert('Cập nhật người dùng thành công');
            const editUserModalEl = document.getElementById('editUserModal');
            const modal = bootstrap.Modal.getInstance(editUserModalEl);
            if (modal) modal.hide();
            refreshUserList();
        })
        .catch(err => {
            alert(err.error || 'Lỗi khi cập nhật người dùng');
        });
});




