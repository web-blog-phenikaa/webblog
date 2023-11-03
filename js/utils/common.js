export function setTextContent(liElement, selector, text) {
  const element = liElement.querySelector(selector)
  if (element) element.textContent = text
}

export function truncateDesc(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}...`
}

export function setValueForm(parent, selector, valueForm) {
  const element = parent.querySelector(selector)
  if (element) element.value = valueForm
}

export function setBackgroundImage(document, elementId, urlImage) {
  const element = document.getElementById(elementId)
  if (element) element.style.backgroundImage = `url(${urlImage})`
}

export function randomNumber(n) {
  if (n < 0) return -1

  const random = Math.random() * n

  return Math.round(random)
}
