// import { InferRequestType, InferResponseType } from "hono";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { client } from "@/lib/hono";
// import { toast } from "sonner";

// type ResponseType = InferResponseType<
//   (typeof client.api.accounts)["bulk-delete"]["$post"]
// >;
// type RequestType = InferRequestType<
//   (typeof client.api.accounts)["bulk-delete"]["$post"]
// >;

// export const useBulkDeleteAccounts = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation<ResponseType, Error, RequestType>({
//     mutationFn: async (json) => {
//       const response = await client.api.accounts["bulk-delete"]["$post"]({
//         json,
//       });
//       return await response.json();
//     },
//     onSuccess: () => {
//       toast.success("Account Delete");
//       queryClient.invalidateQueries({ queryKey: ["accounts"] });
//     },

//     onError: () => {
//       toast.error("Failed to delete accounts");
//     },
//   });

//   return mutation;
// };

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json: RequestType) => {
      const ids: string[] = json.ids ?? []; // Ensure ids are extracted from json
      const response = await client.api.accounts["bulk-delete"]["$post"]({
        json: { ids }, // Pass ids to the server API
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Delete"); // Notify success with toast
      queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate accounts query after successful deletion
    },
    onError: () => {
      toast.error("Failed to delete accounts"); // Notify error with toast
    },
  });

  return mutation;
};
