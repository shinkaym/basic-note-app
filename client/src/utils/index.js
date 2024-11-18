import { graphqlRequest } from './request';

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Note($noteId: String) {
                    note(noteId: $noteId) {
                      id
                      content
                      updatedAt
                    }
                  }`;

  return await graphqlRequest({
    query,
    variables: {
      noteId,
    },
  });
};

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String!) {
                    folder(folderId: $folderId) {
                      id
                      name
                      notes {
                        id
                        content
                        updatedAt
                      }
                    }
                  }`;

  return await graphqlRequest({
    query,
    variables: {
      folderId,
    },
  });
};

export const foldersLoader = async () => {
  const query = `query Folders {
    folders {
      id
      name
      createdAt
    }
  }`;

  return await graphqlRequest({
    query,
  });
};

export const addNewFolder = async (newFolder) => {
  const query = `mutation Mutation($name: String!) {
    addFolder(name: $name) {
      name
      author {
        name
      }
    }
  }`;

  return await graphqlRequest({
    query,
    variables: {
      name: newFolder.name,
    },
  });
};

// eslint-disable-next-line no-unused-vars
export const addNewNote = async ({ params, request }) => {
  const newNote = await request.formData();

  const formDataObj = {};

  newNote.forEach((value, key) => (formDataObj[key] = value));

  const query = `mutation Mutation($content: String!, $folderId: ID!) {
    addNote(content: $content, folderId: $folderId) {
      id
      content
    }
  }`;

  const { addNote } = await graphqlRequest({
    query,
    variables: formDataObj,
  });

  return addNote;
};

// eslint-disable-next-line no-unused-vars
export const updateNote = async ({ params, request}) => {
  const updatedNote = await request.formData();
  const formDataObj = {};
  updatedNote.forEach((value, key) => (formDataObj[key] = value));
  
  const query = `mutation Mutation($id: String!, $content: String!) {
    updateNote(id: $id, content: $content) {
      id
      content
    }
  }`;

  const {updateNote} = await graphqlRequest({
    query,
    variables: formDataObj
  })

  return updateNote;
}