import dotenv from "dotenv";
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uis-times");
const downloadImgBtn = document.querySelector(".uis-import");
// const showLightboxBtn: HTMLElement = document.querySelector(".card img")!;
dotenv.config();
const apiKey = process.env.PEXEL_API_KEY;
const perPage = 15;
let currentPage = 1;
let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
let searchTerm;
const downloadImg = (imgURL) => {
    // Converting received img to blob, creating its download link, & downloading it
    fetch(imgURL)
        .then((res) => res.blob())
        .then((file) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime().toString();
        a.click();
    })
        .catch(() => alert("Failed to download image!"));
};
const showLightbox = (name, img) => {
    var _a;
    // Showing lightbox and setting img source, name and button attributes
    (_a = lightBox.querySelector("img")) === null || _a === void 0 ? void 0 : _a.setAttribute("src", img);
    const photographerSpan = lightBox.querySelector(".photographer span");
    if (photographerSpan !== null) {
        photographerSpan.innerHTML = name !== null && name !== void 0 ? name : '';
    }
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
};
const hideLightbox = () => {
    lightBox.classList.add("show");
    document.body.style.overflow = "auto";
};
const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images
        .map((img) => `
        <li class="card">
            <img src="${img.src.large2x}" alt="${img.alt}" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <div class="details">
                <div class="photographer">
                    <i class="uis uis-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onClick="downloadImg('${img.src.large2x}')">
                    <i class="uis uis-import"></i>
                </button>
            </div>
        </li>
    `)
        .join("");
};
const getImages = (apiURL) => {
    loadMoreBtn.innerHTML = "Loading...";
    loadMoreBtn.classList.add("disabled");
    // Fetching images by API call with authorization header
    const headers = {
        Authorization: apiKey !== null && apiKey !== void 0 ? apiKey : "",
    };
    fetch(apiURL, {
        headers
    })
        .then((res) => res.json())
        .then((data) => {
        generateHTML(data.photos);
        loadMoreBtn.innerHTML = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images"));
};
const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    // if searchTerm has some value then call API with search term else call default API
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
};
const loadSearchImages = (e) => {
    // If the search input is empty, set the search term to null and return from here
    if (e.target.value === "") {
        searchTerm = null;
        return;
    }
    // if pressed key is Enter, update the current page, search term & call the getImages
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
};
getImages(apiURL);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => {
    const img = e.target.dataset.img;
    if (img) {
        downloadImg(img);
    }
});
const colors = [
    '#0f2027',
    '#2a0845',
    '#0b8793',
    '#203a43',
    '#373b44',
    '#1f4037',
    '#93291E'
];
let currentIndex = 0;
function changeColor() {
    const background = document.querySelector(".search");
    background.style.backgroundColor = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
}
setInterval(changeColor, 5000);
