import {
  AppAddEditCategory,
  AppCategoryFilter,
  AppContentWrapper,
  AppDeleteCategory,
  AppPageLoader,
  AppPaginationContainer,
  AppSkeletonTableRow,
} from "@/components";
import { serialNo } from "@/utils/functions";
import dayjs from "dayjs";
import { Pencil, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import customFetch from "@/utils/customFetch";
import showError from "@/utils/showError";
import { useLocation } from "react-router-dom";
import showSuccess from "@/utils/showSuccess";
import { setBrands } from "@/features/brandSlice";
import { setParentCategories } from "@/features/categorySlice";

const AdCategoryList = () => {
  document.title = `List of Categories | ${import.meta.env.VITE_APP_NAME}`;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ currentPage: "", lastPage: "", total: 0 });
  const { counter } = useSelector((store) => store.common);
  const [editId, setEditId] = useState(null);
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const dispatch = useDispatch();

  // ---------------------------------------------

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/admin/categories`, {
        params: {
          page: queryString.get("page"),
          p: queryString.get("p"),
        },
      });

      if (response.status === 200) {
        setData(response.data.data);
        setMeta({
          ...meta,
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total,
        });
        dispatch(setBrands(response.data.data));
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showError(error?.response?.data?.errors);
    }
  };

  // ---------------------------------------------

  useEffect(() => {
    fetchData();
  }, [counter, queryString.get("page"), queryString.get("p")]);

  // ---------------------------------------------

  const activate = async (id) => {
    setIsLoading(true);
    try {
      const response = await customFetch.put(`/admin/categories/restore/${id}`);

      if (response.status === 200) {
        fetchData();
        showSuccess("Category activated successfully");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showError(error?.response?.data?.errors);
    }
  };

  return (
    <AppContentWrapper>
      {isLoading && <AppPageLoader />}

      <div className="flex flex-row justify-between items-center bg-muted my-1 p-2">
        <h3 className="font-semibold text-xl tracking-widest text-muted-foreground">
          Categories
        </h3>
      </div>
      <AppCategoryFilter />
      <div className="flex flex-row justify-between items-center my-1 p-1 px-2">
        <p className="font-medium text-xs tracking-widest text-primary">
          Total {meta.total} records found
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4 p-2">
        <div className="basis-2/3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <AppSkeletonTableRow />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-xs uppercase text-center"
                  >
                    NO DATA FOUND
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((category, index) => {
                  return (
                    <TableRow
                      key={category.id}
                      className="text-xs uppercase group"
                    >
                      <TableCell className="font-medium">
                        {serialNo(meta.currentPage) + index}.
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category?.parent?.name || `--`}</TableCell>
                      <TableCell>
                        {dayjs(new Date(category.updated_at)).format(
                          "DD/MM/YYYY h:mm A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col md:flex-row justify-end items-center space-y-4 md:space-y-0 md:gap-4">
                          {category.is_active ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditId(category.id)}
                              >
                                <Pencil
                                  size={14}
                                  className="text-muted-foreground transition duration-200 group-hover:text-warning-foreground"
                                />
                              </button>
                              <AppDeleteCategory
                                deleteFromTable={false}
                                deleteId={category.id}
                              />
                            </>
                          ) : (
                            <>
                              <ThumbsUp
                                size={14}
                                className="text-primary cursor-pointer"
                                onClick={() => activate(category.id)}
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <AppAddEditCategory
          categories={data}
          editId={editId}
          setEditId={setEditId}
        />
      </div>
      {meta?.lastPage > 1 && (
        <AppPaginationContainer
          totalPages={meta.lastPage}
          currentPage={meta.currentPage}
          addClass={`w-2/3`}
        />
      )}
    </AppContentWrapper>
  );
};
export default AdCategoryList;

// --------------------------------------------

export const loader = (store) => async () => {
  const { parentCategories } = store.getState().categories;

  if (!parentCategories.length) {
    try {
      const response = await customFetch.get(`/master/parent-categories`);

      if (response.status === 200) {
        store.dispatch(setParentCategories(response.data));
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }
};
