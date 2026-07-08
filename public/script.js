const API = "http://localhost:5000";

let allMovies = [];

// Add Movie
async function addMovie() {

    const title = document.getElementById("title").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const rating = document.getElementById("rating").value.trim();

    if (!title || !genre || !rating) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${API}/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            genre,
            rating
        })
    });

    // Clear fields
    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("rating").value = "";

    loadMovies();
}

// Load Movies
async function loadMovies() {

    try {

        const res = await fetch(`${API}/movies`);

        allMovies = await res.json();

        displayMovies(allMovies);

        updateStats();

    } catch (err) {

        console.error(err);

        document.getElementById("movies").innerHTML = `
            <div class="alert alert-danger">
                Unable to connect to server.
            </div>
        `;
    }
}

// Display Movies
function displayMovies(movies) {

    let output = "";

    if (movies.length === 0) {

        output = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    No Movies Found
                </div>
            </div>
        `;

    } else {

        movies.forEach(movie => {

            output += `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">

                        <div class="card-body">

                            <h5 class="card-title">
                                🎬 ${movie.title}
                            </h5>

                            <p>
                                Genre:
                                <span class="badge bg-info">
                                    ${movie.genre}
                                </span>
                            </p>

                            <p>
                                Rating:
                                <span class="badge bg-warning text-dark">
                                    ⭐ ${movie.rating}/10
                                </span>
                            </p>

                        </div>

                    </div>
                </div>
            `;
        });
    }

    document.getElementById("movies").innerHTML = output;
}

// Search Movie
function searchMovie() {

    const searchText =
        document.getElementById("search")
        .value
        .toLowerCase();

    const filteredMovies = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchText)
    );

    displayMovies(filteredMovies);
}

// Filter Genre
function filterGenre() {

    const selectedGenre =
        document.getElementById("genreFilter").value;

    if (selectedGenre === "") {

        displayMovies(allMovies);

        return;
    }

    const filteredMovies = allMovies.filter(movie =>
        movie.genre.toLowerCase() ===
        selectedGenre.toLowerCase()
    );

    displayMovies(filteredMovies);
}

// Statistics
function updateStats() {

    document.getElementById("totalMovies").innerText =
        allMovies.length;

    let totalRating = 0;

    allMovies.forEach(movie => {
        totalRating += Number(movie.rating);
    });

    const average =
        allMovies.length > 0
        ? (totalRating / allMovies.length).toFixed(1)
        : 0;

    document.getElementById("avgRating").innerText =
        average;

    const genres = [
        ...new Set(
            allMovies.map(movie =>
                movie.genre.toLowerCase()
            )
        )
    ];

    document.getElementById("genreCount").innerText =
        genres.length;
}

// Initial Load
loadMovies();