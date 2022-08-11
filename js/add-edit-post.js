import postApi from './api/postApi';
import { initPostForm } from './utils';

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

    console.log('default Values:', defaultValues);

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValue) => console.log('submit', formValue),
    });
  } catch (error) {
    console.log('failed to fetch API post detail', error);
  }
})();
