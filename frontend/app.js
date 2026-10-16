const BOOK_API = 'http://localhost:5000/api/books';
const BORROW_API = 'http://localhost:5000/api/borrows';
const CATEGORY_API = 'http://localhost:5000/api/categories';

const borrowList = document.getElementById('borrowTableBody');
const borrowModal = document.getElementById('borrowModal');
const bookList = document.getElementById('booksTableBody');
const bookModal = document.getElementById('bookModal');

const btnAddBorrow = document.getElementById('btnAddBorrow');
const borrowModalClose = document.getElementById('borrowModalClose');
const borrowModalCancel = document.getElementById('borrowModalCancel');
const borrowForm = document.getElementById('borrowForm');

const btnAddBook = document.getElementById('btnAddBook');
const bookModalClose = document.getElementById('bookModalClose');
const bookModalCancel = document.getElementById('bookModalCancel');
const bookForm = document.getElementById('bookForm');

const editBorrowModal = document.getElementById('editBorrowModal');
const editBorrowForm = document.getElementById('editBorrowForm');
const editBorrowModalClose = document.getElementById('editBorrowModalClose');
const editBorrowModalCancel = document.getElementById('editBorrowModalCancel');

const editBookModal = document.getElementById('editBookModal');
const editBookForm = document.getElementById('editBookForm');
const editBookModalClose = document.getElementById('editBookModalClose');
const editBookModalCancel = document.getElementById('editBookModalCancel');

const showArchivedBooks = document.getElementById('showArchivedBooks');

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    console.error(`Network error [${options.method ?? 'GET'} ${url}]:`, err);
    showMessage('Network error. Please check your connection.', 'error');
    return null;
  }
}

function isEmpty(value) {
  return !value || value.trim() === '';
}
 
function isValidYear(year) {
  const y = parseInt(year, 10);
  return !isNaN(y) && y >= 1000 && y <= new Date().getFullYear();
}
 
function isPositiveInt(value) {
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= 0;
}
 
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
function isValidDate(dateStr) {
  return !isNaN(Date.parse(dateStr));
}

function validateBookFields({ title, author, isbn, publisher, publication_year, total_copies, available_copies, category_id }, formId = 'bookForm', prefix = '') {
  clearFieldErrors(formId);
  let valid = true;

  const f = (id) => prefix ? `${prefix}${id.charAt(0).toUpperCase() + id.slice(1)}` : id;

  if (isEmpty(title)) { setFieldError(f('title'), 'Title is required.'); valid = false; }
  if (isEmpty(author)) { setFieldError(f('author'), 'Author is required.'); valid = false; }
  if (isEmpty(isbn)) { setFieldError(f('isbn'), 'ISBN is required.'); valid = false;
  } else if (!/^[0-9\-]+$/.test(isbn)) { setFieldError(f('isbn'), 'ISBN must contain numbers and dashes only (e.g. 978-013598579).'); valid = false; }
  if (isEmpty(publisher)) { setFieldError(f('publisher'), 'Publisher is required.'); valid = false; }
  if (isEmpty(publication_year)) { setFieldError(f('year'), 'Publication Year is required.'); valid = false;
  } else if (!isValidYear(publication_year)) { setFieldError(f('year'), `Year must be between 1000 and ${new Date().getFullYear()}.`); valid = false; }
  if (isEmpty(total_copies)) { setFieldError(f('total'), 'Total Copies required.'); valid = false;
  } else if (!isPositiveInt(total_copies)) { setFieldError(f('total'), 'Must be a non-negative number.'); valid = false; }
  if (isEmpty(available_copies)) { setFieldError(f('available'), 'Available Copies required.'); valid = false;
  } else if (!isPositiveInt(available_copies)) { setFieldError(f('available'), 'Must be a non-negative number.'); valid = false; }
  if (parseInt(available_copies) > parseInt(total_copies)) { setFieldError(f('available'), 'Cannot exceed total copies.'); valid = false; }
  if (isEmpty(category_id)) { setFieldError(f('category'), 'Category is required.'); valid = false; }

  return valid;
}

