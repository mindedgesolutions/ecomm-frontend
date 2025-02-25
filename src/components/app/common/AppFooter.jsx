const AppFooter = () => {
  return (
    <div className="bg-card-foreground/10 text-muted-foreground p-4 text-[10px] leading-3 tracking-widest flex flex-row justify-between items-center relative uppercase">
      Lorem ipsum dolor sit amet &copy; {new Date().getFullYear()}
    </div>
  );
};
export default AppFooter;
