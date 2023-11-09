import postApi from './api/postApi'
import { initForm, toast } from './utils'

function removeUnused(formValue) {
  const payload = { ...formValue }

  if (formValue.imageSource === 'picsum') {
    delete payload.image
  } else {
    delete payload.imageUrl
  }

  if (!payload.id) delete payload.id

  delete payload.imageSource

  return payload
}

function jsonToFormData(payload) {
  const formData = new FormData()

  for (const key in payload) {
    formData.set(key, payload[key])
  }

  console.log(formData)

  return formData
}

async function handleSubmitPost(formValue) {
  try {
    const payload = removeUnused(formValue)
    console.log(payload)
    const formData = jsonToFormData(payload)
    console.log(formData)

    const savePost = formValue.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)
    // call Api add or edit
    // show message
    toast.success('savePost success')
    //redirect home
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 5000)
  } catch (error) {}
}

;(async () => {
  try {
    const params = new URLSearchParams(window.location.search)

    // ưu tiên viết code cho người đọc code sau phát hiểu đang làm cái gì luôn

    const defaultValues = Boolean(params.get('id'))
      ? await postApi.getById(params.get('id'))
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }
    initForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handleSubmitPost,
    })
  } catch (error) {
    console.log(error)
  }
})()