function validateBorrowFields({ name, email, address, book_id, due_date }, formId = 'borrowForm', prefix = '') {
  
  clearFieldErrors(formId);
  let valid = true;

  const f = (id) => prefix ? `${prefix}${id.charAt(0).toUpperCase() + id.slice(1)}` : id;

  if (isEmpty(name)) { setFieldError(f('borrower'), 'Name is required.'); valid = false; }
  if (isEmpty(email)) { setFieldError(f('email'), 'Email is required.'); valid = false;
  } else if (!isValidEmail(email)) { setFieldError(f('email'), 'Please enter a valid email address.'); valid = false; }
  if (isEmpty(address)) { setFieldError(f('address'), 'Address is required.'); valid = false; }
  if (isEmpty(book_id)) { setFieldError(f('bookId'), 'Please select a book.'); valid = false; }
  if(isEmpty(due_date)) { setFieldError(f('dueDate'), 'Due Date is required.'); valid = false;
  } else if (!isValidDate(due_date)) { setFieldError(f('dueDate'), 'A valid due date is required.'); valid = false; 
  } else if (new Date(due_date) < new Date(new Date().toDateString())) {
    setFieldError(f('dueDate'), 'Due date cannot be in the past.'); valid = false;
  }

  return valid;
}

document.getElementById('showArchivedBooks')
  .addEventListener('change', function () {
    if (this.checked) {
      loadArchivedBooks();
    } else {
      loadBooks();
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('borrowSearch')
    .addEventListener('input', borrowSearch);

  document.getElementById('borrowStatusFilter')
    .addEventListener('change', borrowSearch);
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('bookSearch')
    .addEventListener('input', bookSearch);

  document.getElementById('bookCategoryFilter')
    .addEventListener('change', bookSearch);
});

//LOAD BORROW RECORDS
async function loadBorrows() {

  const response = await safeFetch(BORROW_API);
  if (!response) return;

  if (!response.ok) {
    showMessage('Failed to load borrow records.', 'error');
    return;
  }

  const borrows = await response.json();

  borrowList.innerHTML = '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  borrows.reverse().forEach((record, index) => {

    const dueDate = new Date(record.due_date);
    dueDate.setHours(0, 0, 0, 0);

    const status = record.status === 'borrowed' && dueDate < today
      ? 'overdue'
      : record.status;

    borrowList.innerHTML += `
    <tr 
      data-book="${record.title}"
      data-borrower="${record.name}"
      data-email="${record.email ?? ''}"
      data-address="${record.address ?? ''}"
      data-status="${record.status}"
      data-due="${record.due_date}"
    >
        <td>${borrows.length - index}</td>
        <td>${record.name}</td>
        <td>${record.email ?? ''}</td>        
        <td>${record.address ?? ''}</td>
        <td>${record.title}</td>
        <td>${record.borrow_date ?? ''}</td>
        <td>${record.due_date ?? ''}</td>
        <td>${record.return_date ?? ''}</td>
        <td class="status-${status}">${status}</td>

        <td>
          <button class="btn-action status ${status === 'returned' ? 'returned' : ''} ${status === 'overdue' ? 'overdue' : ''}" 
          ${record.status === 'returned' ? 'disabled' : `onclick="returnBook(${record.borrow_id})"`}>
            Return
          </button>
          <button class="btn-action edit" ${record.status === 'returned' ? 'disabled' : `onclick="editBorrow(${record.borrow_id})"`}>Edit</button>
        </td>
    </tr>
    `;
  });
}

//CONFIRM MODAL
function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = message;
    modal.classList.add('open');

    document.getElementById('confirmOk').onclick = () => {
      modal.classList.remove('open');
      resolve(true);
    };

    document.getElementById('confirmCancel').onclick = () => {
      modal.classList.remove('open');
      resolve(false);
    };
  });
}

