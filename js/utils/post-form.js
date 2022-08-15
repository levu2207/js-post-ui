import { setBackgroundImage, setFieldValue, setTextContent, randomNumber } from './common';
import * as yup from 'yup';

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  // hero image
  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getformValues(form) {
  const formValues = {};

  // S1: query each input and add to values object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // S2: using form data
  const data = new FormData(form);

  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-word',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random background image')
        .url('Please enter a valid image url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please selected an image to upload', (file) => Boolean(file?.name))
        .test('required', 'The image is too large (max 5mb)', (file) => {
          const fileSize = file?.size || 0;

          const MAX_SIZE = 5 * 1024 * 1024; //  10KB
          return fileSize <= MAX_SIZE;
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));

    // start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    console.log(error.name);
    console.log(error.inner);

    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //  ignore if the field is alreday logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

async function validateFormField(form, formValues, name) {
  try {
    // clear previous errors
    setFieldError(form, name, '');

    const schema = getPostSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  // show validation error ( if any)
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    console.log('random image');
    // randomm ID
    // build URL
    const idRandom = randomNumber(1000);
    const imageUrl = `https://picsum.photos/id/${idRandom}/1368/400`;

    // set imageUrl input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl); // hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');
  if (radioList) {
    radioList.forEach((radio) => {
      radio.addEventListener('change', (event) =>
        renderImageSourceControl(form, event.target.value)
      );
    });
  }
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (event) => {
    console.log('selected file', event.target.files[0]);
    // get selected file
    // preview file
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(document, '#postHeroImage', imageUrl);

      // trigger validation of upload input
      validateFormField(
        form,
        {
          imageSource: ImageSource.uploadImage,
          image: file,
        },
        'image'
      );
    }
  });
}

function initValidationOnChange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (event) => {
        const newValue = event.target.value;
        validateFormField(form, { [name]: newValue }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);

  // init random Image
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);
  initValidationOnChange(form);

  let submitting = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitting) return;

    showLoading(form);
    submitting = true;

    // get form value
    const formValues = getformValues(form);
    formValues.id = defaultValues.id;

    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    // always hide loading no matter form is valid or not
    hideLoading(form);
    submitting = false;
  });
}
