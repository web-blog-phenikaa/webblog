export function renderPagination(elementId, pagination) {
  if (!pagination) return
  const { _page, _limit, _totalRows } = pagination

  const totalPage = Math.ceil(_totalRows / _limit)

  // find ul
  const ulElement = document.getElementById(elementId)

  ulElement.dataset.page = _page
  ulElement.dataset.totalPages = totalPage

  if (_page <= 1) ulElement.firstElementChild?.classList.add('disabled')
  else ulElement.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPage) ulElement.lastElementChild?.classList.add('disabled')
  else ulElement.lastElementChild?.classList.remove('disabled')
}

export function initPagination({ elementId, params, onChange }) {
  // find ul
  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  // find button: prev
  const prevElement = ulElement.firstElementChild?.firstElementChild
  if (!prevElement) return

  //find button : next
  const nextElement = ulElement.lastElementChild?.firstElementChild
  if (!nextElement) return

  // addEventListener

  prevElement.addEventListener('click', (e) => {
    e.preventDefault()
    const page = Number.parseInt(ulElement.dataset.page)
    if (page > 1) onChange?.(page - 1)
  })
  nextElement.addEventListener('click', (e) => {
    e.preventDefault()
    const page = Number.parseInt(ulElement.dataset.page)
    const totalPage = ulElement.dataset.totalPages
    // tránh trường hợp F12
    if (page < totalPage) onChange?.(page + 1)
  })
}