//RETURN BOOK
async function returnBook(id) {

  const confirm = await showConfirm('Has the borrower returned this book?');
  if (!confirm) return;

  const res = await safeFetch(`${BORROW_API}/return/${id}`, { method: 'PUT' });
  if (!res) return;
 
  if (res.ok) {
    showMessage('Book returned successfully!');
  } else {
    showMessage('Failed to return book.', 'error');
  }

  loadBorrows();
  loadBooks();
}

//LOAD BOOK RECORDS
async function loadBooks() {

  const response = await safeFetch(BOOK_API);

  if (!response) return;
 
  if (!response.ok) {
    showMessage('Failed to load books.', 'error');
    return;
  }

  const book = await response.json();

  const categoryRes = await safeFetch(CATEGORY_API);
  if (categoryRes && categoryRes.ok) {
    const categories = await categoryRes.json();

    const categoryFilter = document.getElementById('bookCategoryFilter');
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      categoryFilter.innerHTML += `<option value="${cat.category}">${cat.category}</option>`;
    });

    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Select a Category</option>';
    categories.forEach(cat => {
      categorySelect.innerHTML += `<option value="${cat.category_id}">${cat.category}</option>`;
    });
  }

  const bookSelect = document.getElementById('bookId');
  bookSelect.innerHTML = '<option value="">Select a Book</option>';
  book.forEach(b => {
    bookSelect.innerHTML += `<option value="${b.book_id}">${b.title}</option>`;
  });

  bookList.innerHTML = '';

  book.forEach((record, index) => {

    bookList.innerHTML += `
    <tr
      data-title="${record.title}"
      data-author="${record.author}"
      data-isbn="${record.isbn}"
      data-category="${record.category}"
    >
        <td>${record.title}</td>
        <td>${record.author ?? ''}</td>        
        <td>${record.isbn ?? ''}</td>
        <td>${record.publisher ?? ''}</td>
        <td>${record.publication_year ?? ''}</td>
        <td>${record.total_copies ?? 0}</td>
        <td>${record.available_copies ?? 0}</td>
        <td>${record.category ?? ''}</td>

        <td>
          <button class="btn-action edit" onclick="editBook(${record.book_id})">Edit</button>
          <button class="btn-action archive" onclick="archiveBook(${record.book_id})">Archive</button> 
          <button class="btn-action delete" onclick="deleteBook(${record.book_id})">Delete</button>
        </td>
    </tr>
    `;
  });
}

//ADD BORROW RECORD
btnAddBorrow.addEventListener('click', () => {
  borrowModal.classList.add('open');
});

borrowModalClose.addEventListener('click',closeBorrowModal);

borrowModalCancel.addEventListener('click', closeBorrowModal);

function closeBorrowModal() {
  document.getElementById('borrowForm').reset();
  clearFieldErrors('borrowForm');
  borrowModal.classList.remove('open');
}

//ADD BORROW FORM
borrowForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const borrowData = {

    name:
    document.getElementById('borrower').value,

    email:
    document.getElementById('email').value,

    address:
    document.getElementById('address').value,

    book_id:
    document.getElementById('bookId').value,

    due_date:
    document.getElementById('dueDate').value

    };
  
  const valid = validateBorrowFields(borrowData);
  if (!valid) return;
  
  const res = await safeFetch(BORROW_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(borrowData)
  });

  if (!res) return;
 
  if (res.ok) {
    showMessage('Borrow record added successfully!');
    borrowForm.reset();
    borrowModal.classList.remove('open');
    loadBorrows();
    loadBooks();
  } else {
    const result = await res.json().catch(() => ({}));
    showMessage(result.message ?? 'Failed to add borrow record.', 'error');
  }

});

// ADD BOOK MODAL
btnAddBook.addEventListener('click', () => {
  bookModal.classList.add('open');
});

bookModalClose.addEventListener('click', closeBookModal);

bookModalCancel.addEventListener('click', closeBookModal);

