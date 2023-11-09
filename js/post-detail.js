import postApi from './api/postApi'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/LocalizedFormat'
import { setTextContent, registerLightBox } from './utils'

dayjs.extend(LocalizedFormat)

function renderPostDetail(post) {
  const postHeroImage = document.getElementById('postHeroImage')

  postHeroImage.style.background = `url(${post.imageUrl})`

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailTimeSpan', ` - ${dayjs(post.updatedAt).format('L LT')}`)
  setTextContent(document, '#postDetailDescription', post.description)

  const editElement = document.getElementById('goToEditPageLink')
  if (!editElement) return

  editElement.textContent = 'Edit Post'
  editElement.href = `/add-edit-post.html?id=${post.id}`
  editElement.addEventListener('click', handleEditPost)
}

;(async () => {
  registerLightBox({
    modalElementId: 'modal',
    lightBoxId: 'lightBoxImg',
    prevElementId: 'lightBoxPrev',
    nextElementId: 'lightBoxNext',
  })

  try {
    const queryParams = new URLSearchParams(window.location.search)

    const data = await postApi.getById(queryParams.get('id'))
    console.log(data)
    renderPostDetail(data)
  } catch (error) {}
})()
