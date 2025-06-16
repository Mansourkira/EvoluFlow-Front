export function useToast() {
  const toast = ({
    title,
    description,
    variant = "default",
  }: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    // For now, use alert - you can replace this with a proper toast library
    if (variant === "destructive") {
      alert(`Error: ${title}\n${description || ""}`);
    } else {
      alert(`${title}\n${description || ""}`);
    }
  };

  return { toast };
} 