import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { HelpCircle } from "lucide-react";

interface FeatureTooltipProps {
  content: string;
  children?: ReactNode;
  showIcon?: boolean;
}

export function FeatureTooltip({ content, children, showIcon = true }: FeatureTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            showIcon ? (
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            ) : null
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
