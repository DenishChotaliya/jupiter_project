import { LoadingOutlined } from "@ant-design/icons";
import {
  createPermissionAPI,
  fetchModuleAPI,
  updatePermissionAPI,
} from "@redux/services/permission.api";
import { Button, Checkbox, Col, Modal, Row, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  PermissionFormInputs,
  PermissionFormValidateSchema,
} from "src/schemas/addPermissionSchema";
import AddPermissionStyles from "./addPermissionModalStyle.module.scss";
import {
  convertToTitleCase,
  deepClone,
} from "jupiter-commons/src/components/libs/helpers";
const deepClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};
import {
  MODE,
  ROLE_TYPE,
  SUCCESS_MESSAGES,
} from "jupiter-commons/src/components/libs/constants";
// export const MODE = {
//   ADD: "ADD",
//   EDIT: "EDIT",
//   VIEW: "VIEW",
// };
// export const ROLE_TYPE: Array<role_type> = [
//   { value: ROLE_TYPE_ENUM.SUPER_ADMIN, label: "Super Admin" },
//   { value: ROLE_TYPE_ENUM.PATIENT, label: "Patient" },
//   { value: ROLE_TYPE_ENUM.PRESCRIBER_ADMIN, label: "Prescriber Admin" },
// ];
 enum ROLE_ENUM {
  PRESCRIBER_ADMIN = "PRESCRIBER_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  PATIENT = "PATIENT",
}
 const ROLE: Array<role> = [
  { value: ROLE_ENUM.PRESCRIBER_ADMIN, label: "Prescriber Admin" },
  { value: ROLE_ENUM.SUPER_ADMIN, label: "Super Admin" },
  { value: ROLE_ENUM.PATIENT, label: "Patient" },
];
import {
  FormGroup,
  InputField,
  SelectField,
  TextAreaField,
} from "jupiter-commons/src/components/theme/form/formFieldsComponent";
import { SearchInputComponent } from "jupiter-commons/src/components/theme/searchInput/searchInputComponent";

export interface AddPermissionModalProps {
  isOpen?: boolean;
  onClose?: (data?: any) => void;
  handleSearch: (d?: any) => void;
  selectedPermissionData: any;
  modalOpenMode?: string;
  setSelectedPermissionData: (d?: any) => void;
  setModalOpenMode: (d?: any) => void;
}

