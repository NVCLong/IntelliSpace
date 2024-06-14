'use client';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import {
  changeNoteStatus,
  deleteNote,
  summarizeNote,
  updateNote,
} from '@/lib/apiCall';
import TextareaAutosize from 'react-textarea-autosize';

interface Note {
  id: string;
  content: string;
  title: string;
  status: boolean;
}

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const [content, setContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [updatedNote, setUpdatedNote] = React.useState({
    content: '',
    title: '',
  });

  const userId = localStorage.getItem('userId');

  // @ts-ignore
  const handleInput = async (e) => {
    const { name, value } = e.target;
    setUpdatedNote({
      ...updatedNote,
      [name]: value,
    });
  };

  const handleDelete = async (noteId: string | null) => {
    await deleteNote(noteId);
    window.location.reload();
  };
  const handleUpdate = async (noteId: string | null) => {
    await updateNote(noteId, updatedNote);
    window.location.reload();
  };
  const handleSummarize = async (noteId: string | null) => {
    const response = await summarizeNote(noteId);
    window.location.reload();
  };
  const handleChangeStatus = async (noteId: string | null) => {
    await changeNoteStatus(noteId);
    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-col p-3 sm:py-12">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {notes.map((note) => (
              <div key={note.id}>
                <Card className="border-transparent border-3 hover:border-red-200 hover:border-3 radius">
                  <CardHeader className="justify-between">
                    <div className="gap-5 flexCenter">
                      <div className="flex flex-col items-start justify-center gap-1">
                        <TextareaAutosize
                          name="title"
                          defaultValue={note.title}
                          maxRows={1}
                          cacheMeasurements
                          onChange={handleInput}
                          className="mr-4 font-semibold leading-none font-serif p-2 border-transparent rounded-lg resize-none text-small text-default-600 border-3 hover:border-red-200 hover:border-3"
                        ></TextareaAutosize>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="p-4 space-y-3 text-small text-default-600">
                    <TextareaAutosize
                      minRows={6}
                      maxRows={10}
                      name="content"
                      cacheMeasurements
                      defaultValue={note.content}
                      onChange={handleInput}
                      className="p-2 border-2 border-gray-200 rounded-lg resize-none font-serif font-medium"
                    ></TextareaAutosize>
                    <Button
                      className="bg-gray-300 shadow-md text-foreground"
                      color="danger"
                      radius="full"
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        handleUpdate(note.id);
                      }}
                    >
                      Update
                    </Button>
                  </CardBody>

                  <CardFooter className="flex justify-between space-x-3">
                    <Button
                      className="bg-red-300 shadow-md text-foreground"
                      color="danger"
                      radius="full"
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        handleDelete(note.id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      className="bg-purple-300 shadow-md text-foreground"
                      color="secondary"
                      radius="full"
                      size="sm"
                      variant="flat"
                      onPress={() => {
                        handleSummarize(note.id);
                      }}
                    >
                      Summarize
                    </Button>
                    <Button
                      className={
                        note.status
                          ? 'bg-green-50 text-foreground border-default-200 shadow-md'
                          : 'shadow-md'
                      }
                      color="primary"
                      radius="full"
                      size="sm"
                      variant={note.status ? 'flat' : 'flat'}
                      onPress={() => {
                        handleChangeStatus(note.id);
                      }}
                    >
                      {note.status ? 'Done' : 'Processing'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NoteList;
