import { Button } from "./button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
  containerClassName?: string
}

export function AnimatedButton({ children, className, containerClassName, ...props }: AnimatedButtonProps) {
  return (
    <div className={cn(
      "inline-block group relative bg-gradient-to-b from-primary/10 to-background/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300",
      containerClassName
    )}>
      <Button
        variant="ghost"
        className={cn(
          "rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md bg-background/95 hover:bg-background/100 transition-all duration-300 group-hover:-translate-y-0.5 border border-primary/10",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}