import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../apis/use-get-account";
import { Loader2 } from "lucide-react";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useEditAccount } from "../apis/use-edit-account";
import { useDeleteAccount } from "../apis/use-delete-account";
import useConfirm from "@/Hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();
   
    const accountquery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);

    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to perform a delete operation");

    const isPending = editMutation.isPending || deleteMutation.isPending;
    const isLoading = accountquery.isLoading;

 

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    // const defaultValues = accountquery.data?.name ? {
    //     name: accountquery.data.name
    // } : {
    //     name: ""
    // };

    const defaultValues: FormValues = React.useMemo(() => {
        if (accountquery.data) {
            return {
                name: accountquery.data.name
            };
        }
        return {
            name: ""
        };
    }, [accountquery.data]);
 
    console.log(accountquery.data?.name,"accountquery")

    // console.log(accountquery,"accountquery");
    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

   

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    ) : (
                        <AccountForm 
                          id={id}
                         onSubmit={onSubmit}
                           disabled={isPending} 
                           defaultValues={defaultValues} 
                           onDelete={onDelete} 
                            />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
};

export default EditAccountSheet;
