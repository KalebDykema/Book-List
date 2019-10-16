// Used to create books that display on the book-list
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// Contains methods related to affecting the UI
class UI {
    // Adds book to list from form submission
    addBookToList(book) {
        // Assign list UI to variable
        const UIlist = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="" class="delete">X</a></td>
        `;
    
        UIlist.appendChild(row);
    }

    // Deletes books on book-list; trigged by 'X' at the end of table rows
    deleteBook(target){
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }   
    }

    // Shows an alert at the top; className can either be success or error
    showAlert(message, className) {
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        
        // Insert alert
        container.insertBefore(div, form);
        // Tiemout after 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    // Clears all fields on the form; triggered by form submit
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Contains static methods related to storing on local machine
class Store {
    // Fetches books from local storage
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    // Display locally stored books in UI
    static displayBooks() {
        const books = Store.getBooks();

        // Loops through storage
        books.forEach(function(book) {
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        });
    }

    // Adds book to storage
    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    // Remove book from storage
    static removeBook(isbn) {
        const books = Store.getBooks();

        // Loops through storage
        books.forEach(function(book, i){
            if(book.isbn === isbn){
                books.splice(i, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
    // Get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    // Instantiate Book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if(title === '' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // Add book to list
        ui.addBookToList(book);

        // Add to LS
        Store.addBook(book);

        // Show success
        ui.showAlert('Book added', 'success');

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    // Instantiate UI
    const ui = new UI();
    
    // Delete book
    ui.deleteBook(e.target);

    // Remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show alert
    if(e.target.classList.contains('delete')){
        ui.showAlert('Book removed', 'success');
    }
    e.preventDefault();
});