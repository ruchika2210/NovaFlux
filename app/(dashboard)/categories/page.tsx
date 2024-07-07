"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useNewCategory } from "@/features/categories/hooks/use-new-categories";
import { useGetCategories } from "@/features/categories/apis/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/apis/use-bulk-delete-categories";

const CategoriesPage = () => {
  const newCategory = useNewCategory();
  const categoryQuery = useGetCategories();
  const deleteCategories = useBulkDeleteCategories();
  const categories = categoryQuery.data || [];

  const isDisabled = categoryQuery.isLoading || deleteCategories.isPending;
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Categories Page</CardTitle>
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            filterkey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ json: { ids } }); // Pass ids inside { json: { ids } }
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
