"use client";

import { Edit, Edit2Icon, MoreHorizontal } from "lucide-react";
import {DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "../../../components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";


type Props = {
    id:string;

}

export const Actions = ({id}:Props) =>{

    const { onOpen} = useOpenAccount();
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <MoreHorizontal className="size-4"/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={false} onClick={() =>onOpen(id)}> 
                    <Edit className="size-4 mr-2"/>
                    Edit
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}