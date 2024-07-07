import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../../components/ui/sheet";
import { useOpenCategory } from "../hooks/use-open-categories";
import { useGetCategory } from "../apis/use-get-category";
import { Loader2 } from "lucide-react";
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useEditCategory } from "../apis/use-edit-category";
import { useDeleteCategory } from "../apis/use-delete-category";
import useConfirm from "@/Hooks/use-confirm";

const formSchema = insertCategorySchema.pick({
    name: true
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();
   
    const categoryquery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to perform a delete category");

    const isPending = editMutation.isPending || deleteMutation.isPending;
    const isLoading = categoryquery.isLoading;

 

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
        if (categoryquery.data) {
            return {
                name: categoryquery.data.name
            };
        }
        return {
            name: ""
        };
    }, [categoryquery.data]);
 
    console.log(categoryquery.data?.name,"categoryquery")

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
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    ) : (
                        <CategoryForm 
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

export default EditCategorySheet;
