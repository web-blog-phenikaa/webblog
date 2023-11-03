import postApi from './api/postApi'
import { initPagination, initSearch, renderPagination, renderPostList } from './utils'

async function handleFilterChange(filterName, filterChange) {
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterChange)

  if (filterName === 'title_like') url.searchParams.set('_page', 1)

  history.pushState({}, '', url)

  const { data, pagination } = await postApi.getAll(url.searchParams)
  renderPostList('postsList', data)
  renderPagination('pagination', pagination)
}

;(async () => {
  try {
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    history.pushState({}, '', url)

    const queryParams = new URLSearchParams(window.location.search)

    initPagination({
      elementId: 'pagination',
      params: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearch({
      elementId: 'searchInput',
      params: queryParams,
      onChange: (textSearch) => handleFilterChange('title_like', textSearch),
    })

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList('postsList', data)
    renderPagination('pagination', pagination)
    console.log(data)
  } catch (error) {
    console.log('get all Failed', error)
  }
})()
