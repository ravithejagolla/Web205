// Select the button and container for color data
const fetchColorsBtn = document.getElementById("fetchColorsBtn");
const colorContainer = document.getElementById("colorContainer");

// Event listener for the "Fetch Colors" button
fetchColorsBtn.addEventListener("click", fetchColorData);

function fetchColorData() {
  fetch("https://reqres.in/api/products?page=1")
    .then(response => response.json())
    .then(data => displayColors(data.data))
    .catch(error => console.error("Error fetching data:", error));
}

// Function to display color data on the webpage
function displayColors(colors) {
  colorContainer.innerHTML = ""; // Clear previous data

  colors.forEach(color => {
    // Create elements for each color's data
    const colorCard = document.createElement("div");
    colorCard.classList.add("color-card");
    colorCard.style.backgroundColor = color.color;

    const name = document.createElement("h2");
    name.textContent = color.name;

    const year = document.createElement("p");
    year.textContent = `Year: ${color.year}`;

    const pantone = document.createElement("p");
    pantone.textContent = `Pantone: ${color.pantone_value}`;

    const hexCode = document.createElement("p");
    hexCode.textContent = `Color: ${color.color}`;

    // Append elements to the color card
    colorCard.appendChild(name);
    colorCard.appendChild(year);
    colorCard.appendChild(pantone);
    colorCard.appendChild(hexCode);

    // Append color card to the container
    colorContainer.appendChild(colorCard);
  });
}
