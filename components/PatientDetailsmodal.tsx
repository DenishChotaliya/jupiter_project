import axios from "axios";
import React, { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { FiSearch } from "react-icons/fi";
import { Button, Checkbox, Pane, SelectMenu } from "evergreen-ui";
import { RxCross2 } from "react-icons/rx";
import { useForm } from "react-hook-form";
export interface AddPermissionModalProps {
  selectedPermissionData: any;
  modalOpenMode?: string;
  setModalOpenMode: (d?: any) => void;
}
export const MODE = {
  ADD: "ADD",
  EDIT: "EDIT",
  VIEW: "VIEW",
};

const PatientDetailsmodal = (props: AddPermissionModalProps): any => {
  const { modalOpenMode, setModalOpenMode } = props;
  // const [modules, setModules] = useState<any>([]);
  const [loadingState, setLoadingState] = useState<any>({
    isLoadingModules: false,
    isLoadingSavePermission: false,
  });
  const [loading, setLoading] = useState(false);
  const [isSelectedAllModules, setIsSelectedAllModules] =
    useState<boolean>(false);
  const [selectedModules, setSelectedModules] = useState<any>([]);

  const [open, setOpen] = useState(false);
  const [selectedModule, setSelectedModule]: any = useState(null);

  const [selected, setSelected]: any = React.useState("");
  const [{ accessToken }]: any = useCookies(["accessToken"]);
  const api = "https://jupiter.cmdev.cc";
  const [list, setList]: any = useState([]);
  const [searchModuleString, setSearchModuleString] = useState<string>("");
  const [selectModuleWithAction, setSelectModuleWithAction]: any = useState([]);
  // console.log(setSelectModuleWithAction, "selectModuleWithAction");
  const moduleRef: any = useRef(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const handleName = ({
    moduleName,
    action,
  }: {
    moduleName: string;
    action: string;
  }) => {
    console.log("dw", moduleName, action);
    return `${moduleName}_${action}`;
  };

  const handlerShowData = async () => {
    setLoading(true);
    setOpen(true);
  };
  const heandalSelecter = async (item: any) => {
    setSelected(item);
    // console.log(item);
    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      // console.log(payload);
      const res = await axios.post(
        `${api}/admin-permission-group/modules`,
        {
          roleName: `${item.key}`,
        },
        { headers: payload }
      );
      // console.log(res.data);
      setList(res.data.module);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoader(false);
      // dispatch(setLoading(false));
      console.log("Denish");
    }
  };
  // console.log(list);

  const deepClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  };
  const handleSelectModule = (module: any) => {
    // console.log(module);
    if (module) {
      setSelectedModules((d: any) => {
        const temp = deepClone(d);
        const index = temp.findIndex(
          (t: any) => t?.moduleName === module?.moduleName
        );
        if (index > -1) {
          temp.splice(index, 1);
          setSelectModuleWithAction((s: any) => {
            const temp = deepClone(s);
            module?.action?.map((a: any) => {
              const index = temp.findIndex(
                (t: any) =>
                  t ===
                  handleName({
                    moduleName: module?.moduleName,
                    action: a,
                  })
              );
              if (index >= -1) {
                temp.splice(index, 1);
              }
            });
            return temp;
          });
        } else {
          temp.push(module);
        }
        return temp;
      });
    }
  };
  // console.log(selectedModules);
  const convertToTitleCase = (str: string) => {
    return str?.replace(/\b\w+/g, (txt) => txt.charAt(0) + txt.substr(1));
  };
  const handleSelectModuleWithAction = async (list: any, action: any) => {
    if (list) {
      setSelectModuleWithAction((d: any) => {
        const temp = deepClone(d);
        const index = temp.findIndex(
          (t: any) =>
            t ===
            handleName({
              moduleName: list?.moduleName,
              action,
            })
        );
        if (index > -1) {
          temp.splice(index, 1);
        } else {
          temp.push(
            handleName({
              moduleName: list?.moduleName,
              action,
            })
          );
        }
        return temp;
      });
    }
  };

  const checkAllPermissionSelectedForCurrentModule = (item: any) => {
    // console.log(item);
    const currentModuleAllActionsTempArray = item?.action?.map((a: any) =>
      handleName({
        moduleName: item?.moduleName,
        action: a,
      })
    );

    return currentModuleAllActionsTempArray?.every((sf: any) =>
      selectModuleWithAction.includes(sf)
    );
  };

  const handleSelectAllModule = () => {
    if (!isSelectedAllModules) {
      setIsSelectedAllModules(true);
      setSelectedModules(list);
    } else {
      setIsSelectedAllModules(false);
      setSelectedModules([]);
    }
  };
  const option = [
    {
      label: "Super Admin",
      key: "SUPER_ADMIN",
    },
    {
      label: "Patient",
      key: "PATIENT",
    },
    {
      label: "Prescriber Admin",
      key: "PRESCRIBER_ADMIN",
    },
  ];

  // console.log(checkeddata);
  const extractActions = (inputString: any) => {
    return inputString.split("_").pop();
  };
  // console.log(extractActions)
  const extractModuleName = (inputString: any) => {
    return inputString.split("_").slice(0, -1).join(" ");
  };
  // console.log(extractModuleName)
  const savePermission = async (values: any) => {
    const outputArray = selectModuleWithAction.map((item: any) => ({
      action: extractActions(item),
      moduleName: extractModuleName(item),
    }));
    // console.log(selected?.label)
    // console.log(values);
    // console.log(outputArray);
    const moduleMap: any = {};
    // console.log(moduleMap);
    for (const entry of outputArray) {
      const module_name = entry.moduleName;
      const action = entry.action;

      if (module_name in moduleMap) {
        moduleMap[module_name].action.push(action);
      } else {
        moduleMap[module_name] = {
          moduleName: module_name,
          action: [action],
        };
      }
    }

    const result = Object.values(moduleMap);
    // console.log(result);
    try {
      // console.log("first");
      let res = null;
      // console.log(res);
      const payload = {
        // Authorization: `Bearer ${accessToken?.accessToken}`,
        name: values?.permissionname,
        description: values?.description,
        role: selected?.value,
        permissions: selectModuleWithAction?.map((module: any) =>
          module.toLowerCase().replace(" ", "_")
        ),
        permissionData: result,
      };
      // console.log(payload);
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingSavePermission: true,
        };
      });
      const token = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      // if (modalOpenMode === MODE.ADD) {
      res = await axios.post(
        `${api}/admin-permission-group`,

        payload,
        { headers: token }
      );
      // console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <button
        className="border bg-purple-600 hover:border-purple-600 hover:text-purple-400 hover:bg-white text-white  rounded-md h-12 w-44 duration-300 cursor-pointer truncate"
        onClick={handlerShowData}
      >
        Add Permission
      </button>

      <div
        className={`flex ${
          !open && "hidden"
        } justify-center bg-[#41414180] backdrop-blur-sm  fixed top-0 right-0 left-0 z-10 items-center md:inset-0 w-full h-screen `}
      >
        <div className="relative  w-full max-w-5xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="flex  md:p-5 border-b border-black rounded-t dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Patient Details
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
            <form onSubmit={handleSubmit(savePermission)}>
              <div className="  max-h-[400px]">
                <div className="flex w-full ">
                  <div className="w-[70%] border-r px-3 py-2  border-black ">
                    <div className="flex justify-stretch space-x-4 items-center w-full px-3">
                      <div className="w-[50%] text-left">
                        <div>
                          Permission Name<span className="text-red-600">*</span>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Add Permission Name"
                            className="border border-black outline-none rounded-lg h-8 w-full pl-1 focus:ring-2 ring-purple-300 "
                            {...register("permissionname", {
                              required: true,
                              pattern: /^([a-z])([A-Z])/i,
                              minLength: 2,
                            })}
                          />
                          {/* {errors?.permissionname?.type === "required" && (
                            <small className="text-red-500 pl-5">
                              Please enter permission name
                            </small>
                          )}
                          {errors?.permissionname?.type === "pattern" && (
                            <small className="text-red-500 pl-5">
                              Please enter permission name
                            </small>
                          )} */}
                        </div>
                      </div>
                      <div className="w-[50%] text-left">
                        <div>
                          Role<span className="text-red-600">*</span>
                        </div>
                        <div className="w-full">
                          <SelectMenu
                            options={option.map((item) => ({
                              label: item.label,
                              value: item.key,
                              key: item.key,
                            }))}
                            hasFilter={false}
                            hasTitle={false}
                            closeOnSelect={true}
                            selected={selected}
                            onSelect={(item: any) => heandalSelecter(item)}
                            height={105}
                            width={340}
                            {...register("selected")}
                          >
                            <Button className="w-full text-left">
                              {selected.label || "Select Role"}
                            </Button>
                          </SelectMenu>
                          {/* {errors?.option?.type === "required" && (
                              <small className="text-red-500 pl-5">
                                Please select roles
                              </small>
                            )} */}
                          {/* {errors.selected && <span>{errors.selected.message}</span>} */}
                        </div>
                      </div>
                    </div>
                    <div className="text-left px-3">
                      <div>
                        Description<span className="text-red-600">*</span>
                      </div>
                      <textarea
                        id="description"
                        className="textarea w-full  ring-purple-300 focus:ring-2 outline-none rounded-lg  "
                        placeholder="Enter Description"
                        {...register("description", {
                          required: true,
                        })}
                      ></textarea>
                      {/* {errors?.description?.type === "required" && (
                        <small className="text-red-500 pl-5">
                         Please enter description
                        </small>
                      )} */}
                    </div>
                    <div>
                      <div className="flex w-full h-full space-x-4 px-3 text-left">
                        <div className="w-[50%]  ">
                          <div>Configure</div>
                          <div className="relative w-full bg-gray-50 rounded-lg mt-2">
                            <input
                              type="text"
                              placeholder="Search..."
                              className={
                                "bg-transparent focus:border-purple-600 z-20 !pl-8 !pr-8 border-black border w-full outline-none text-gray-900 sm:text-sm rounded-lg block p-1 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white"
                              }
                              onChange={(e: any) =>
                                setSearchModuleString(e?.target?.value)
                              }
                            />
                            {searchModuleString === "" ? null : (
                              <p className="flex justify-center pt-5">
                                No Result Found
                              </p>
                            )}
                            <div className="absolute top-1.5 z-10 left-2.5 text-gray-500">
                              <FiSearch />
                            </div>

                            <div className="absolute top-2 z-30 cursor-pointer right-2.5 text-gray-500">
                              <RxCross2 />
                            </div>
                            <div className=" h-[calc(100vh-440px)] overflow-auto">
                              {loadingState?.isLoadingModules ? null : (
                                <>
                                  {list && list.length > 0 && (
                                    <Checkbox
                                      label={"All"}
                                      value="All"
                                      checked={isSelectedAllModules}
                                      onChange={() => handleSelectAllModule()}
                                      disabled={modalOpenMode === MODE.VIEW}
                                    >
                                      All
                                    </Checkbox>
                                  )}
                                  {!loadingState?.isLoadingModules &&
                                    list &&
                                    list?.length > 0 &&
                                    list
                                      ?.filter((item: any) =>
                                        item.moduleName
                                          .toLowerCase()
                                          .includes(
                                            searchModuleString.toLowerCase()
                                          )
                                      )
                                      .map((item: any, index: any) => (
                                        <div
                                          key={item?.moduleName}
                                          // className={AddPermissionStyles.checkboxLabel}
                                        >
                                          <Checkbox
                                            className=" flex items-center"
                                            label={item?.moduleName}
                                            value={item?.moduleName}
                                            checked={
                                              selectedModules &&
                                              selectedModules?.some(
                                                (sm: any) =>
                                                  sm?.moduleName ===
                                                  item.moduleName
                                              )
                                            } // disabled={modalOpenMode === MODE.VIEW}
                                            onChange={() => {
                                              handleSelectModule(item);
                                              setSelectedModule(
                                                item?.moduleName
                                              );
                                            }}
                                            disabled={
                                              modalOpenMode === MODE.VIEW
                                            }
                                          >
                                            {item?.moduleName}
                                          </Checkbox>
                                        </div>
                                      ))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="w-[50%] h-[calc(100vh-434px)] overflow-auto">
                          {selectedModules &&
                            selectedModules.map((item: any, index: any) => (
                              <>
                                {item?.action && (
                                  <>
                                    <div
                                      key={`item_${index}`}
                                      ref={
                                        item?.moduleName === selectedModule
                                          ? moduleRef
                                          : null
                                      }
                                      className="border-b-grey-500"
                                    >
                                      <p className="text-base bg-light-bg h-11 pl-10 font-bold flex items-center">
                                        {item?.moduleName}
                                      </p>
                                    </div>
                                    <p className="text-md font-medium pl-10 pt-3">
                                      General access and all rights below
                                    </p>
                                    <div className="">
                                      <div className="pl-10 pt-4 pb-3 inline-grid">
                                        {item.action && (
                                          <Checkbox
                                            // className={`pb-2.5 flex items-start ${AddPermissionStyles.checkboxLabel}`}
                                            checked={checkAllPermissionSelectedForCurrentModule(
                                              item
                                            )}
                                            label={"All"}
                                            // disabled={modalOpenMode === MODE.VIEW}
                                            onChange={(e) => {
                                              if (e?.target?.checked) {
                                                item.action.forEach(
                                                  (a: any) => {
                                                    setSelectModuleWithAction(
                                                      (d: any) => {
                                                        console.log(d);
                                                        return [
                                                          ...new Set([
                                                            ...d,
                                                            handleName({
                                                              moduleName:
                                                                item?.moduleName,
                                                              action: a,
                                                            }),
                                                          ]),
                                                        ];
                                                      }
                                                    );
                                                  }
                                                );
                                              } else {
                                                const currentModuleAllActionsTempArray =
                                                  item.action.map((a: any) =>
                                                    handleName({
                                                      moduleName:
                                                        item?.moduleName,
                                                      action: a,
                                                    })
                                                  );
                                                console.log(
                                                  currentModuleAllActionsTempArray
                                                );
                                                setSelectModuleWithAction(
                                                  (d: any) => {
                                                    return d.filter(
                                                      (sp: any) =>
                                                        currentModuleAllActionsTempArray.indexOf(
                                                          sp
                                                        ) === -1
                                                    );
                                                  }
                                                );
                                              }
                                            }}
                                          >
                                            All
                                          </Checkbox>
                                        )}
                                        {item?.action &&
                                          item?.action.length > 0 &&
                                          item?.action?.map(
                                            (action: any, index: any) => {
                                              return (
                                                <span
                                                  key={index}
                                                  // className={`flex items-center ${AddPermissionStyles.checkboxLabel}`}
                                                >
                                                  <>
                                                    <div className="w-[100px]">
                                                      <Checkbox
                                                        className="flex items-start"
                                                        value={action}
                                                        label={action}
                                                        disabled={
                                                          modalOpenMode ===
                                                          MODE.VIEW
                                                        }
                                                        checked={selectModuleWithAction?.some(
                                                          (a: any) =>
                                                            a ===
                                                            handleName({
                                                              moduleName:
                                                                item?.moduleName,
                                                              action,
                                                            })
                                                        )}
                                                        onChange={() => {
                                                          handleSelectModuleWithAction(
                                                            item,
                                                            action
                                                          );
                                                        }}
                                                      >
                                                        {convertToTitleCase(
                                                          action
                                                        )}
                                                      </Checkbox>
                                                    </div>
                                                    <span className="text-grey-300 capitalize  text-left">
                                                      Can {action}{" "}
                                                      {list?.moduleName}
                                                    </span>
                                                  </>
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
                  <div className="w-[30%]  text-left px-3  border-black">
                    <div>Selected</div>
                    {selectedModules &&
                      selectedModules?.map((s: any, index: any) => (
                        <div>
                          <p>{s?.moduleName}</p>
                          {s?.action?.map((a: any) =>
                            selectModuleWithAction?.map((sa: any) =>
                              sa ===
                              handleName({
                                moduleName: s?.moduleName,
                                action: a,
                              }) ? (
                                <div key={`_action${index}`} className="pt-1">
                                  <p className="leading-6 text-sm font-semibold capitalizeCustom">
                                    {a.toUpperCase()}
                                  </p>
                                </div>
                              ) : (
                                ""
                              )
                            )
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end p-3 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="ms-3  hover:bg-red-300 text-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsmodal;

{
  /* <div onClick={(e)=>{(setValue(e.target.value))}}>
                            {
                              list?.module?.map((item:any)=>{
                                return (<label htmlFor=""> {item.moduleName}
                                  <input type="checkbox" name="" id="" value={item.moduleName} />
                                </label>)
                              })
                            }
                          </div> */
}
{
  /* )} */
}
{
  /* <div>
                            {
                              value === 'Patients' && (
                                <div>
                                  Patients
                                </div>
                              )
                            },
                             {
                              value === 'Assessment Management' && (
                                <div>
                                  Assessment Management
                                </div>
                              )
                            },
                             {
                              value === 'Service Management' && (
                                <div>
                                  Service Management
                                </div>
                              )
                            }
                
                        </div> */
}
{
  /* {loading ?
                                <div className=' flex justify-center items-center '>
                                    <LoaderOnly size={15} />
                                </div>
                                : */
}
{
  /* <div>
                                    <div>
                                        <div className='p-2 !pt-0 font-semibold text-base'>
                                            Basic Information
                                        </div>
                                        <div className='p-2 border rounded-md'>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">First Name</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{patientData?.firstName || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Last Name</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{patientData?.lastName || `-`}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">Date of Birth</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{DateTime.fromISO(patientData?.dateOfBirth).toFormat('dd MMM yyyy') || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Gender</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{patientData?.gender || `-`}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">Phone</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{patientData?.phone || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Email</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{patientData?.email || `-`}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">Room No</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{patientData?.roomNumber || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Bed No</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{patientData?.bedNumber || `-`}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='p-2 !pt-4 font-semibold text-base'>
                                            General Information
                                        </div>
                                        <div className='p-2 border rounded-md'>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">Weight</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{`${patientData?.weight} Lbs` || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Height</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{`${patientData?.height} Inch.` || `-`}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1 truncate">Health Card Number</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{`${patientData?.healthCardNumber} Lbs` || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1 truncate">UID(Unique Identifier)</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{`${patientData?.height} Inch.` || `-`}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='p-2 !pt-4 font-semibold text-base'>
                                            Address List
                                        </div>
                                        <div className='p-2 border rounded-md'>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/5 m-1">Address</div>
                                                <div className="px-4 w-full py-2 items-start text-black m-1 bg-gray-200 rounded-md line-clamp-2 dark:bg-gray-700">
                                                    <span className='block'>
                                                        {`${patientData?.line1 || `-`},`}
                                                    </span>
                                                    <span>
                                                        {`${patientData?.city || `-`}, ${patientData?.zip || `-`} `}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='p-2 !pt-4
                                         font-semibold text-base'>
                                            POA Details
                                        </div>
                                        <div className='p-2 border rounded-md'>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">First Name</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{patientData?.poa?.firstName || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Last Name</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{patientData?.poa?.lastName || `-`}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">Phone</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{patientData?.poa?.phone || `-`}</div>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 my-1">Relationship</div>
                                                <div className="px-4 w-1/4 py-2 items-start text-black m-1 bg-gray-200 rounded-md truncate dark:bg-gray-700">{patientData?.poa?.relationship || `-`}</div>
                                            </div>
                                            <div className='flex justify-between'>
                                                <div className="px-4 py-2 font-semibold rounded-md w-1/4 m-1">Email</div>
                                                <div className="px-4 w-9/12 py-2 items-start text-black m-1 bg-gray-200  rounded-md truncate dark:bg-gray-700">{patientData?.poa?.email || `-`}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */
}
{
  /* } */
}
