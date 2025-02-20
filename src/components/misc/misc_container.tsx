const Container = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="lg:shadow lg:border rounded-standard bg-white flex flex-col items-center w-full max-w-screen-md  mx-auto px-6 py-12 lg:px-12 xl:mt-12 mb-12">
      {children}
    </div>
  );
};

export default Container;
