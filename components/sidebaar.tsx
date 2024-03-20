import React from "react";
import { List, ListItem, ListItemPrefix, Card } from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { IoKeyOutline, IoPersonAddOutline } from "react-icons/io5";

function Sidebaar() {
  const router = useRouter();
  const pathname = usePathname()

  return (
    <>
      <Card
        className="w-full sticky border shadow-xl shadow-blue-gray-900/5"
        placeholder={Card}
      >
        <List placeholder={List}>
          <ListItem placeholder={ListItem} className=" max-w-[10rem]">
            <ListItemPrefix placeholder={ListItemPrefix}>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
          <ListItem
            className={`${pathname === `/productlist` && `bg-blue-gray-50/80`} max-w-[10rem] `}
            placeholder={ListItem} 
            onClick={() => {
              router.push(`/productlist`);
            }}
          >
            <ListItemPrefix placeholder={ListItemPrefix}>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Product-List
          </ListItem>
          <ListItem
            className={`${pathname === `/patients` && `bg-blue-gray-50/80`} max-w-[10rem] `}
            placeholder={ListItem}
            onClick={() => {
              router.push(`/patients`);
            }}
          >
            <ListItemPrefix placeholder={ListItemPrefix}>
            <IoPersonAddOutline className="h-5 w-5"/>
            </ListItemPrefix>
            Patients
          </ListItem>
          <ListItem
            className={`${pathname === `/permission` && `bg-blue-gray-50/80`} max-w-[10rem] `}
            placeholder={ListItem}
            onClick={() => {
              router.push(`/permission`);
            }}
          >
            <ListItemPrefix placeholder={ListItemPrefix}>
            <IoKeyOutline className="h-5 w-5" />
            </ListItemPrefix>
            Permission Mgmt.
          </ListItem>
        </List>
      </Card>
    </>
  );
}

export default Sidebaar;
