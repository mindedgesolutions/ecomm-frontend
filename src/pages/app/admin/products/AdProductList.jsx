import {
  AppCategoryFilter,
  AppContentWrapper,
  AppDeleteProduct,
  AppDiscountPopup,
  AppPageLoader,
  AppPaginationContainer,
  AppSkeletonTableRow,
  AppTooltip,
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
import { Button } from "@/components/ui/button";
import { updateCounter } from "@/features/commonSlice";

const AdProductList = () => {
  document.title = `List of Products | ${import.meta.env.VITE_APP_NAME}`;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ currentPage: "", lastPage: "", total: 0 });
  const { counter } = useSelector((store) => store.common);
  const { currentUser } = useSelector((store) => store.currentUser);
  const slug = currentUser?.user_details?.slug;
  const { search } = useLocation();
  const queryString = new URLSearchParams(search);
  const dispatch = useDispatch();

  // ---------------------------------------------

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(`/admin/products`, {
        params: { page: queryString.get("page") || "" },
      });

      if (response?.status === 200) {
        setData(response?.data?.data);
        setMeta({
          currentPage: response?.data?.meta?.current_page,
          lastPage: response?.data?.meta?.last_page,
          total: response?.data?.meta?.total,
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showError(error?.response?.data?.errors);
      return;
    }
  };

  // ---------------------------------------------

  useEffect(() => {
    fetchData();
  }, [counter, queryString.get("page")]);

  // ---------------------------------------------

  const activate = async (id) => {
    setIsLoading(true);
    try {
      const response = await customFetch.put(`/admin/products/restore/${id}`);
      if (response?.status === 200) {
        setIsLoading(false);
        dispatch(updateCounter());
        showSuccess(`Product activated`);
      }
    } catch (error) {
      setIsLoading(false);
      showError(error?.response?.data?.errors);
      return;
    }
  };

  return (
    <AppContentWrapper>
      {isLoading && <AppPageLoader />}

      <div className="flex flex-row justify-between items-center bg-muted my-1 p-2 py-1">
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
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Offer/s</TableHead>
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
                const img =
                  import.meta.env.VITE_BASE_URL +
                  (product?.images?.is_cover?.path ||
                    product?.images?.[0]?.path);

                const category = product?.parent_category_id ? (
                  <>
                    <div className="text-[11px] mb-1 text-muted-foreground tracking-wide">
                      {`${product?.parent_category_name} >`}
                    </div>
                    <span>{product?.category_name}</span>
                  </>
                ) : (
                  product?.category_name
                );

                return (
                  <TableRow
                    key={product.id}
                    className="text-xs uppercase group"
                  >
                    <TableCell>{serialNo(meta.currentPage) + index}.</TableCell>
                    <TableCell>
                      <div className="flex flex-row justify-start items-center space-x-2">
                        <img
                          src={img}
                          alt={product.name}
                          className="h-8 w-8 object-cover rounded-lg"
                        />
                        <span>
                          <AppTooltip content={product.name} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AppTooltip content={product.brand_name} />
                    </TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      {product?.discount?.length > 0 && (
                        <AppDiscountPopup offers={product?.discount} />
                      )}
                    </TableCell>
                    <TableCell>
                      {dayjs(new Date(product.updated_at)).format(
                        "DD/MM/YYYY h:mm A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col md:flex-row justify-end items-center space-y-4 md:space-y-0 md:gap-4">
                        {product.is_active ? (
                          <>
                            <Link
                              to={`/admin/${slug}/products/${product.id}/edit`}
                            >
                              <button type="button">
                                <Pencil
                                  size={14}
                                  className="text-muted-foreground transition duration-200 group-hover:text-warning-foreground"
                                />
                              </button>
                            </Link>
                            <AppDeleteProduct
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
