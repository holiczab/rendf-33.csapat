type PagePermission = {
  path: string;
  roles: Array<string>;
};

const routePermissions: PagePermission[] = [
  {
    path: "home",
    roles: ["Operator", "Repairer", "DeviceCorrespondent"],
  },
  {
    path: "categories",
    roles: ["DeviceCorrespondent"],
  },
  {
    path: "degrees",
    roles: ["Operator"],
  },
  {
    path: "devices",
    roles: ["DeviceCorrespondent"],
  },
  {
    path: "tasks",
    roles: ["Operator", "Repairer"],
  },
];

export { routePermissions };
