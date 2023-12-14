"use client";

export function Revalidate({
  buttonText = "Revalidate",
  className,
  tag,
}: {
  tag: string;
  className?: string;
  buttonText?: string;
}) {
  return (
    <button
      type="submit"
      onClick={() => {
        void fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag }),
        });
      }}
      className={className}
    >
      {buttonText}
    </button>
  );
}
