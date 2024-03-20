import axios from "axios";
import { Button, Checkbox, SelectMenu } from "evergreen-ui";
import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { CiEdit } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

function Editpermission({ id }: any) {
  console.log(id, "id");
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [checkedata, setCheckedata]: any = useState();
  const [checkeaction, setCheckeaction]: any = useState([]);
  console.log(checkeaction, "checkeaction");
  const [viewlist, setViewlist]: any = useState();
  const [open, setOpen] = useState(false);
  const moduleRef: any = useRef(null);
  const handlerShowData = async () => {
    // setLoading(true);
    viewdata();
    setOpen(true);
  };
  const handleName = ({
    moduleName,
    action,
  }: {
    moduleName: string;
    action: string;
  }) => {
    console.log("dw", moduleName, action);
    return `${moduleName.toLowerCase()}_${action}`;
  };
  const api = "https://jupiter.cmdev.cc";
  const [{ accessToken }]: any = useCookies(["accessToken"]);
  const viewdata = async () => {
    // dispatch(setLoading(true));
    try {
      const token = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const payload = {
        roleName: id?.role,
      };
      const res = await axios.post(
        `${api}/admin-permission-group/modules`,
        payload,
        { headers: token }
      );
      // console.log(res.data);
      setViewlist(res.data.module);
      // setCheckbox(id?.permissionData?.moduleName)
      setInput(id?.name);
      setDescription(id?.description);
      setCheckedata(id?.permissionData);
      setCheckeaction(id?.permissions);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoader(false);
      // dispatch(setLoading(false));
      console.log("Denish");
    }
  };

  // console.log(setCheckeaction())
  // const checkedmodulename = (item: any) => {
  //   // console.log(item, "item");
  //   let check;
  //   if (checkedata) {
  //     checkedata?.map((item1: any) => {
  //       if (item1?.moduleName.toLowerCase() === item.toLowerCase()) {
  //         check = true;
  //       }
  //     });
  //   }
  //   return check;
  // };
  const checkedmodulename = (moduleName: any) => {
    // console.log(moduleName);
    return checkedata.some(
      (item: any) => item?.moduleName.toLowerCase() === moduleName.toLowerCase()
    );
  };
  console.log(checkedata); // check data show this log
  const handleChange = (selectedItem: any) => {
    console.log(selectedItem);
    const selectedItemIndex = checkedata.findIndex(
      (item: any) =>
        item?.moduleName.toLowerCase() ===
        selectedItem?.moduleName.toLowerCase()
    );
    console.log(selectedItemIndex);
    const newCheckedData = [...checkedata];

    if (selectedItemIndex === -1) {
      newCheckedData.push(selectedItem);
    } else {
      newCheckedData.splice(selectedItemIndex, 1);
    }

    setCheckedata(newCheckedData);
  };

  // const checkedaction = (moduleName: any) => {
  //   return checkeaction.some(
  //     (items: any) =>
  //       // item ===
  //       // `${moduleName?.moduleName?.toLowerCase()}_${moduleName?.action}`,
  //       moduleName?.action?.map((item: any) => {
  //         return items === `${moduleName?.moduleName?.toLowerCase()}_${item}`;
  //       })
  //     // console.log(item)
  //   );
  // };
  const checkedaction = (moduleName: any) => {
    return checkeaction.some((items: any) =>
      moduleName?.action?.map(
        (item: any) =>
          items === `${moduleName?.moduleName?.toLowerCase()}_${item}`
      )
    );
  };
  console.log(checkeaction);
  const deepClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  };
  const handleChangeaction = (item: any, action: any) => {
    console.log(item);
    if (item) {
      console.log(item);
      setCheckeaction((d: any) => {
        const temp = deepClone(d);
        const index = temp.findIndex(
          (t: any) =>
            t ===
            handleName({
              moduleName: item?.moduleName,
              action,
            })
        );
        if (index > -1) {
          temp.splice(index, 1);
        } else {
          temp.push(
            handleName({
              moduleName: item?.moduleName,
              action,
            })
          );
        }
        return temp;
      });
    }
    // console.log(selectedItems);
    // console.log(action, "action");
    // const selectedItemIndex = checkeaction.findIndex(
    //   (items: any) =>
    //     selectedItems?.action?.map((item: any) => {
    //       return (
    //         items === `${selectedItems?.moduleName?.toLowerCase()}_${item}`
    //       );
    //     })
    //   // console.log(item)
    // );
    // console.log(selectedItemIndex);
    // const newCheckedAction = [...checkeaction];

    // if (selectedItemIndex === -1) {
    //   newCheckedAction.push(
    //     `${selectedItems?.moduleName?.toLowerCase()}_${action}`
    //   );
    // } else {
    //   newCheckedAction.splice(selectedItemIndex, 1);
    // }
    // console.log(newCheckedAction, "newCheck");
    // setCheckeaction(newCheckedAction);
  };
  return (
    <>
      <button
        className="border bg-purple-600 hover:border-purple-600 hover:text-purple-400 hover:bg-white text-white  rounded-md  duration-300 cursor-pointer truncate"
        onClick={handlerShowData}
      >
        <CiEdit size={20} />
      </button>
      <div
        className={`flex ${
          !open && "hidden"
        } justify-center bg-[#41414180] backdrop-blur-sm  fixed top-0 right-0 left-0 z-10 items-center md:inset-0 w-full h-screen `}
      >
        <div className="relative  w-full max-w-5xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="flex  p-2 border-b border-black rounded-t dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Edit Permission
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form>
              <div className="  max-h-[400px]">
                <div className="flex w-full ">
                  <div className="w-[70%] border-r px-3 py-2  border-black ">
                    <div className="pb-2">
                      <div className="flex justify-stretch space-x-4 items-center w-full px-3">
                        <div className="w-[50%] text-left">
                          <div className="py-2 text-black font-bold ">
                            Permission Name
                            <span className="text-red-600">*</span>
                          </div>

                          <div>
                            <input
                              type="text"
                              placeholder="Add Permission Name"
                              className="border truncate border-black outline-none rounded-lg h-8 w-full pl-1 focus:ring-2 ring-purple-300 "
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="w-[50%] text-left">
                          <div className="py-2 text-black font-bold ">
                            Role<span className="text-red-600">*</span>
                          </div>
                          <div className="w-full">
                            <SelectMenu
                              options={id?.role}
                              hasFilter={false}
                              hasTitle={false}
                              closeOnSelect={true}
                              // selected={selected}
                              // onSelect={(item: any) => heandalSelecter(item)}
                              height={105}
                              width={340}
                              // {...register("selected")}
                            >
                              <Button
                                className="w-full text-left disabled:!cursor-not-allowed"
                                disabled
                              >
                                {id?.role || "Select Role"}
                              </Button>
                            </SelectMenu>
                          </div>
                        </div>
                      </div>
                      <div className="text-left px-3">
                        <div className="py-2 text-black font-bold  ">
                          Description<span className="text-red-600">*</span>
                        </div>
                        <textarea
                          id="description"
                          className="textarea w-full  ring-purple-300 focus:ring-2 outline-none rounded-lg  "
                          placeholder="Enter Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <div className="flex w-full h-full space-x-4 px-3 text-left">
                        <div className="w-[50%]  ">
                          <div className="text-black bg-gray-300 bg-opacity-75 font-bold text-base bg-light-bg h-11 pl-10  flex items-center">
                            Configure
                          </div>
                          <div className="relative w-full bg-gray-50 rounded-lg mt-2">
                            <input
                              type="text"
                              placeholder="Search..."
                              className={
                                "bg-transparent focus:border-purple-600 z-20 !pl-8 !pr-8 border-black border w-full outline-none text-gray-900 sm:text-sm rounded-lg block p-1 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white"
                              }
                              //   onChange={(e: any) =>
                              //     setSearchModuleString(e?.target?.value)
                              //   }
                            />
                            {/* {searchModuleString === "" ? null : (
                              <p className="flex justify-center pt-5">
                                No Result Found
                              </p>
                            
                            }  */}
                            <div className="absolute top-1.5 z-10 left-2.5 text-gray-500">
                              <FiSearch />
                            </div>

                            <div className="absolute top-2 z-30 cursor-pointer right-2.5 text-gray-500">
                              <RxCross2 />
                            </div>
                            <div className=" h-[calc(100vh-440px)] overflow-auto">
                              {/* {loadingState?.isLoadingModules ? null : ( */}
                              <>
                                {viewlist && viewlist?.length > 0 && (
                                  <Checkbox
                                    label={"All"}
                                    value="All"
                                    checked={
                                      viewlist.length ===
                                      id?.permissionData.length
                                    }
                                    //   onChange={() => handleSelectAllModule()}
                                    //   disabled={modalOpenMode === MODE.VIEW}
                                  >
                                    All
                                  </Checkbox>
                                )}
                                {/* {viewlist?.map((item: any, index: any) => (
                                  <div key={item?.moduleName}>
                                    <Checkbox
                                      className=" flex items-center"
                                      label={item?.moduleName}
                                      value={item?.moduleName}
                                      checked={
                                        checkedmodulename(item?.moduleName)
                                      
                                      }
                                    
                                      onChange={() => handleChange(item)}
                                      
                                    >
                                      {item?.moduleName}
                                    </Checkbox>
                                  </div>
                                ))} */}
                                {viewlist?.map((item: any, index: any) => (
                                  <div key={item?.moduleName}>
                                    <Checkbox
                                      className=" flex items-center"
                                      label={item?.moduleName}
                                      value={item?.moduleName}
                                      checked={checkedmodulename(
                                        item?.moduleName
                                      )}
                                      onChange={() => handleChange(item)}
                                    >
                                      {item?.moduleName}
                                    </Checkbox>
                                  </div>
                                ))}
                              </>
                              {/* )} */}
                            </div>
                          </div>
                        </div>

                        <div className="w-[50%] h-[calc(100vh-354px)] overflow-auto">
                          {checkedata &&
                            checkedata?.map((item: any, index: any) => (
                              <>
                                {item?.action && (
                                  <>
                                    <div
                                      key={`item_${index}`}
                                      ref={
                                        item?.moduleName === viewlist
                                          ? moduleRef
                                          : null
                                      }
                                      className="border-b-grey-500"
                                    >
                                      <p className="text-black bg-gray-300 bg-opacity-75 font-bold text-base bg-light-bg h-11 pl-10  flex items-center">
                                        {item?.moduleName}
                                      </p>
                                    </div>
                                    <p className="text-md  pl-10 pt-3 text-black font-bold">
                                      General access and all rights below
                                    </p>
                                    <div className="">
                                      <div className="pl-10 pt-4 pb-3 inline-grid">
                                        {item.action && (
                                          <Checkbox
                                            checked={checkedmodulename(
                                              item?.moduleName
                                            )}
                                            label={"All"}
                                          >
                                            All
                                          </Checkbox>
                                        )}
                                        {item?.action &&
                                          item?.action.length > 0 &&
                                          item?.action?.map(
                                            (action: any, index: any) => {
                                              return (
                                                <span key={index}>
                                                  <div className="flex items-center">
                                                    <div className="w-[100px]">
                                                      <Checkbox
                                                        checked={checkedaction(
                                                          item
                                                        )}
                                                        label={action}
                                                        // disabled={
                                                        //   !checkedmodulename(
                                                        //     item?.moduleName
                                                        //   )
                                                        // }
                                                        // onChange={() =>
                                                        //   handleChangeaction(
                                                        //     item,
                                                        //     action
                                                        //   )
                                                        // }
                                                        onChange={() => {
                                                          handleChangeaction(
                                                            item,
                                                            action
                                                          );
                                                        }}
                                                      >
                                                        {action}
                                                      </Checkbox>
                                                      {/* <Checkbox
                                                        className="flex items-start"
                                                        value={action}
                                                        label={action}
                                                        disabled={
                                                          !checkedmodulename(
                                                            item?.moduleName
                                                          )
                                                        }
                                                        checked={checkedaction(
                                                          item
                                                        )}
                                                        onChange={() =>
                                                          handleChangeaction(
                                                            item
                                                          )
                                                        }
                                                      >
                                                        {action}
                                                      </Checkbox> */}
                                                    </div>
                                                    <div className="text-grey-300 capitalize  text-left">
                                                      Can {action}{" "}
                                                      {item?.moduleName}
                                                      {/* {list?.moduleName} */}
                                                    </div>
                                                  </div>
                                                </span>
                                              );
                                            }
                                          )}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[30%] h-[357px]  text-left px-3  border-black overflow-y-auto">
                    <div className="text-black  bg-gray-300   00 bg-opacity-75 font-bold text-base bg-light-bg h-11 pl-10  flex items-center">
                      Selected
                    </div>
                    {id &&
                      id?.permissionData?.map((s: any, index: any) => (
                        <div>
                          <p className=" text-black font-bold">
                            {s?.moduleName}
                          </p>
                          {s?.action?.map((a: any) => (
                            <div>{a}</div>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end p-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="ms-3  hover:bg-red-300 text-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ms-3 text-gray-500 disabled:cursor-not-allowed bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  disabled
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Editpermission;
