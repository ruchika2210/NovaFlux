"use client";

import { Edit, Edit2Icon, MoreHorizontal, Trash } from "lucide-react";
import {DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "../../../components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/apis/use-delete-account";
import useConfirm from "@/Hooks/use-confirm";


type Props = {
    id:string;

}

export const Actions = ({id}:Props) =>{
    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to perform a delete operation");
    const deleteMutation = useDeleteAccount(id);

    const { onOpen} = useOpenAccount();
    const handleDelete = async() =>{
        const ok = await confirm();

        if(ok){
            deleteMutation.mutate()
        }
    }
    return (
        <>
        <ConfirmationDialog/>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <MoreHorizontal className="size-4"/>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() =>onOpen(id)}> 
                    <Edit className="size-4 mr-2"/>
                    Edit
                </DropdownMenuItem>

                <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}> 
                    <Trash className="size-4 mr-2"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}