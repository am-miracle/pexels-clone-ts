const imagesWrapper: HTMLElement = document.querySelector(".images")!;
const loadMoreBtn: HTMLElement = document.querySelector(".load-more")!;
const searchInput: HTMLElement = document.querySelector(".search-box input")!;
const lightBox: HTMLElement = document.querySelector(".lightbox")!;
const closeBtn: HTMLElement = document.querySelector(".uis-times")!;
const downloadImgBtn: HTMLElement = document.querySelector(".uis-import")!;


// const apiKey: string | undefined = process.env.PEXEL_API_KEY;
const apiKey: string | undefined = "AbWb1cZeTGI4crzYj59wKuNVgDoF7u7XEhkLGBCgHLFC0fkW7M1JxUjb";


const perPage: number = 15;
let currentPage: number = 1;
let apiURL: string = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
let searchTerm: string | null;

interface Image {
    src: {
      large2x: string;
    };
    alt: string;
    photographer: string;
}

const downloadImg = (imgURL: string): void => {
    // Converting received img to blob, creating its download link, & downloading it
    fetch(imgURL)
        .then((res: Response) => res.blob())
        .then((file: Blob) => {
            const a: HTMLAnchorElement = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime().toString();
            a.click();
        })
        .catch(() => alert("Failed to download image!"));
};

const showLightbox = (name: string, img: string): void => {
    // Showing lightbox and setting img source, name and button attributes
    lightBox.querySelector("img")?.setAttribute("src", img);
    const photographerSpan = lightBox.querySelector(".photographer span");
    if (photographerSpan !== null) {
        photographerSpan.innerHTML = name ?? '';
    }
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
    lightBox.classList.add("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images: Image[]): void => {
// Making li of all fetched images and adding them to the existing image wrapper
imagesWrapper.innerHTML += images
    .map(
    (img: Image) => `
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
    `
    )
    .join("");
};

const getImages = (apiURL: string): void => {
    loadMoreBtn.innerHTML = "Loading...";
    loadMoreBtn.classList.add("disabled");
    // Fetching images by API call with authorization header
    const headers: HeadersInit = {
        Authorization: apiKey ?? "",
    };
    fetch(apiURL, {
      headers
    })
      .then((res: Response) => res.json())
      .then((data: { photos: Image[] }) => {
        generateHTML(data.photos);
        loadMoreBtn.innerHTML = "Load More";
        loadMoreBtn.classList.remove("disabled");
      }).catch(() => alert("Failed to load images"));
  };

const loadMoreImages = (): void => {
    currentPage++; // Increment currentPage by 1
    // if searchTerm has some value then call API with search term else call default API
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL
    getImages(apiURL);
};

const loadSearchImages = (e: KeyboardEvent): void => {
    // If the search input is empty, set the search term to null and return from here
    if ((e.target as HTMLInputElement).value === "") {
        searchTerm = null;
        return;
    }
    // if pressed key is Enter, update the current page, search term & call the getImages
     if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = (e.target as HTMLInputElement).value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
     }
}

getImages(apiURL);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e: MouseEvent) => {
    const img = (e.target as HTMLElement).dataset.img;
    if (img) {
      downloadImg(img);
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