import debounce from 'lodash.debounce'

export function initSearch({ elementId, params, onChange }) {
  const searchElement = document.getElementById(elementId)
  if (!searchElement) return

  searchElement.value = params.get('title_like')
  const debounceEvent = debounce((event) => {
    onChange?.(event.target.value)
  }, 500)
  searchElement.addEventListener('input', debounceEvent)
}
