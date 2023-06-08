const imageWrapper = document.querySelector(".images") as HTMLElement;
const searchInput = document.querySelector(".search input") as HTMLInputElement;
const loadMoreBtn = document.querySelector(".gallery .load-more") as HTMLElement;
const lightbox = document.querySelector(".lightbox") as HTMLElement;
const downloadImgBtn = lightbox.querySelector(".uis-import") as HTMLElement;
const closeImgBtn = lightbox.querySelector(".uis-times") as HTMLElement;

const apiKey: string | null = "AbWb1cZeTGI4crzYj59wKuNVgDoF7u7XEhkLGBCgHLFC0fkW7M1JxUjb";
const perPage: number = 15;
let currentPage: number = 1;
let searchTerm: string | null = null;

const downloadImg = (imgUrl: string) => {
    // Converting received img to blob, creating its download link, & downloading it
    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob: Blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = new Date().getTime().toString();
        a.click();
      })
      .catch(() => alert("Failed to download image!"));
  };

  const showLightbox = (name: string, img: string) => {
    // Showing lightbox and setting img source, name, and button attribute
    const lightboxImg = lightbox.querySelector("img") as HTMLImageElement;
    const lightboxName = lightbox.querySelector("span") as HTMLElement;
    const downloadImgBtn = lightbox.querySelector(".uis-import") as HTMLElement;

    lightboxImg.src = img;
    lightboxName.innerText = name;
    downloadImgBtn.dataset.img = img;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  };


const hideLightbox = () => {
  // Hiding lightbox on close icon click
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images: { photographer: string; src: { large2x: string } }[]) => {
  // Making li of all fetched images and adding them to the existing image wrapper
  imageWrapper.innerHTML += images
    .map(
      (img) => `
        <li class="card">
            <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>
      `
    )
    .join("");
};

const getImages = (apiURL: string) => {
  // Fetching images by API call with authorization header
  searchInput.blur();
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
      headers: { Authorization: apiKey }
  }).then(res => res.json()).then(data => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
  }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
  currentPage++; // Increment currentPage by 1
  // If searchTerm has some value then call API with search term else call default API
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
  getImages(apiUrl);
};

const loadSearchImages = (e: KeyboardEvent) => {
    // If the search input is empty, set the search term to null and return from here
    const target = e.target as HTMLInputElement;
    if (target.value === "") {
      searchTerm = null;
      return;
    }

    // If pressed key is Enter, update the current page, search term & call the getImages
    if (e.key === "Enter") {
      currentPage = 1;
      searchTerm = target.value;
      imageWrapper.innerHTML = "";
      getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
  };

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const imgUrl = target.dataset.img;
    if (imgUrl) {
      downloadImg(imgUrl);
    }
});

const colors: string[] = [
    '#0f2027',
    '#2a0845',
    '#0b8793',
    '#203a43',
    '#373b44',
    '#1f4037',
    '#93291E'
];

let currentIndex: number = 0;

function changeColor() {
    const background: HTMLElement = document.querySelector(".search")!;
    background.style.backgroundColor = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
}

setInterval(changeColor, 5000);