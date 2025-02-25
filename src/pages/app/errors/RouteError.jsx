import { useRouteError } from "react-router-dom";

const RouteError = () => {
  const { error } = useRouteError();
  console.log(error);

  return <div>RouteError</div>;
};
export default RouteError;
