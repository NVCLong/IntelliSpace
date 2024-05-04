"use client";
import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@nextui-org/react";
interface Note {
    id: string;
    content:string;
}
import {UserCircle} from "@phosphor-icons/react";

interface NoteListProps {
    notes: Note[];
}
const NoteList: React.FC<NoteListProps>=({notes})=>{


    const userId = localStorage.getItem("userId")
    const [isDone, setIsDone] = React.useState(false)
    const handleDelete=()=>{

    }

    const handleSummarize=()=>{

    }


    return (
      <>
        <div className="relative flex flex-col justify-center py-6 overflow-hidden bg-gray- sm:py-12">
          <div className="w-full max-w-screen-xl px-4 mx-auto">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {notes.map((note) => (
                <Card className="hoverScale max-w-[340px] mt-16">
                  <CardHeader className="justify-between">
                    <div className="flex gap-5">
                      <UserCircle size={30} />

                      <div className="flex flex-col items-start justify-center gap-1">
                        <h4 className="mr-4 font-semibold leading-none text-small text-default-600">
                          Note
                        </h4>
                      </div>
                    </div>
                    <Button
                      className="text-white bg-red-400"
                      color="danger"
                      radius="full"
                      size="sm"
                      variant="bordered"
                      onPress={handleDelete}>
                      Delete
                    </Button>
                    <Button
                      className={
                        isDone
                          ? "bg-green-50 text-foreground border-default-200"
                          : ""
                      }
                      color="primary"
                      radius="full"
                      size="sm"
                      variant={isDone ? "bordered" : "solid"}
                      onPress={() => setIsDone(!isDone)}
                    >
                      {isDone ? "Done" : "Processing"}
                    </Button>
                  </CardHeader>
                  <CardBody className="text-small text-default-600 ">
                    <p className="p-2">{note.content}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
}

export default NoteList
