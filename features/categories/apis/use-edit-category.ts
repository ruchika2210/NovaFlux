import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

// InferResponseType and InferRequestType from hono should correctly infer the types
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({ json, param: { id } });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category updated");
            // Update the local data or cache

            // Invalidate the query to refetch the updated data
            queryClient.invalidateQueries({queryKey:["category",{id}]})
            queryClient.invalidateQueries({queryKey:["categories"]});
        },
        onError: () => {
            toast.error("Failed to edit category");
        }
    });

    return mutation;
};
