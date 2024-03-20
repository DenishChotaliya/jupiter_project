import React from "react";

export const Button = () => {
    const {
        
    }
  return (
    <>
      <button
            {...{ id, type, onClick }}
            disabled={isLoading || disabled}
            className={${className && className} duration-500 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base py-1.5 px-2.5 text-center disabled:bg-blue-400 dark:disabled:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800}
        >
            <span className="inline-flex items-center">
                <RoundLoader color="white" loading={isLoading} />
                <span className={`${isLoading && ml-2}`}>
                    {name}
                </span>
            </span>
        </button >
    </>
  );
};
