import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "../../../components/ui/sheet";
import { useCreateCategory } from "../apis/use-create-category";
import { useNewCategory } from "../hooks/use-new-categories";
import { CategoryForm } from "./category-form";
import { insertCategorySchema } from "@/db/schema";
import {z} from "zod";


const formSchema = insertCategorySchema.pick({
    name : true
})

type  FormValues = z.input<typeof formSchema>;


export const NewCategorySheet = () =>{
    const { isOpen, onClose} = useNewCategory();

    const mutation = useCreateCategory();

    const onSumbit =(values:FormValues) =>{
        // console.log({values});
        mutation.mutate(values,{
            onSuccess: () =>{
                onClose();
            }
        });
    }
    return (
        <>
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>

                    <SheetDescription>
                        Create a new category to track your transaction
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm onSubmit={onSumbit} disabled={mutation.isPending} defaultValues={{
                    name:""
                }}/>
            </SheetContent>
        </Sheet>
        </>
    )
}