const Container = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="lg:shadow lg:border rounded-standard bg-white flex flex-col items-center w-full max-w-screen-md  mx-auto p-6 lg:p-12 mt-4 mb-12">
      {children}
    </div>
  );
};

export default Container;
