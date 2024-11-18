export const fakeData = {
  authors: [
    {
      id: '1',
      name: 'John Doe',
    },
    {
      id: '2',
      name: 'John Doe 2',
    },
  ],
  folders: [
    {
      id: '1',
      name: 'Home',
      createdAt: '2022-11-18T03:42:13Z',
      authorId: 1
    },
    {
      id: '2',
      name: 'New folder',
      createdAt: '2022-11-18T03:42:13Z',
      authorId: 2
    },
    {
      id: '3',
      name: 'Work',
      createdAt: '2022-11-18T03:42:13Z',
      authorId: 1
    },
  ],
  notes: [
    {
      id: '1',
      content: '<p>First Note</p>',
      folderId: '1',
    },
    {
      id: '2',
      content: '<p>Second Note</p>',
      folderId: '2',
    },
    {
      id: '3',
      content: '<p>Third Note</p>',
      folderId: '3',
    }
  ]
}