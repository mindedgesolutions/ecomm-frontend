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
import { Link, useLocation } from "react-router-dom";
import showSuccess from "@/utils/showSuccess";
import { setBrands } from "@/features/brandSlice";
import { setParentCategories } from "@/features/categorySlice";
import { Button } from "@/components/ui/button";

const AdProductList = () => {
  document.title = `List of Products | ${import.meta.env.VITE_APP_NAME}`;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ currentPage: "", lastPage: "", total: 0 });
  const { counter } = useSelector((store) => store.common);
  const { currentUser } = useSelector((store) => store.currentUser);
  const [editId, setEditId] = useState(null);
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const dispatch = useDispatch();

  // ---------------------------------------------

  const fetchData = async () => {};

  // ---------------------------------------------

  useEffect(() => {}, []);

  // ---------------------------------------------

  const activate = async (id) => {};

  return (
    <AppContentWrapper>
      {isLoading && <AppPageLoader />}

      <div className="flex flex-row justify-between items-center bg-muted my-1 p-2">
        <h3 className="font-semibold text-xl tracking-widest text-muted-foreground">
          Products
        </h3>
        <Link to={`/admin/${currentUser?.user_details?.slug}/products/new`}>
          <Button size={"xs"} className="px-3 py-2">
            Add new
          </Button>
        </Link>
      </div>
      <AppCategoryFilter />
      <div className="flex flex-row justify-between items-center my-1 p-1 px-2">
        <p className="font-medium text-xs tracking-widest text-primary">
          Total {meta.total} records found
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4 p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <AppSkeletonTableRow />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-xs uppercase text-center"
                >
                  NO DATA FOUND
                </TableCell>
              </TableRow>
            ) : (
              data?.map((product, index) => {
                return (
                  <TableRow
                    key={product.id}
                    className="text-xs uppercase group"
                  >
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row justify-end items-center space-y-4 md:space-y-0 md:gap-4">
                        {product.is_active ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditId(product.id)}
                            >
                              <Pencil
                                size={14}
                                className="text-muted-foreground transition duration-200 group-hover:text-warning-foreground"
                              />
                            </button>
                            <AppDeleteCategory
                              deleteFromTable={false}
                              deleteId={product.id}
                            />
                          </>
                        ) : (
                          <>
                            <ThumbsUp
                              size={14}
                              className="text-primary cursor-pointer"
                              onClick={() => activate(product.id)}
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
      {meta?.lastPage > 1 && (
        <AppPaginationContainer
          totalPages={meta.lastPage}
          currentPage={meta.currentPage}
        />
      )}
    </AppContentWrapper>
  );
};
export default AdProductList;
