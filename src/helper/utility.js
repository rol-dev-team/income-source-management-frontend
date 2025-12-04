export const capitalizeFirstLetter = (string) => {
  if (typeof string === "string" && string.length > 0) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return string;
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const hasRole = (user, role) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};
export const canChangeStatus = (user, status) => {
  if (!user || !user.role) return false;

  if (user.role.includes("admin")) {
    return true;
  }

  if (user.role.includes("user")) {
    return ["pending"].includes(status);
  }

  return false;
};

export const canEdit = (user, status) => {
  if (!user || !user.role) return false;

  if (user.role.includes("admin")) {
    return true;
  }

  if (user.role.includes("user")) {
    return ["pending", "rejected"].includes(status);
  }

  return false;
};
