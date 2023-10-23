export const Section = ({
  applyPadding = true,
  className,
  children,
  ...SectionProps
}: {
  applyPadding?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}) => {
  return (
    <section
      className={`${
        applyPadding ? 'md:px-20 px-6 max-w-430 mx-auto' : 'mx-auto'
      } ${className}`}
      {...SectionProps}
    >
      {children}
    </section>
  );
};
