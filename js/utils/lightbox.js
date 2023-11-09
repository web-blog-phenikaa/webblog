export function registerLightBox({
    modalElementId,
    lightBoxId,
    prevElementId,
    nextElementId,
}) {
    let current = 0;
    // find element
    const modalElement = document.getElementById(modalElementId);
    if (!modalElement) return;

    if (modalElement.dataset.registered) return;

    const lightBoxElement = document.getElementById(lightBoxId);
    const prevElement = document.getElementById(prevElementId);
    const nextElement = document.getElementById(nextElementId);

    const imgList = document.querySelectorAll('img[data-album="NghiaDz"]');

    if (!lightBoxElement || !prevElement || !nextElement) return;

    // assign src
    function assignSrc(element) {
        lightBoxElement.src = element.src;
    }
    //   show modal
    function showModal() {
        const myModal = new bootstrap.Modal(modalElement);
        if (myModal) myModal.show();
    }

    document.addEventListener("click", (event) => {
        const { target } = event;
        if (target.tagName !== "IMG" || !target.dataset.album) return;
        current = [...imgList].findIndex((x) => x === target);

        // if (current === 0 || imgList.length === 1) prevElement.classList.add('disabled')
        // else prevElement.classList.remove('disabled')

        // if (current === imgList.length - 1 || imgList.length === 1)
        //   nextElement.classList.add('disabled')
        // else nextElement.classList.remove('disabled')

        assignSrc(target);
        showModal();
    });

    prevElement.addEventListener("click", () => {
        current = current - 1 + imgList.length;

        // if (current < imgList.length - 1) nextElement.classList.remove('disabled')
        // if (current === 0 || imgList.length === 1) prevElement.classList.add('disabled')

        lightBoxElement.src = imgList[current % imgList.length].src;
    });

    nextElement.addEventListener("click", () => {
        current = (current + 1) % imgList.length;

        // if (current > 0) prevElement.classList.remove('disabled')
        // if (current === imgList.length - 1 || imgList.length === 1)
        //   nextElement.classList.add('disabled')

        lightBoxElement.src = imgList[current].src;
    });

    modalElement.dataset.registered = "true";
}