function closeBookModal() {
  document.getElementById('bookForm').reset();
  clearFieldErrors('bookForm');
  bookModal.classList.remove('open');
}

//ADD BOOK
bookForm.addEventListener('submit', async (e) => {

  e.preventDefault();
  console.log('form submitted');

  const newBook = {

    title:
    document.getElementById('title').value,

    author:
    document.getElementById('author').value,

    isbn:
    document.getElementById('isbn').value,

    publisher:
    document.getElementById('publisher').value,

    publication_year:
    document.getElementById('year').value,

    total_copies:
    document.getElementById('total').value,

    available_copies:
    document.getElementById('available').value,

    category_id:
    document.getElementById('category').value

  };
  
  const valid = validateBookFields(newBook);
  if (!valid) return;

  const res = await safeFetch(BOOK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newBook)
  });

  if (!res) return;

  if (res.ok) {
    console.log('SUCCESS');
    showMessage('Book record added successfully!');
    bookForm.reset();
    bookModal.classList.remove('open');
  } else {
    console.log('FAILED');
    const result = await res.json().catch(() => ({}));
    showMessage('Failed to add book record', 'error');
  }

  loadBooks();;

});

function setFieldError(id, message) {
  console.log('setFieldError called:', id, message);
  const input = document.getElementById(id);
  console.log('input found:', input);
  const existing = input.parentNode.querySelector('.field-error');
  if (existing) existing.remove();

  if (message) {
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    input.parentNode.insertBefore(err, input.nextSibling);
    input.classList.add('input-error');
  } else {
    input.classList.remove('input-error');
  }
}

function clearFieldErrors(formId) {
  document.querySelectorAll(`#${formId} .field-error`).forEach(e => e.remove());
  document.querySelectorAll(`#${formId} .input-error`).forEach(e => e.classList.remove('input-error'));
}

function borrowSearch() {
  const searchValue = document.getElementById('borrowSearch').value.toLowerCase();
  const statusValue = document.getElementById('borrowStatusFilter').value.toLowerCase();

  const rows = document.querySelectorAll('#borrowTableBody tr').forEach(row => {
    const book = row.dataset.book?.toLowerCase() || '';
    const borrower = row.dataset.borrower?.toLowerCase() || '';
    const email = row.dataset.email?.toLowerCase() || '';
    const address = row.dataset.address?.toLowerCase() || '';
    const status = row.dataset.status?.toLowerCase() || '';

    const matchesSearch =
      searchValue === '' ||
      book.includes(searchValue) ||
      borrower.includes(searchValue) ||
      email.includes(searchValue) ||
      address.includes(searchValue);

    const matchesStatus =
      statusValue === 'all' || status === statusValue;

    const show = matchesSearch && matchesStatus;

    row.style.display = show ? 'table-row' : 'none';
  });
}

function bookSearch() {
  const searchValue = document.getElementById('bookSearch').value.toLowerCase();
  const categoryValue = document.getElementById('bookCategoryFilter').value.toLowerCase();

  const rows = document.querySelectorAll('#booksTableBody tr');
  
  rows.forEach(row => {
    const title = row.dataset.title?.toLowerCase() || '';
    const author = row.dataset.author?.toLowerCase() || '';
    const isbn = row.dataset.isbn?.toLowerCase() || '';
    const category = row.dataset.category?.toLowerCase() || '';

    const matchesSearch =
      searchValue === '' ||
      title.includes(searchValue) ||
      author.includes(searchValue) ||
      isbn.includes(searchValue) ||
      category.includes(searchValue);

    const matchesStatus =
      categoryValue === 'all' || category === categoryValue;

    const show = matchesSearch && matchesStatus;

    row.style.display = show ? 'table-row' : 'none';
  });
}

async function archiveBook(id) {
  const confirmed = await showConfirm('Are you sure you want to archive this book?');
  if (!confirmed) return;

  const res = await safeFetch(`${BOOK_API}/archive/${id}`, {
    method: 'PUT'
  });

  if (!res) return;

  if (res.ok) {
    showMessage('Book archived successfully!');
    loadBooks();
  } else {
    showMessage('Failed to archive book', 'error');
  }
}

