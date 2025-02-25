import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, useLocation, useNavigate } from "react-router-dom";

const AppCategoryFilter = () => {
  const [parentId, setParentId] = useState("");
  const { parentCategories } = useSelector((state) => state.categories);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const navigate = useNavigate();
  const { currentUser } = useSelector((store) => store.currentUser);
  const slug = currentUser?.user_details?.slug;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parentId) {
      searchParams.delete("page");
      searchParams.set("p", parentId);
    }
    navigate(`/admin/${slug}/products/categories?${searchParams.toString()}`);
  };

  useEffect(() => {
    setParentId(searchParams.get("p") || "");
  }, []);

  const resetFilters = () => {
    navigate(`/admin/${slug}/products/categories`);
    setParentId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-end items-center bg-muted-foreground/15 gap-3 my-1 p-1 px-2">
        <select
          name="p"
          id="p"
          className="flex h-8 w-full md:w-48 items-center justify-between rounded-md bg-background px-2 py-1 text-sm focus:outline-none"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          <option value="">- Select -</option>
          {parentCategories?.map((category) => {
            return (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            );
          })}
        </select>

        <Button size="xs" type="submit">
          Search
        </Button>
        <Button
          size="xs"
          variant="ghost"
          type="button"
          className="bg-muted"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
export default AppCategoryFilter;
