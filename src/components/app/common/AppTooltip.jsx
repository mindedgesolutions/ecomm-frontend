import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AppTooltip = ({ content }) => {
  const title = content.length > 20 ? `${content.slice(0, 20)}...` : content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{title}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span className="text-xs">{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default AppTooltip;
