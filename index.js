let myLibrary = [];

function create(val){
    return document.createElement(val);
}

function Book(title,author,pages,read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = () => `${this.title} by ${this.author}, ${this.pages} pages${read ? "" : ", not read yet"}`
}

function addBookToLibraryAndLocalStorage(title,author,pages,read){
    let b = new Book (title,author,pages,read);
    myLibrary.push(b);
    localStorage.setItem("books",JSON.stringify(myLibrary));
}

function getBooksFromLocalStorage(){
    if(localStorage.getItem("books")){
        myLibrary = JSON.parse(localStorage.getItem("books"));
        console.log("Got from local storage",myLibrary);
    }
}

function displayBooks(){
    const container = document.querySelector("#container");
    const fragment = new DocumentFragment();
    let i = 0;
    myLibrary.forEach((book)=>{
        let readButton = null;
        const div = create("div"),  
        h1 = create("h1"), 
        h2 = create("h2"),
        h3 = create("h3"),
        removeButton = create("button");
        h1.textContent = book.title;
        h2.textContent = book.author;
        h3.textContent = book.pages;
        div.className = "book";
        div.setAttribute("data",i++);
        if(book.read){
            div.style.backgroundColor = "green";
        }else{
            readButton = create("Button");
            readButton.textContent = "Read ?";
            readButton.addEventListener("click",(event)=>{
                myLibrary[event.target.parentNode.getAttribute("data")].read = true;
                clearBooksFromPage();
                displayBooks();
            })
        }
        removeButton.textContent = "Remove Book from Library";
        removeButton.addEventListener("click",removeBook);
        div.append(h1,h2,h3,removeButton,readButton || "");
        fragment.appendChild(div);
    })
    container.appendChild(fragment);
}

function prepareForm(){
    const container = document.querySelector("#container");
    clearBooksFromPage();

    //Prepare and append Form
    const labels = ["Title","Author","Pages","Read (Yes or No)"];
    const form = create("form");
    labels.forEach((label)=>{
        let labelElement = create("label"),
        inputElement = create("input");
        inputElement.type = "text";
        inputElement.value = "Hey";
        labelElement.textContent = label;
        form.append(labelElement,create("br"),inputElement,create("br"));
    })
    const submitButton = create("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    form.id = "addbook";
    form.addEventListener("submit",onSubmit);
    form.append(create("br"),submitButton);
    container.appendChild(form);
}

function onSubmit(){
    const form = document.getElementById("addbook");
    try {
        let title = form.elements[0].value, 
        author = form.elements[1].value, 
        pages = form.elements[2].value, 
        read = form.elements[3].value.trim().toLowerCase();
        if(read === "yes"){
            read = true;
        }else if(read === "no"){
            read = false;
        }else{
            throw "Read can only accept Yes/No values";
        }
        addBookToLibraryAndLocalStorage(title,author,pages,read);  
    }catch(error){
        alert("Error Occured. Details - "+error);
    }finally {
        form.parentNode.removeChild(form);
        clearBooksFromPage();
        displayBooks();
    }
}

function removeBook(event){
    myLibrary.splice(event.target.parentNode.getAttribute("data"),1);
    localStorage.setItem("books",JSON.stringify(myLibrary));
    clearBooksFromPage();
    displayBooks();
}

function clearBooksFromPage(){
    const books = document.querySelectorAll(".book"); 
    if(books.length>0){
        const container = books[0].parentNode;
        books.forEach((book) => {
            container.removeChild(book);
        })
    }
}

getBooksFromLocalStorage();
displayBooks();
// addBookToLibrary("Things Fall Apart", "Chinua Achebe", 209, false);
// addBookToLibrary("Fairy tales", "Hans Christian Andersen", 784, true);
// addBookToLibrary("The Divine Comedy", "Dante Alighieri", 928, false);
// addBookToLibrary("Pride and Prejudice", "Jane Austen", 226, true);