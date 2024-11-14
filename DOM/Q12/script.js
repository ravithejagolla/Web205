const gallery = document.getElementById('gallery');
let page = 1;
let isLoading = false;
let allPhotos = []; // To store all photos fetched from API

// Function to fetch photos from the API
const fetchPhotos = async () => {
  if (isLoading) return; // Prevent multiple fetches at once
  isLoading = true;

  try {
    // Fetch 20 photos for each page (you can increase the number if needed)
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=20`);
    const photos = await response.json();

    // Append photos to the gallery
    photos.forEach(photo => {
      const photoCard = document.createElement('div');
      photoCard.classList.add('photo-card');

      const img = document.createElement('img');
      img.src = photo.url; // Full-size image
      img.alt = photo.title;

      const title = document.createElement('p');
      title.textContent = photo.title;

      photoCard.appendChild(img);
      photoCard.appendChild(title);

      gallery.appendChild(photoCard);
    });

    // Increase the page number for the next fetch
    page++;

    // Store the fetched photos in the allPhotos array
    allPhotos = [...allPhotos, ...photos];

    // Check if we've loaded all the data, and prevent further fetch if all photos are loaded
    if (allPhotos.length >= 5000) {  // Total available photos
      window.removeEventListener('scroll', handleScroll);
    }

  } catch (error) {
    console.error('Error fetching photos:', error);
  } finally {
    isLoading = false;
  }
};

// Function to detect when the user has scrolled to the bottom
const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottom = document.documentElement.scrollHeight;

  // If scrolled near the bottom, fetch more photos
  if (scrollPosition >= bottom - 200) {
    fetchPhotos();
  }
};

// Initial fetch
fetchPhotos();

// Event listener for scroll event
window.addEventListener('scroll', handleScroll);
