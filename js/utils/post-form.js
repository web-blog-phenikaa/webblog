import { randomNumber, setBackgroundImage, setTextContent, setValueForm } from './common'
import * as yup from 'yup'
import { toast } from './toast'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

function setFormValue(form, formValues) {
  setValueForm(form, '[name="title"]', formValues.title)
  setValueForm(form, '[name="author"]', formValues.author)
  setValueForm(form, '[name="description"]', formValues.description)
  setValueForm(form, '[name="imageUrl"]', formValues.imageUrl)

  setBackgroundImage(document, 'postHeroImage', formValues.imageUrl)
}

function getValueForm(form) {
  const valueForm = {}

  // laays nhung truong hop checked ...
  const data = new FormData(form)
  for (const [key, values] of data) {
    valueForm[key] = values
  }

  return valueForm
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title.'),
    author: yup
      .string()
      .required('please enter author.')
      .test(
        'two-least',
        'please enter bigger than two characters',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2,
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: (schema) =>
        schema.required('please random a background image').url('please enter valid url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: (schema) =>
        schema
          .test('required', 'please select an image to upload', (file) => Boolean(file?.name))
          .test('size max image ', 'please select image have size < 3MB', (file) => {
            const size = file?.size
            const MAX_SIZE = 3 * 1024 * 1024
            return size < MAX_SIZE
          })
          .required('please enter image'),
    }),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name=${name}]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validForm(form, valueForm) {
  ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

  // yup có dùng then nên mình dùng try catch cho dễ!!
  try {
    const schema = getPostSchema()
    // validate là dùng như promise nên phải dùng await để chờ đã!!
    await schema.validate(valueForm, { abortEarly: false })
  } catch (error) {
    const containsError = {}
    if (error.name === 'ValidationError') {
      for (const validationError of error.inner) {
        const name = validationError.path

        if (containsError[name]) continue

        containsError[name] = true

        setFieldError(form, name, validationError.message)
      }
      toast.error('please enter image')
    }
  }

  const valid = form.checkValidity()
  if (!valid) form.classList.add('was-validated')

  return valid
}

function hideSubmit(form) {
  const submitElement = form.querySelector('[name="submit"]')
  if (submitElement) {
    submitElement.disabled = true
    submitElement.textContent = 'Saving ...'
  }
}

function showSubmit(form) {
  const submitElement = form.querySelector('[name="submit"]')
  if (submitElement) {
    submitElement.disabled = false
    submitElement.textContent = 'save'
  }
}

function initChangeImage(form, values) {
  const changeImage = document.getElementById('postChangeImage')

  if (!changeImage) return

  changeImage.addEventListener('click', () => {
    const urlImage = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    setValueForm(form, '[name="imageUrl"]', urlImage)

    setBackgroundImage(document, 'postHeroImage', urlImage)
  })
}

function handleChangeRadio(form, value) {
  const buttonList = form.querySelectorAll('[data-id="imageSource"]')
  buttonList.forEach((button) => {
    button.hidden = !(button.dataset.imageSource === value)
  })
}

function initOptionImage(form) {
  const imageList = form.querySelectorAll('[name="imageSource"]')
  imageList.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      handleChangeRadio(form, event.target.value)
    })
  })
}

function initUploadImage(form) {
  const uploadElement = form.querySelector('[name="image"]')
  if (!uploadElement) return

  uploadElement.addEventListener('change', (event) => {
    const file = event.target.files[0]

    if (file) {
      const imageUrl = URL.createObjectURL(file)

      setBackgroundImage(document, 'postHeroImage', imageUrl)
    }
  })
}

export function initForm({ formId, defaultValues, onSubmit }) {
  const formElement = document.getElementById(formId)
  if (!formElement) return

  setFormValue(formElement, defaultValues)
  // mỗi 1 fn 1 chức năng nên thế
  // nên tách ra thành setFormValue bởi vì còn phải khởi tạo submit và valid info
  let saving = false

  initOptionImage(formElement)

  initChangeImage(formElement, defaultValues)

  initUploadImage(formElement)

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (saving === true) return
    // get values form
    const valuesForm = getValueForm(formElement)

    valuesForm.id = defaultValues.id

    hideSubmit(formElement)

    saving = true

    // nếu không có await để đợi try catch thì luôn luôn return true !!

    const isValid = await validForm(formElement, valuesForm)
    // check valid when submit
    if (isValid) await onSubmit?.(valuesForm)

    // async ... await

    showSubmit(formElement)

    saving = false
  })
}