const AddPermissionModal = (props: AddPermissionModalProps) => {
  const {
    isOpen,
    selectedPermissionData,
    modalOpenMode, 
    setSelectedPermissionData,
    setModalOpenMode,
    onClose,
  } = props;
  const { register, formState, control, watch, handleSubmit, reset } =
    useForm<PermissionFormInputs>({
      resolver: yupResolver(PermissionFormValidateSchema),
    });

  const [loadingState, setLoadingState] = useState<any>({
    isLoadingModules: false,
    isLoadingSavePermission: false,
  });

  const [modules, setModules] = useState<any>([]);
  const [searchModuleString, setSearchModuleString] = useState<string>("");
  const [selectedModules, setSelectedModules] = useState<any>([]);
  const [selectModuleWithAction, setSelectModuleWithAction]: any = useState([]);
  const [selectedModule, setSelectedModule]: any = useState(null);
  const [isSelectedAllModules, setIsSelectedAllModules] =
    useState<boolean>(false);

  const watchfield = watch();

  const fetchModuleHandler = async (
    roleName: string,
    searchString?: string
  ) => {
    try {
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingModules: true,
        };
      });
      const moduleResponse = await fetchModuleAPI(roleName, searchString);

      if (moduleResponse) {
        setModules(moduleResponse?.module);
      }
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingModules: false,
        };
      });
    } catch (error) {
      console.log(error);
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingModules: false,
        };
      });
    }
  };

  const handleName = ({
    moduleName,
    action,
  }: {
    moduleName: string;
    action: string;
  }) => {
    return `${moduleName.toLowerCase().split(" ").join("_")}_${action}`;
  };

  const handleSelectModule = (module: any) => {
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
              if (index > -1) {
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
  const handleSelectModuleWithAction = async (module: any, action: any) => {
    if (module) {
      setSelectModuleWithAction((d: any) => {
        const temp = deepClone(d);
        const index = temp.findIndex(
          (t: any) =>
            t ===
            handleName({
              moduleName: module?.moduleName,
              action,
            })
        );
        if (index > -1) {
          temp.splice(index, 1);
        } else {
          temp.push(
            handleName({
              moduleName: module?.moduleName,
              action,
            })
          );
        }
        return temp;
      });
    }
  };

  const checkAllPermissionSelectedForCurrentModule = (module: any) => {
    const currentModuleAllActionsTempArray = module.action.map((a: any) =>
      handleName({
        moduleName: module?.moduleName,
        action: a,
      })
    );
    return currentModuleAllActionsTempArray.every((item: any) =>
      selectModuleWithAction.includes(item)
    );
  };

  const moduleRef: any = useRef(null);

  const scrollToSelectedModule = () => {
    moduleRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearValues = () => {
    reset({
      name: "",
      description: "",
    });
    setIsSelectedAllModules(false);
    setModules([]);
    setSearchModuleString("");
    setSelectModuleWithAction([]);
    setSelectedModule(null);
    setSelectedModules([]);
    setSelectedPermissionData({});
    setModalOpenMode(MODE.ADD);
  };

  const extractActions = (inputString: any) => {
    return inputString.split("_").pop();
  };

  const extractModuleName = (inputString: any) => {
    return inputString.split("_").slice(0, -1).join(" ");
  };

  const onSubmit = async (values: any) => {
    const outputArray = selectModuleWithAction.map((item: any) => ({
      action: extractActions(item),
      moduleName: extractModuleName(item),
    }));

    const moduleMap: any = {};

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

    try {
      let res = null;
      const payload = {
        // id: selectedPermission?.id,
        name: values?.name
          .split(" ")
          .map(
            (word: any) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
        description: values?.description,
        role: values?.role?.value,
        permissions: selectModuleWithAction?.map((module: any) =>
          module.toLowerCase().replace(" ", "_")
        ),
        permissionData: result,
      };
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingSavePermission: true,
        };
      });
      if (modalOpenMode === MODE.ADD) {
        res = await createPermissionAPI({
          payload,
        });
      } else if (modalOpenMode === MODE.EDIT) {
        res = await updatePermissionAPI({
          payload,
          permissionGroupId: selectedPermissionData?.id,
        });
      }
      if (res) {
        if (modalOpenMode === MODE.ADD) {
          message.success(SUCCESS_MESSAGES.createPermission);
        } else if (modalOpenMode === MODE.EDIT) {
          message.success(SUCCESS_MESSAGES.updatePermission);
        }
      }
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingSavePermission: false,
        };
      });
      handleClearValues();
      if (typeof onClose !== "undefined") onClose(res);
    } catch (e) {
      console.log(e);
      setLoadingState((prevState: any) => {
        return {
          ...prevState,
          isLoadingSavePermission: false,
        };
      });
    }
  };

  const handleSelectAllModule = () => {
    if (!isSelectedAllModules) {
      setIsSelectedAllModules(true);
      setSelectedModules(modules);
    } else {
      setIsSelectedAllModules(false);
      setSelectedModules([]);
    }
  };

  useEffect(() => {
    if (watchfield["role"]) {
      fetchModuleHandler(watchfield["role"]?.value);
    }
  }, [watchfield["role"]]);

  useEffect(() => {
    if (
      selectedPermissionData &&
      selectedPermissionData?.id &&
      modalOpenMode !== MODE.ADD
    ) {
      reset({
        name: selectedPermissionData?.name,
        role: ROLE_TYPE.find(
          (role: any) => role?.value === selectedPermissionData?.role
        ),
        description: selectedPermissionData?.description,
      });

      setSelectModuleWithAction(selectedPermissionData?.permissions);
    }
  }, [selectedPermissionData]);

  useEffect(() => {
    if (selectedModule) {
      scrollToSelectedModule();
      setSelectedModule(null);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [selectedModule]);

  useEffect(() => {
    if (
      selectedPermissionData &&
      selectedPermissionData?.id &&
      modalOpenMode !== MODE.ADD
    ) {
      setSelectedModules((d: any) => {
        return modules.filter((module: any) => {
          return selectedPermissionData?.permissionData.some(
            (selectedModuleFromPermissionData: any) =>
              selectedModuleFromPermissionData.moduleName.toLowerCase() ==
              module.moduleName.toLowerCase()
          );
        });
      });
    }
  }, [modules]);

  useEffect(() => {
    if (selectedModules.length === modules.length) {
      setIsSelectedAllModules(true);
    } else {
      setIsSelectedAllModules(false);
    }
  }, [selectedModules, modules]);

  useEffect(() => {
    return () => {
      handleClearValues();
    };
  }, []);

  return (
    <>
      <Modal
        title={
          modalOpenMode === MODE.ADD
            ? "Add Permission"
            : modalOpenMode === MODE.EDIT
            ? "Edit Permission"
            : "View Permission"
        }
        width={1200}
        className={AddPermissionStyles.permissionModal}
        open={isOpen}
        onCancel={() => {
          if (typeof onClose !== "undefined") onClose();
          handleClearValues();
        }}
        footer={
          <div className="flex items-center justify-end">
            <Button
              className="!border-light-black !text-light-black hover:!text-primary hover:!border-primary rounded-[10px] !font-bold text-base min-btn-width min-btn-height"
              onClick={() => {
                if (typeof onClose !== "undefined") onClose();
                handleClearValues();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form="addEditPermissionModal"
              disabled={modalOpenMode === MODE.VIEW}
              loading={loadingState?.isLoadingSavePermission}
              className="btn-primary !ml-5 rounded-[10px] text-white text-base !font-bold min-btn-width min-btn-height antLoaderButton"
            >
              Save
            </Button>
          </div>
        }
        centered
      >
        <form id="addEditPermissionModal" onSubmit={handleSubmit(onSubmit)}>
          {" "}
          <div className={`${AddPermissionStyles.modal}`}>
            <Row>
              <Col span={18} className="border-r border-input-border pt-6">
                <div className="flex justify-start gap-7 align-center px-[35px]">
                  <FormGroup className="!mb-4 w-[48%]">
                    <InputField
                      {...{
                        register,
                        formState,
                        id: "name",
                        name: "name",
                        className: "capitalize",
                        label: "Permission Name",
                        placeholder: "Add Permission Name",
                        maxLength: 60,
                        disabled: modalOpenMode === MODE.VIEW,
                      }}
                    />
                  </FormGroup>
                  <FormGroup
                    className={`!mb-4 w-[50%] ${AddPermissionStyles.selectInput}`}
                  >
                    <div className="reactSelect">
                      <SelectField
                        {...{
                          register,
                          formState,
                          control,
                          id: "role",
                          label: "Role",
                          placeholder: "Select Role",
                          name: "role",
                          options: ROLE_TYPE,
                          isClearable: false,
                          disabled: modalOpenMode !== MODE.ADD ? true : false,
                        }}
                      />
                    </div>
                  </FormGroup>
                </div>
                <div className="px-[35px]">
                  <FormGroup className="!mb-6">
                    <TextAreaField
                      {...{
                        register,
                        formState,
                        name: "description",
                        id: "description",
                        className: "min-h-[60px] w-full",
                        label: "Description",
                        placeholder: "Enter Description",
                        maxLength: 300,
                        disabled: modalOpenMode === MODE.VIEW,
                      }}
                    />
                  </FormGroup>
                </div>
                <Row className="flex font-bold align-center justify-center">
                  <Col span={10} className="border-r border-input-border">
                    <p className="text-base bg-light-bg h-11 pl-[35px] font-bold flex items-center">
                      Configure
                    </p>
                    <div
                      className={`mt-6 flex align-center px-[35px] ${AddPermissionStyles.searchInput}`}
                    >
                      <SearchInputComponent
                        placeholder="Search"
                        handleSearch={(e: any) =>
                          setSearchModuleString(e?.target?.value)
                        }
                      />
                    </div>
                    {searchModuleString === "" ? null : (
                      <p className="flex justify-center pt-5">
                        No Result Found
                      </p>
                    )}
                    {loadingState?.isLoadingModules && (
                      <LoadingOutlined className="flex items-center justify-center mt-7" />
                    )}
                    <div
                      className={`h-[233px] ml-[35px] mt-6 modern-scrollbar overflow-y-auto ${AddPermissionStyles.checkbox} ${AddPermissionStyles.checkboxLabel}`}
                    >
                      {loadingState?.isLoadingModules ? null : (
                        <>
                          {modules &&
                            modules.length > 0 &&
                            searchModuleString === "" && (
                              <Checkbox
                                className="pb-2.5 flex items-center"
                                value="All"
                                checked={isSelectedAllModules}
                                onChange={() => handleSelectAllModule()}
                                disabled={modalOpenMode === MODE.VIEW}
                              >
                                All
                              </Checkbox>
                            )}
                          {!loadingState?.isLoadingModules &&
                            modules &&
                            modules?.length > 0 &&
                            modules
                              ?.filter((item: any) =>
                                item.moduleName
                                  .toLowerCase()
                                  .includes(searchModuleString.toLowerCase())
                              )
                              .map((module: any, index: any) => (
                                <div
                                  key={module?.moduleName}
                                  className={AddPermissionStyles.checkboxLabel}
                                >
                                  <Checkbox
                                    className="pb-2.5 flex items-center"
                                    value={module?.moduleName}
                                    disabled={modalOpenMode === MODE.VIEW}
                                    onChange={() => {
                                      handleSelectModule(module);
                                      setSelectedModule(module?.moduleName);
                                    }}
                                    checked={
                                      selectedModules &&
                                      selectedModules?.some(
                                        (sm: any) =>
                                          sm?.moduleName === module.moduleName
                                      )
                                    }
                                    disabled={
                                        permissionInfoAddEdit ===
                                        MODE.VIEW
                                    } 
                                  >
                                    {module?.moduleName}
                                  </Checkbox>
                                </div>
                              ))}
                        </>
                      )}
                    </div>
                  </Col>
                  <Col
                    span={14}
                    className="h-[368px] overflow-y-auto modern-scrollbar"
                  >
                    {selectedModules &&
                      selectedModules.map((module: any, index: any) => (
                        <>
                          {module?.action && (
                            <>
                              <div
                                key={`module_${index}`}
                                ref={
                                  module?.moduleName === selectedModule
                                    ? moduleRef
                                    : null
                                }
                                className="border-b-grey-500"
                              >
                                <p className="text-base bg-light-bg h-11 pl-10 font-bold flex items-center">
                                  {module?.moduleName}
                                </p>
                              </div>
                              <p className="text-md font-medium pl-10 pt-3">
                                General access and all rights below
                              </p>
                              <div className="">
                                <div className="pl-10 pt-4 pb-3 inline-grid">
                                  {module.action && (
                                    <Checkbox
                                      className={`pb-2.5 flex items-start ${AddPermissionStyles.checkboxLabel}`}
                                      checked={checkAllPermissionSelectedForCurrentModule(
                                        module
                                      )}
                                      disabled={modalOpenMode === MODE.VIEW}
                                      onChange={(e) => {
                                        if (e?.target?.checked) {
                                          module.action.forEach((a: any) => {
                                            setSelectModuleWithAction(
                                              (d: any) => {
                                                return [
                                                  ...new Set([
                                                    ...d,
                                                    handleName({
                                                      moduleName:
                                                        module?.moduleName,
                                                      action: a,
                                                    }),
                                                  ]),
                                                ];
                                              }
                                            );
                                          });
                                        } else {
                                          const currentModuleAllActionsTempArray =
                                            module.action.map((a: any) =>
                                              handleName({
                                                moduleName: module?.moduleName,
                                                action: a,
                                              })
                                            );
                                          setSelectModuleWithAction(
                                            (d: any) => {
                                              return d.filter(
                                                (item: any) =>
                                                  currentModuleAllActionsTempArray.indexOf(
                                                    item
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
                                  {module?.action &&
                                    module?.action.length > 0 &&
                                    module?.action?.map(
                                      (action: any, index: any) => {
                                        return (
                                          <span
                                            key={index}
                                            className={`flex items-center ${AddPermissionStyles.checkboxLabel}`}
                                          >
                                            <>
                                              <div className="w-[100px]">
                                                <Checkbox
                                                  className="pb-2.5 flex items-start"
                                                  value={action}
                                                  disabled={
                                                    modalOpenMode === MODE.VIEW
                                                  }
                                                  checked={selectModuleWithAction?.some(
                                                    (a: any) =>
                                                      a ===
                                                      handleName({
                                                        moduleName:
                                                          module?.moduleName,
                                                        action,
                                                      })
                                                  )}
                                                  onChange={() => {
                                                    handleSelectModuleWithAction(
                                                      module,
                                                      action
                                                    );
                                                  }}
                                                  // disabled={
                                                  //     permissionInfoAddEdit ===
                                                  //     MODE.VIEW
                                                  // }
                                                >
                                                  {convertToTitleCase(action)}
                                                </Checkbox>
                                              </div>
                                              <span className="text-grey-300 capitalize pb-[5px] pl-10 text-left">
                                                Can {action}{" "}
                                                {module?.moduleName}
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
                  </Col>
                </Row>
                <Row>
                  <Col
                    span={10}
                    className={`border-r border-input-border`}
                  ></Col>
                </Row>
              </Col>
              <Col span={6} className="border-l border-l-input-border">
                <div className="m-4 mr-1 mb-0 h-[605px] overflow-y-auto modern-scrollbar">
                  <p className="text-base font-semibold">Selected</p>
                  {selectedModules &&
                    selectedModules?.map((m: any, index: any) => (
                      <div key={`_module${index}`} className="py-4">
                        <p
                          onClick={() => setSelectedModule(m?.moduleName)}
                          className="text-secondary text-sm font-semibold cursor-pointer"
                        >
                          {m?.moduleName}
                        </p>

                        {m?.action?.map((a: any) =>
                          selectModuleWithAction?.map((s: any) =>
                            s ===
                            handleName({
                              moduleName: m?.moduleName,
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
              </Col>
            </Row>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddPermissionModal;
