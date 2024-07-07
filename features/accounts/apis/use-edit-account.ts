import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

// InferResponseType and InferRequestType from hono should correctly infer the types
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({ json, param: { id } });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account updated");
            // Update the local data or cache

            // Invalidate the query to refetch the updated data
            queryClient.invalidateQueries({queryKey:["account",{id}]})
            queryClient.invalidateQueries({queryKey:["accounts"]});
        },
        onError: () => {
            toast.error("Failed to edit account");
        }
    });

    return mutation;
};
