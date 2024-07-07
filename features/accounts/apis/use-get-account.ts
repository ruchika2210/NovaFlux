import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAccount = (id?: string) =>{
    const query = useQuery({
        enabled: !!id,
        queryKey:["account",{id}],
        queryFn : async () =>{
            // const response = await client.api.accounts[":id"].$get({
            //     param : {id}
            // })
            // if (!id) {
            //     throw new Error("ID is required to fetch individual account");
            //   }
            const response = await client.api.accounts[":id"].$get({
                param:{id}
            });

            console.log(id)



            if(!response.ok){
                throw new Error("Failed to fetch individual account")
            }

            const {data}= await response.json();
            // const responseData = await response.json();
            // const  data  = responseData.data.name; 
            console.log(data,"dataa")
            return data;
        }
    })

    return query;
}