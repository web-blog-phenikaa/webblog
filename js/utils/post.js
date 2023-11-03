import dayjs from "dayjs";
import { setTextContent, truncateDesc } from "./common";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
  
export function createLiElement(data) {
    if (!data) return;
    // find template
    const templateElement = document.getElementById("postItemTemplate");
    if (!templateElement) return;

    // clone li
    const liElement = templateElement.content.firstElementChild.cloneNode(true);
    if (!liElement) return;
    // update li from API
    setTextContent(liElement, '[data-id="title"]', data.title);
    setTextContent(
        liElement,
        '[data-id="description"]',
        truncateDesc(data.description, 100)
    );
    setTextContent(liElement, '[data-id="author"]', data.author);
    setTextContent(
        liElement,
        '[data-id="timeSpan"]',
        `- ${dayjs(data.updatedAt).fromNow()}`
    );

    // const descriptionElement = liElement.querySelector('[data-id="description"]')
    // if (descriptionElement) descriptionElement.textContent = data.description

    // const authorElement = liElement.querySelector('[data-id="author"]')
    // if (authorElement) authorElement.textContent = data.author

    const imageElement = liElement.querySelector('[data-id="thumbnail"]');
    if (imageElement) {
        imageElement.src = data.imageUrl;

        imageElement.addEventListener("error", () => {
            imageElement.src = "https://placehold.co/1378x600?text=thumbNail";
        });
    }

    const divElement = liElement.firstElementChild;
    divElement.addEventListener("click", (event) => {
        if (
            event.target.dataset.id === "edit" ||
            event.target.classList.contains("fa-pen")
        )
            return;

        window.location.assign(`/post-detail.html?id=${data.id}`);
    });

    const editElement = liElement.querySelector('div[data-id="edit"]');
    editElement.addEventListener("click", (event) => {
        window.location.assign(`/add-edit-post.html?id=${data.id}`);
    });

    return liElement;
}

//Trong 2 event  , khi thằng event con nằm trong event cha thì khi sử dụng event con thì event cha cũng được chạy

export function renderPostList(elementId, postList) {
    console.log({ postList });
    if (!Array.isArray(postList)) return;

    // find ul
    const ulList = document.getElementById(elementId);
    if (!ulList) return;

    //reset lại từ đầu khi sang trang mới
    ulList.textContent = "";

    // create li
    postList.forEach((post) => {
        const liElement = createLiElement(post);
        ulList.appendChild(liElement);
    });
}
