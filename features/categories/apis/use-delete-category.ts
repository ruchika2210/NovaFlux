import {  InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

// InferResponseType and InferRequestType from hono should correctly infer the types
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({ param: { id } });
            return await response.json();
        },
        onSuccess: (data) => {
            toast.success("Category deleted");
            // Update the local data or cache
            queryClient.setQueryData(["categories", { id: id }], data);
            // Invalidate the query to refetch the updated data
            queryClient.invalidateQueries({queryKey:["categories"]});
        },
        onError: () => {
            toast.error("Failed to delete category");
        }
    });

    return mutation;
};