async function deleteBook(id) {
  showCenterMessage('⚠️Warning: This will permanently remove the book!', 'error');

  const confirmed = await showConfirm(
    'Are you sure you want to delete this book? This action cannot be undone.'
  );

  if (!confirmed) return;

  const res = await safeFetch(`${BOOK_API}/${id}`, {
    method: 'DELETE'
  });
  if (!res) return;

  if (res.ok) {
    showMessage('Book deleted successfully!', 'success');
    loadBooks();
  } else {
    showMessage('Failed to delete book', 'error');
  }
}

editBorrowModalClose.addEventListener('click', () => {
  editBorrowModal.classList.remove('open');
  clearFieldErrors('editBorrowForm');
});

editBorrowModalCancel.addEventListener('click', () => {
   editBorrowModal.classList.remove('open');
   clearFieldErrors('editBorrowForm');
});

let currentEditBorrowId = null;

async function editBorrow(id) {
  currentEditBorrowId = id;

  const res = await safeFetch(`${BORROW_API}/${id}`);
  if (!res) return;

  if (!res.ok) {
    showMessage('Failed to load borrow details.', 'error');
    return;
  }

  const borrow = await res.json();

  const bookRes = await safeFetch(BOOK_API);
  if (bookRes && bookRes.ok) {
    const books = await bookRes.json();
    const editBookSelect = document.getElementById('editBookId');
    editBookSelect.innerHTML = '<option value="">Select a Book</option>';
    books.forEach(b => {
      editBookSelect.innerHTML += `<option value="${b.book_id}">${b.title}</option>`;
    });
  }

  document.getElementById('editBorrower').value = borrow.name ?? '';
  document.getElementById('editEmail').value = borrow.email ?? '';
  document.getElementById('editAddress').value = borrow.address ?? '';
  document.getElementById('editBookId').value = borrow.book_id ?? '';
  const dueDate = new Date(borrow.due_date);
  dueDate.setHours(dueDate.getHours() + 8);
  document.getElementById('editDueDate').value = dueDate.toISOString().slice(0, 10);

  editBorrowModal.classList.add('open');
}

editBorrowForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedBorrow = {
    name: document.getElementById('editBorrower').value,
    email: document.getElementById('editEmail').value,
    address: document.getElementById('editAddress').value,
    book_id: document.getElementById('editBookId').value,
    due_date: document.getElementById('editDueDate').value
  }

  const valid = validateBorrowFields(updatedBorrow, 'editBorrowForm', 'edit');
  if (!valid) return;

  const res = await safeFetch(`${BORROW_API}/${currentEditBorrowId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBorrow)
  });

  if (!res) return;

  if (res.ok) {
    showMessage('Borrow record updated successfully!');
    editBorrowForm.reset();
    editBorrowModal.classList.remove('open');
  } else {
    const result = await res.json().catch(() => ({}));
    showMessage(result.message ?? 'Failed to update borrow record.', 'error');
  }

  loadBorrows();
});

editBookModalClose.addEventListener('click', () => { 
  editBookModal.classList.remove('open');
  clearFieldErrors('editBookForm');
});

editBookModalCancel.addEventListener('click', () => { 
  editBookModal.classList.remove('open');
  clearFieldErrors('editBookForm');
});

let currentEditId = null;

//EDIT BOOK
async function editBook(id) {
  currentEditId = id;

  const res = await safeFetch(`${BOOK_API}/${id}`);
  if (!res) return;

  if (!res.ok) {
    showMessage('Failed to load book details.', 'error');
    return;
  }

  const book = await res.json();

  const categoryRes = await safeFetch(CATEGORY_API);
  if (categoryRes && categoryRes.ok) {
    const categories = await categoryRes.json();
    const editCategorySelect = document.getElementById('editCategory');
    editCategorySelect.innerHTML = '<option value="">Select a Category</option>';
    categories.forEach(cat => {
      editCategorySelect.innerHTML += `<option value="${cat.category_id}">${cat.category}</option>`;
    });
  }

  document.getElementById('editTitle').value     = book.title ?? '';
  document.getElementById('editAuthor').value    = book.author ?? '';
  document.getElementById('editIsbn').value      = book.isbn ?? '';
  document.getElementById('editPublisher').value = book.publisher ?? '';
  document.getElementById('editYear').value      = book.publication_year ?? '';
  document.getElementById('editTotal').value     = book.total_copies ?? '';
  document.getElementById('editAvailable').value = book.available_copies ?? '';
  document.getElementById('editCategory').value  = book.category_id ?? '';

  editBookModal.classList.add('open');
}

//EDIT BOOK SUBMIT
editBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updatedBook = {
    title:            document.getElementById('editTitle').value,
    author:           document.getElementById('editAuthor').value,
    isbn:             document.getElementById('editIsbn').value,
    publisher:        document.getElementById('editPublisher').value,
    publication_year: document.getElementById('editYear').value,
    total_copies:     document.getElementById('editTotal').value,
    available_copies: document.getElementById('editAvailable').value,
    category_id:      document.getElementById('editCategory').value
  };

  const valid = validateBookFields(updatedBook, 'editBookForm', 'edit');
  if (!valid) return;

  const res = await safeFetch(`${BOOK_API}/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBook)
  });

  if (!res) return;

  if (res.ok) {
    showMessage('Book updated successfully!');
    editBookForm.reset();
    editBookModal.classList.remove('open');
  } else {
    const result = await res.json().catch(() => ({}));
    showMessage('Failed to update book', 'error');
  }

  loadBooks();
});

//LOAD ARCHIVED BOOKS RECORD
async function loadArchivedBooks() {
  try {
    const res = await safeFetch(`${BOOK_API}/archived`);
    if (!res) return;
 
    if (!res.ok) {
      showMessage('Failed to load archived books.', 'error');
      return;
    }

    const books = await res.json();

    if (!Array.isArray(books)) {
      throw new Error("API did not return an array");
    }

    const tableBody = document.getElementById('booksTableBody');
    tableBody.innerHTML = '';

    if (books.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No archived books found.</td></tr>`;
      return;
    }

    books.forEach((book, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${book.title}</td>
          <td>${book.author ?? ''}</td>
          <td>${book.category ?? ''}</td>
          <td>${book.archived ? 'Archived' : 'Active'}</td>
          <td>
            <button  class="btn-action archive" onclick="unarchiveBook(${book.book_id})">Unarchive</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error('Error loading archived books:', err);
    showMessage('Failed to load archived books', 'error');
  }
}

//UNARCHIVE BOOK
async function unarchiveBook(id) {

    const confirmed = await showConfirm('Are you sure you want to unarchive this book?');
    if (!confirmed) return;

    const res = await safeFetch(`${BOOK_API}/unarchive/${id}`, { method: 'PUT' });
    if (!res) return;

    if (res.ok) {
      showMessage('Book unarchived successfully!');
      loadArchivedBooks();
    } else {
      showMessage('Failed to unarchive book', 'error');
    }
}

function showMessage(message, type = 'success') {
  const msg = document.createElement('div');

  msg.textContent = message;
  msg.className = `toast ${type}`;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.classList.add('show');
  }, 10);

  setTimeout(() => {
    msg.classList.remove('show');

    setTimeout(() => {
      msg.remove();
    }, 300);
  }, 3000);
}

function showCenterMessage(message, type = 'warning') {
  const msg = document.createElement('div');

  msg.textContent = message;
  msg.className = `center-message ${type}`;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.classList.add('show');
  }, 10);

  setTimeout(() => {
    msg.classList.remove('show');

    setTimeout(() => {
      msg.remove();
    }, 300);
  }, 2000);
}

borrowModal.classList.remove('open');
loadBooks();
loadBorrows();