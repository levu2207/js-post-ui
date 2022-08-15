import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };
  // imageSource = 'pisum' --> remove image
  // imageSource = 'upload' --> remove imageUrl
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }

  // finally remove imageSource
  delete payload.imageSource;

  // remove id if it's add mode
  if (!payload.id) delete payload.id;

  return payload;
}
function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFields(formValues);
    console.log('payload:', payload);
    const formData = jsonToFormData(payload);
    console.log('form data:', formData);
    // check add/edit mode
    // S1: base on search params (check id)
    // S2: check id in formValues
    // call API

    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    // show success message
    toast.success('Save Post Successfully!');

    // redirect to detail post page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('Failed to save post', error);
    toast.error(`'Error:', ${error.message}`);
  }
}

//  main function
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    // default value for add or edit mode
    let defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => handlePostFormSubmit(formValues),
    });
  } catch (error) {
    console.log('failed to fetch API post detail', error);
  }
})();
