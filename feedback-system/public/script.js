function validateForm() {
    const teacher = document.getElementById("teacher").value;
    const rating = document.getElementById("rating").value;
    const suggestion = document.getElementById("suggestion").value;
  
    if (!teacher || !rating || !suggestion) {
      alert("Please fill in all fields.");
      return false;
    }
  
    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      alert("Rating must be between 1 and 5.");
      return false;
    }
  
    return true;
  }
  