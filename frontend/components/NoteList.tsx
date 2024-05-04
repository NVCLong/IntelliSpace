"use client";
import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@nextui-org/react";
interface Note {
    id: string;
    content:string;
}

interface NoteListProps {
    notes: Note[];
}
const NoteList: React.FC<NoteListProps>=({notes})=>{
    const userId = localStorage.getItem("userId")
    const [isDone, setIsDone] = React.useState(false)
    const handleDelete=()=>{

    }

    const handleSumarize=()=>{

    }


    return(
        <>
            <div className="relative flex flex-col justify-center p-6 overflow-hidden sm:py-12">
                <div className="w-full max-w-screen-xl px-4 mx-auto">
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {notes.map((note) => (
                            <Card className="max-w-[340px]">
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">Note</h4>
                                        </div>
                                    </div>
                                    <Button
                                        className={isDone ? "bg-green-50 text-foreground border-default-200" : ""}
                                        color="primary"
                                        radius="full"
                                        size="sm"
                                        variant={isDone ? "bordered" : "solid"}
                                        onPress={() => setIsDone(!isDone)}
                                    >
                                        {isDone ? "Done" : "Processing"}
                                    </Button>
                                </CardHeader>
                                <CardBody className="px-3 py-0 text-small text-default-400">
                                    <p>
                                        {note.content}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NoteList