const Email = () => {
  const check_email = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("verifying email address");
  };
  return (
    <div className="text-center w-full">
      <h3 className="text-black font-semibold text-[15px] mb-4">
        We sent a verification link to xxxxx@gmail.com
      </h3>
      <form
        onSubmit={() => check_email}
        className="flex flex-col items-center py-4 px-4"
      >
        <span className="flex flex-row ">
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] "
            required
          />
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] "
            required
          />
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] "
            required
          />
          <input
            type="tel"
            className="border border-solid border-gray-400 rounded-2xl ml-3 px-4 w-[60px] h-[58px] "
            required
          />
        </span>
        <button className="text-white w-[153px] h-[60px] font-semibold capitalize border border-solid rounded-[15px] border-black px-4 mt-8 bg-black">
          verify
        </button>
      </form>
    </div>
  );
};

export default Email;
