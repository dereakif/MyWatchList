//Movie class: represent a movie
class Movie {
  constructor(title, year, rating) {
    this.title = title;
    this.year = year;
    this.rating = rating;
  }
}
//UI class: handle UI tasks
class UI {
  static displayMovies() {
    const movies = Store.getMovies();
    movies.forEach((movie) => UI.addMovieToList(movie));
  }
  static addMovieToList(movie) {
    const list = document.getElementById("movie-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${movie.title}</td>
    <td>${movie.year}</td>
    <td>${movie.rating}</td>
    <td> <a href="#" class="btn btn-danger btn-sm delete">X</a> </td>
    `;
    list.appendChild(row);
  }
  static deleteMovie(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.getElementById("movie-form");
    container.insertBefore(div, form);
    //vanish in 2 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }
}
//Store class: handles storage
class Store {
  static getMovies() {
    let movies;
    if (localStorage.getItem("movies") === null) {
      movies = [];
    } else {
      movies = JSON.parse(localStorage.getItem("movies"));
    }
    return movies;
  }
  static addMovies(movie) {
    const movies = Store.getMovies();
    movies.push(movie);
    localStorage.setItem("movies", JSON.stringify(movies));
  }
  static removeMovie(title) {
    const movies = Store.getMovies();

    movies.forEach((movie, index) => {
      if (movie.title === title) {
        movies.splice(index, 1);
      }
    });
    localStorage.setItem("movies", JSON.stringify(movies));
  }
}
//Event: display movie
document.addEventListener("DOMContentLoaded", UI.displayMovies);
//event: add a movie
document.getElementById("movie-form").addEventListener("submit", (e) => {
  //prevent defult
  e.preventDefault();
  //get form values
  const title = document.getElementById("title").value;
  const year = document.getElementById("year").value;
  const rating = document.getElementById("rating").value;
  //valite
  if (title === "" || year === "" || rating === "") {
    UI.showAlert("Please fill the fields.", "danger");
  } else if (isNaN(year) || year < 1888) {
    UI.showAlert("Plese enter a valid year.", "danger");
  } else if (isNaN(rating) || rating < 0 || rating > 10) {
    UI.showAlert("Please enter a valid rating.", "danger");
  } else {
    //instantiate movie
    const movie = new Movie(title, year, rating);
    //add movie to UI
    UI.addMovieToList(movie);
    //add movie to store
    Store.addMovies(movie);
    //success message
    UI.showAlert("Movie Added", "success");
    //clear fields
    document.getElementById("movie-form").reset();
  }
});
//event remove a movie
document.querySelector("#movie-list").addEventListener("click", (e) => {
  //remove movie from UI
  UI.deleteMovie(e.target);
  //remove movie from store
  Store.removeMovie(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent
  );
  //show success message
  UI.showAlert("Movie Removed", "success");
});
