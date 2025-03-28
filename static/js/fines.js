
let booksOwed = [];
  
  // list of books and fines
  function renderFines() {
    const fineList = document.getElementById("fineList");
    const totalFineElement = document.getElementById("totalFine");
    fineList.innerHTML = ""; 
  
    let totalFine = 0;
  
    
    booksOwed.forEach((book) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
  
    
      const bookDetails = document.createElement("div");
      bookDetails.classList.add("book-details");
  
      
      const bookInfo = document.createElement("span");
      bookInfo.textContent = book.title;
  
      const fineAmount = document.createElement("span");
      fineAmount.classList.add("fine-amount");
      fineAmount.textContent = `$${book.fine.toFixed(2)}`;
  
      
      bookDetails.appendChild(bookInfo);
      bookDetails.appendChild(fineAmount);
      listItem.appendChild(bookDetails);
  
      fineList.appendChild(listItem);
  
      // Calculating total fine
      totalFine += book.fine;
    });
  
    
    totalFineElement.textContent = `R${totalFine.toFixed(2)}`;
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    renderFines();
  });
  