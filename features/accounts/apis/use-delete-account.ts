import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

// InferResponseType and InferRequestType from hono should correctly infer the types
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.accounts[":id"]["$delete"]({ param: { id } });
            return await response.json();
        },
        onSuccess: (data) => {
            toast.success("Account deleted");
            // Update the local data or cache
            queryClient.setQueryData(["accounts", { id: id }], data);
            // Invalidate the query to refetch the updated data
            queryClient.invalidateQueries({queryKey:["accounts"]});
        },
        onError: () => {
            toast.error("Failed to delete account");
        }
    });

    return mutation;
};
